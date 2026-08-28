/**
 * One-shot DB bootstrap for first deploy:
 *   1. If `tasks` table is missing, runs the generated migration SQL.
 *   2. If `tasks` table is empty, loads data from backups/prod_backup.sql.
 * Idempotent: subsequent runs no-op when schema + data already exist.
 */

const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

async function tableExists(client, name) {
  const { rows } = await client.query(
    `SELECT to_regclass($1) AS oid`,
    [`public.${name}`],
  );
  return rows[0].oid !== null;
}

async function tableEmpty(client, name) {
  const { rows } = await client.query(`SELECT count(*)::int AS c FROM ${name}`);
  return rows[0].c === 0;
}

async function runSqlFile(client, filePath) {
  const sql = fs.readFileSync(filePath, "utf8");
  await client.query(sql);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("[bootstrap-db] DATABASE_URL not set, skipping");
    process.exit(0);
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const schemaExists = await tableExists(client, "tasks");
    if (!schemaExists) {
      const migrationsDir = path.join(__dirname, "..", "migrations");
      const files = fs
        .readdirSync(migrationsDir)
        .filter((f) => f.endsWith(".sql"))
        .sort();
      for (const file of files) {
        console.log(`[bootstrap-db] applying migration ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
        // Split on drizzle-kit's statement-breakpoint marker so each CREATE runs separately
        const statements = sql
          .split("--> statement-breakpoint")
          .map((s) => s.trim())
          .filter(Boolean);
        for (const stmt of statements) {
          await client.query(stmt);
        }
      }
      console.log("[bootstrap-db] schema created");
    } else {
      console.log("[bootstrap-db] schema already present, skipping migration");
    }

    // Reconcile constraints that diverged from production (backup has nullable values)
    await client.query(
      `ALTER TABLE tasks ALTER COLUMN ticket_url DROP NOT NULL`,
    );

    // Deploy-round feature. Migrations above only run on a missing `tasks` table,
    // so schema additions have to be reconciled here to reach an existing database.
    await client.query(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS deploy_date date`);
    await client.query(
      `ALTER TABLE tasks ADD COLUMN IF NOT EXISTS milestone_registered boolean DEFAULT false NOT NULL`,
    );
    await client.query(`
      CREATE TABLE IF NOT EXISTS task_prs (
        "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "task_id" integer NOT NULL,
        "url" text NOT NULL,
        "reviewed" boolean DEFAULT false NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `);

    if (await tableEmpty(client, "tasks")) {
      const backupPath = path.join(
        __dirname,
        "..",
        "backups",
        "prod_backup.sql",
      );
      if (fs.existsSync(backupPath)) {
        console.log(`[bootstrap-db] loading data from ${backupPath}`);
        await runSqlFile(client, backupPath);
        console.log("[bootstrap-db] data loaded");
      } else {
        console.log("[bootstrap-db] no backup file found, skipping data load");
      }
    } else {
      console.log("[bootstrap-db] data already present, skipping data load");
    }

    // One-shot move of legacy tasks.pr_url into task_prs. Must run after the backup
    // load, otherwise a cold start migrates nothing and then imports pr_url values.
    // Consuming the source is the idempotency guard: re-runs find nothing, and a PR
    // the user deletes in the UI cannot be resurrected on the next deploy.
    const { rowCount: migratedPrs } = await client.query(`
      WITH moved AS (
        INSERT INTO task_prs (task_id, url)
        SELECT id, btrim(pr_url)
        FROM tasks
        WHERE pr_url IS NOT NULL AND btrim(pr_url) <> ''
        RETURNING task_id
      )
      UPDATE tasks SET pr_url = NULL WHERE id IN (SELECT task_id FROM moved)
    `);
    if (migratedPrs > 0) {
      console.log(`[bootstrap-db] migrated ${migratedPrs} pr_url value(s) into task_prs`);
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("[bootstrap-db] failed:", err);
  process.exit(1);
});
