import "server-only";

import { asc, eq, lte } from "drizzle-orm";

import { getDb } from "@/db";
import { leadFiles, leads } from "@/db/schema";

import { deletePrivateBlobs } from "./blob-storage";

export async function deleteExpiredLeads(limit = 50) {
  const db = getDb();
  const expired = await db
    .select({ id: leads.id })
    .from(leads)
    .where(lte(leads.retentionUntil, new Date()))
    .orderBy(asc(leads.retentionUntil))
    .limit(limit);
  let deleted = 0;

  for (const lead of expired) {
    const files = await db
      .select({ storageKey: leadFiles.storageKey })
      .from(leadFiles)
      .where(eq(leadFiles.leadId, lead.id));

    await deletePrivateBlobs(files.map((file) => file.storageKey));
    await db.delete(leads).where(eq(leads.id, lead.id));
    deleted += 1;
  }

  return { inspected: expired.length, deleted };
}
