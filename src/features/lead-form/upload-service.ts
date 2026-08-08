import "server-only";

import { and, count, eq, gt, gte } from "drizzle-orm";

import { getDb } from "@/db";
import { leadFiles, leads } from "@/db/schema";

import {
  attachmentsAreEnabled,
  buildLeadBlobPath,
  deletePrivateBlob,
  inspectPrivateBlob,
  retentionUntilFrom,
  uploadExpiryFrom
} from "./blob-storage";
import {
  blobUploadPayloadSchema,
  uploadManifestSchema,
  type UploadFileDescriptor
} from "./upload-contract";
import {
  createUploadToken,
  hashUploadToken,
  uploadTokenMatches
} from "./upload-security";
import { LeadUploadDiagnosticError } from "./upload-diagnostics";
import { sendLeadNotification } from "./notification-service";

const LEAD_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const LEAD_RATE_LIMIT_MAX = 3;

export interface LeadContactDraft {
  email: string;
  phone?: string;
  projectContext?: string;
  sourcePath?: string;
}

export interface PlannedLeadFile extends UploadFileDescriptor {
  fileId: string;
  pathname: string;
}

export interface LeadUploadPlan {
  leadId: string;
  uploadToken: string;
  files: PlannedLeadFile[];
}

export async function createLeadUploadPlan(
  contact: LeadContactDraft,
  manifestInput: unknown
): Promise<LeadUploadPlan> {
  if (!attachmentsAreEnabled()) {
    throw new LeadUploadDiagnosticError("LeadUploadIntakeDisabled");
  }

  const manifest = uploadManifestSchema.parse(manifestInput);
  const db = getDb();
  const now = new Date();
  const [recent] = await db
    .select({ total: count() })
    .from(leads)
    .where(
      and(
        eq(leads.email, contact.email),
        gte(
          leads.createdAt,
          new Date(now.getTime() - LEAD_RATE_LIMIT_WINDOW_MS)
        )
      )
    );

  if ((recent?.total ?? 0) >= LEAD_RATE_LIMIT_MAX) {
    throw new Error("Lead submission rate limit exceeded.");
  }

  const leadId = crypto.randomUUID();
  const uploadToken = createUploadToken();
  const uploadTokenHash = hashUploadToken(uploadToken);
  const files = manifest.map((file) => {
    const fileId = crypto.randomUUID();

    return {
      ...file,
      fileId,
      pathname: buildLeadBlobPath(leadId, fileId)
    };
  });

  const [lead] = await db
    .insert(leads)
    .values({
      leadId,
      idempotencyKey: crypto.randomUUID(),
      status: "uploading",
      email: contact.email,
      phone: contact.phone,
      projectContext: contact.projectContext,
      sourcePath: contact.sourcePath ?? "/",
      uploadTokenHash,
      uploadExpiresAt: uploadExpiryFrom(now),
      retentionUntil: retentionUntilFrom(now)
    })
    .returning({ id: leads.id });

  if (!lead) {
    throw new Error("Could not create the lead upload plan.");
  }

  try {
    if (files.length > 0) {
      await db.insert(leadFiles).values(
        files.map((file) => ({
          fileId: file.fileId,
          leadId: lead.id,
          storageKey: file.pathname,
          originalName: file.name,
          mediaType: file.type,
          byteSize: file.size,
          status: "pending"
        }))
      );
    }
  } catch (error) {
    await db.delete(leads).where(eq(leads.id, lead.id));
    throw error;
  }

  return { leadId, uploadToken, files };
}

export async function authorizeLeadFileUpload(
  pathname: string,
  payloadInput: string | null
) {
  if (!attachmentsAreEnabled() || !payloadInput) {
    throw new LeadUploadDiagnosticError("LeadUploadIntakeDisabled");
  }

  const payload = blobUploadPayloadSchema.parse(JSON.parse(payloadInput));
  const db = getDb();
  const [record] = await db
    .select({
      storageKey: leadFiles.storageKey,
      mediaType: leadFiles.mediaType,
      byteSize: leadFiles.byteSize,
      uploadTokenHash: leads.uploadTokenHash
    })
    .from(leadFiles)
    .innerJoin(leads, eq(leadFiles.leadId, leads.id))
    .where(
      and(
        eq(leads.leadId, payload.leadId),
        eq(leadFiles.fileId, payload.fileId),
        eq(leadFiles.status, "pending"),
        eq(leads.status, "uploading"),
        gt(leads.uploadExpiresAt, new Date())
      )
    )
    .limit(1);

  if (
    !record?.uploadTokenHash ||
    record.storageKey !== pathname ||
    !uploadTokenMatches(payload.uploadToken, record.uploadTokenHash)
  ) {
    throw new LeadUploadDiagnosticError("LeadUploadPlanNotAuthorized");
  }

  return {
    allowedContentTypes: [record.mediaType],
    maximumSizeInBytes: record.byteSize,
    validUntil: Date.now() + 10 * 60 * 1000,
    addRandomSuffix: false,
    allowOverwrite: false,
    cacheControlMaxAge: 60,
    tokenPayload: JSON.stringify({
      leadId: payload.leadId,
      fileId: payload.fileId
    })
  };
}

