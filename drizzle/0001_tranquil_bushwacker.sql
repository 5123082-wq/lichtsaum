ALTER TABLE "leads" ADD COLUMN "upload_token_hash" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "upload_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "retention_until" timestamp with time zone;