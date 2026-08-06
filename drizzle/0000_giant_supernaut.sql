CREATE TABLE "lead_files" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"file_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" bigint NOT NULL,
	"storage_key" text NOT NULL,
	"original_name" text NOT NULL,
	"media_type" text NOT NULL,
	"byte_size" bigint NOT NULL,
	"checksum_sha256" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"lead_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"idempotency_key" uuid NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"project_context" text,
	"source_path" text DEFAULT '/' NOT NULL,
	"attribution" jsonb,
	"consent_policy_version" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lead_files" ADD CONSTRAINT "lead_files_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "lead_files_file_id_unique" ON "lead_files" USING btree ("file_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lead_files_storage_key_unique" ON "lead_files" USING btree ("storage_key");--> statement-breakpoint
CREATE INDEX "lead_files_lead_id_idx" ON "lead_files" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "lead_files_status_created_at_idx" ON "lead_files" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "leads_lead_id_unique" ON "leads" USING btree ("lead_id");--> statement-breakpoint
CREATE UNIQUE INDEX "leads_idempotency_key_unique" ON "leads" USING btree ("idempotency_key");--> statement-breakpoint
CREATE INDEX "leads_status_created_at_idx" ON "leads" USING btree ("status","created_at");