export async function recordCompletedLeadFileUpload(
  pathname: string,
  contentType: string,
  callbackPayload: { leadId: string; fileId: string }
) {
  const db = getDb();
  const [record] = await db
    .select({
      id: leadFiles.id,
      storageKey: leadFiles.storageKey,
      mediaType: leadFiles.mediaType,
      byteSize: leadFiles.byteSize,
      status: leadFiles.status
    })
    .from(leadFiles)
    .innerJoin(leads, eq(leadFiles.leadId, leads.id))
    .where(
      and(
        eq(leads.leadId, callbackPayload.leadId),
        eq(leadFiles.fileId, callbackPayload.fileId)
      )
    )
    .limit(1);

  if (
    !record ||
    record.storageKey !== pathname ||
    record.mediaType !== contentType
  ) {
    await deletePrivateBlob(pathname);
    throw new LeadUploadDiagnosticError("LeadUploadCompletionMismatch");
  }

  if (record.status === "uploaded") {
    return;
  }

  if (record.status !== "pending") {
    throw new LeadUploadDiagnosticError("LeadUploadCompletionNotPending");
  }

  const blob = await inspectPrivateBlob(pathname);

  if (blob.size !== record.byteSize || blob.contentType !== record.mediaType) {
    await deletePrivateBlob(pathname);
    await db
      .update(leadFiles)
      .set({ status: "rejected", deletedAt: new Date() })
      .where(eq(leadFiles.id, record.id));
    throw new LeadUploadDiagnosticError("LeadUploadMetadataMismatch");
  }

  await db
    .update(leadFiles)
    .set({ status: "uploaded" })
    .where(eq(leadFiles.id, record.id));
}

export async function confirmLeadFileUpload(input: {
  leadId: string;
  fileId: string;
  uploadToken: string;
  pathname: string;
  contentType: string;
}) {
  await authorizeLeadFileUpload(
    input.pathname,
    JSON.stringify({
      leadId: input.leadId,
      fileId: input.fileId,
      uploadToken: input.uploadToken
    })
  );
  await recordCompletedLeadFileUpload(input.pathname, input.contentType, {
    leadId: input.leadId,
    fileId: input.fileId
  });
}

export async function finalizeLeadUploadPlan(
  leadId: string,
  uploadToken: string
) {
  const db = getDb();
  const [lead] = await db
    .select({
      id: leads.id,
      uploadTokenHash: leads.uploadTokenHash,
      uploadExpiresAt: leads.uploadExpiresAt
    })
    .from(leads)
    .where(and(eq(leads.leadId, leadId), eq(leads.status, "uploading")))
    .limit(1);

  if (
    !lead?.uploadTokenHash ||
    !lead.uploadExpiresAt ||
    lead.uploadExpiresAt <= new Date() ||
    !uploadTokenMatches(uploadToken, lead.uploadTokenHash)
  ) {
    throw new LeadUploadDiagnosticError("LeadUploadPlanNotAuthorized");
  }

  const files = await db
    .select({ status: leadFiles.status })
    .from(leadFiles)
    .where(eq(leadFiles.leadId, lead.id));

  if (files.some((file) => file.status !== "uploaded")) {
    throw new LeadUploadDiagnosticError("LeadUploadFilesIncomplete");
  }

  await sendLeadNotification(leadId);

  await db
    .update(leads)
    .set({
      status: "new",
      uploadTokenHash: null,
      uploadExpiresAt: null,
      updatedAt: new Date()
    })
    .where(and(eq(leads.id, lead.id), eq(leads.status, "uploading")));
}
