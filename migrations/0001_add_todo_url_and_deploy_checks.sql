ALTER TABLE "todos" ADD COLUMN IF NOT EXISTS "url" text;
--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "qa_completed" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "code_review_completed" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN IF NOT EXISTS "todo_date" date DEFAULT CURRENT_DATE NOT NULL;
--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "reference_url" text;
