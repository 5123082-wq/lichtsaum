import {
  bigint,
  bigserial,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

import type { LeadRequestContext } from "@/features/lead-form/request-context";

export const leads = pgTable(
  "leads",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    leadId: uuid("lead_id").defaultRandom().notNull(),
    idempotencyKey: uuid("idempotency_key").notNull(),
    status: text("status").default("new").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    projectContext: text("project_context"),
    requestContext: jsonb("request_context").$type<LeadRequestContext>(),
    sourcePath: text("source_path").default("/").notNull(),
    attribution: jsonb("attribution"),
    consentPolicyVersion: text("consent_policy_version"),
    uploadTokenHash: text("upload_token_hash"),
    uploadExpiresAt: timestamp("upload_expires_at", {
      withTimezone: true,
      mode: "date"
    }),
    retentionUntil: timestamp("retention_until", {
      withTimezone: true,
      mode: "date"
    }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull()
  },
  (table) => [
    uniqueIndex("leads_lead_id_unique").on(table.leadId),
    uniqueIndex("leads_idempotency_key_unique").on(table.idempotencyKey),
    index("leads_status_created_at_idx").on(table.status, table.createdAt)
  ]
);

export const leadFiles = pgTable(
  "lead_files",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    fileId: uuid("file_id").defaultRandom().notNull(),
    leadId: bigint("lead_id", { mode: "number" })
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    storageKey: text("storage_key").notNull(),
    originalName: text("original_name").notNull(),
    mediaType: text("media_type").notNull(),
    byteSize: bigint("byte_size", { mode: "number" }).notNull(),
    checksumSha256: text("checksum_sha256"),
    status: text("status").default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" })
  },
  (table) => [
    uniqueIndex("lead_files_file_id_unique").on(table.fileId),
    uniqueIndex("lead_files_storage_key_unique").on(table.storageKey),
    index("lead_files_lead_id_idx").on(table.leadId),
    index("lead_files_status_created_at_idx").on(table.status, table.createdAt)
  ]
);
