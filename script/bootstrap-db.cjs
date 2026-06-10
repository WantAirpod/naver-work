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
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("[bootstrap-db] failed:", err);
  process.exit(1);
});
