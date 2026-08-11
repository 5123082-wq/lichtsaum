import "server-only";

import { isDeepStrictEqual } from "node:util";

import { and, count, eq, gt, gte, sql } from "drizzle-orm";

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
  leadSubmissionAttemptSchema,
  uploadManifestSchema,
  type LeadSubmissionAttempt,
  type UploadFileDescriptor
} from "./upload-contract";
import {
  hashUploadToken,
  uploadTokenMatches
} from "./upload-security";
import { LeadUploadDiagnosticError } from "./upload-diagnostics";
import {
  sendLeadCustomerConfirmation,
  sendLeadNotification
} from "./notification-service";
import { formatPublicLeadNumber } from "./public-lead-number";
import type { LeadRequestContext } from "./request-context";

const LEAD_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const LEAD_RATE_LIMIT_MAX = 3;

export interface LeadContactDraft {
  email: string;
  phone?: string;
  projectContext?: string;
  requestContext?: LeadRequestContext;
  sourcePath?: string;
}

export interface PlannedLeadFile extends UploadFileDescriptor {
  fileId: string;
  pathname: string;
  uploaded: boolean;
}

export interface LeadUploadPlan {
  leadId: string;
  uploadToken: string;
  files: PlannedLeadFile[];
}

export type LeadUploadPreparation =
  | { kind: "upload"; plan: LeadUploadPlan }
  | {
      kind: "submitted";
      leadId: string;
      publicLeadNumber: string;
    };

type PersistedPlanFile = Readonly<{
  fileId: string;
  storageKey: string;
  originalName: string;
  mediaType: string;
  byteSize: number;
  status: string;
}>;

function optionalValue<T>(value: T | null | undefined) {
  return value ?? undefined;
}

function restorePlannedFiles(
  records: readonly PersistedPlanFile[],
  manifest: readonly UploadFileDescriptor[]
): PlannedLeadFile[] | null {
  if (records.length !== manifest.length) {
    return null;
  }

  return manifest.map((descriptor, index) => {
    const record = records[index];

    if (
      !record ||
      record.originalName !== descriptor.name ||
      record.mediaType !== descriptor.type ||
      record.byteSize !== descriptor.size ||
      (record.status !== "pending" && record.status !== "uploaded")
    ) {
      throw new LeadUploadDiagnosticError("LeadUploadPlanNotAuthorized");
    }

    return {
      ...descriptor,
      fileId: record.fileId,
      pathname: record.storageKey,
      uploaded: record.status === "uploaded"
    };
  });
}

async function recoverLeadUploadPreparation(
  contact: LeadContactDraft,
  attempt: LeadSubmissionAttempt,
  manifest: readonly UploadFileDescriptor[],
  remainingProvisioningRetries = 4
): Promise<LeadUploadPreparation | undefined> {
  const db = getDb();
  const [lead] = await db
    .select({
      id: leads.id,
      leadId: leads.leadId,
      status: leads.status,
      email: leads.email,
      phone: leads.phone,
      projectContext: leads.projectContext,
      requestContext: leads.requestContext,
      sourcePath: leads.sourcePath,
      uploadTokenHash: leads.uploadTokenHash,
      createdAt: leads.createdAt
    })
    .from(leads)
    .where(eq(leads.idempotencyKey, attempt.idempotencyKey))
    .limit(1);

  if (!lead) {
    return undefined;
  }

  const tokenIsValid =
    lead.uploadTokenHash &&
    uploadTokenMatches(attempt.uploadToken, lead.uploadTokenHash);
  const contactMatches =
    lead.email === contact.email &&
    optionalValue(lead.phone) === optionalValue(contact.phone) &&
    optionalValue(lead.projectContext) ===
      optionalValue(contact.projectContext) &&
    isDeepStrictEqual(
      optionalValue(lead.requestContext),
      optionalValue(contact.requestContext)
    ) &&
    lead.sourcePath === (contact.sourcePath ?? "/");

  if (!tokenIsValid || !contactMatches) {
    throw new LeadUploadDiagnosticError("LeadUploadPlanNotAuthorized");
  }

  const fileRecords = await db
    .select({
      fileId: leadFiles.fileId,
      storageKey: leadFiles.storageKey,
      originalName: leadFiles.originalName,
      mediaType: leadFiles.mediaType,
      byteSize: leadFiles.byteSize,
      status: leadFiles.status
    })
    .from(leadFiles)
    .where(eq(leadFiles.leadId, lead.id))
    .orderBy(leadFiles.id);
  const files = restorePlannedFiles(fileRecords, manifest);

  if (!files) {
    const planMayStillBeProvisioning =
      lead.status === "uploading" &&
      fileRecords.length < manifest.length &&
      fileRecords.every((record, index) =>
        record.originalName === manifest[index]?.name &&
        record.mediaType === manifest[index]?.type &&
        record.byteSize === manifest[index]?.size &&
        record.status === "pending"
      );

    if (planMayStillBeProvisioning && remainingProvisioningRetries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 50));

      return recoverLeadUploadPreparation(
        contact,
        attempt,
        manifest,
        remainingProvisioningRetries - 1
      );
    }

    throw new LeadUploadDiagnosticError("LeadUploadPlanNotAuthorized");
  }

  if (lead.status === "new") {
    return {
      kind: "submitted",
      leadId: lead.leadId,
      publicLeadNumber: formatPublicLeadNumber(lead.id, lead.createdAt)
    };
  }

  if (lead.status !== "uploading") {
    throw new LeadUploadDiagnosticError("LeadUploadPlanNotAuthorized");
  }

  const now = new Date();

  await db
    .update(leads)
    .set({
      uploadExpiresAt: uploadExpiryFrom(now),
      updatedAt: now
    })
    .where(and(eq(leads.id, lead.id), eq(leads.status, "uploading")));

  return {
    kind: "upload",
    plan: {
      leadId: lead.leadId,
      uploadToken: attempt.uploadToken,
      files
    }
  };
}

export async function createLeadUploadPlan(
  contact: LeadContactDraft,
  attemptInput: unknown,
  manifestInput: unknown
): Promise<LeadUploadPreparation> {
  const attempt = leadSubmissionAttemptSchema.parse(attemptInput);
  const manifest = uploadManifestSchema.parse(manifestInput);

  if (manifest.length > 0 && !attachmentsAreEnabled()) {
    throw new LeadUploadDiagnosticError("LeadUploadIntakeDisabled");
  }

  const recovered = await recoverLeadUploadPreparation(
    contact,
    attempt,
    manifest
  );

  if (recovered) {
    return recovered;
  }

  const db = getDb();
  const now = new Date();
  const [recent] = await db
    .select({ total: count() })
    .from(leads)
    .where(
      and(
        sql`lower(${leads.email}) = lower(${contact.email})`,
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
  const uploadTokenHash = hashUploadToken(attempt.uploadToken);
  const files = manifest.map((file) => {
    const fileId = crypto.randomUUID();

    return {
      ...file,
      fileId,
      pathname: buildLeadBlobPath(leadId, fileId),
      uploaded: false
    };
  });

  let lead: { id: number } | undefined;

  try {
    [lead] = await db
      .insert(leads)
      .values({
        leadId,
        idempotencyKey: attempt.idempotencyKey,
        status: "uploading",
        email: contact.email,
        phone: contact.phone,
        projectContext: contact.projectContext,
        requestContext: contact.requestContext,
        sourcePath: contact.sourcePath ?? "/",
        uploadTokenHash,
        uploadExpiresAt: uploadExpiryFrom(now),
        retentionUntil: retentionUntilFrom(now)
      })
      .returning({ id: leads.id });
  } catch (error) {
    const racedPreparation = await recoverLeadUploadPreparation(
      contact,
      attempt,
      manifest
    );

    if (racedPreparation) {
      return racedPreparation;
    }

    throw error;
  }

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

  return {
    kind: "upload",
    plan: { leadId, uploadToken: attempt.uploadToken, files }
  };
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
  contentType: string;
}) {
  if (!attachmentsAreEnabled()) {
    throw new LeadUploadDiagnosticError("LeadUploadIntakeDisabled");
  }

  await assertActiveLeadUploadPlan(input.leadId, input.uploadToken);
  const db = getDb();
  const [plannedFile] = await db
    .select({ storageKey: leadFiles.storageKey })
    .from(leadFiles)
    .innerJoin(leads, eq(leadFiles.leadId, leads.id))
    .where(
      and(
        eq(leads.leadId, input.leadId),
        eq(leadFiles.fileId, input.fileId),
        eq(leads.status, "uploading")
      )
    )
    .limit(1);

  if (!plannedFile) {
    throw new LeadUploadDiagnosticError("LeadUploadCompletionMismatch");
  }

  await recordCompletedLeadFileUpload(plannedFile.storageKey, input.contentType, {
    leadId: input.leadId,
    fileId: input.fileId
  });
}

async function assertActiveLeadUploadPlan(
  leadId: string,
  uploadToken: string
) {
  const db = getDb();
  const [lead] = await db
    .select({
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
}

export async function finalizeLeadUploadPlan(
  leadId: string,
  uploadToken: string
) {
  await assertActiveLeadUploadPlan(leadId, uploadToken);

  const db = getDb();
  const [lead] = await db
    .select({
      id: leads.id,
      createdAt: leads.createdAt
    })
    .from(leads)
    .where(and(eq(leads.leadId, leadId), eq(leads.status, "uploading")))
    .limit(1);

  if (!lead) {
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
      uploadExpiresAt: null,
      updatedAt: new Date()
    })
    .where(and(eq(leads.id, lead.id), eq(leads.status, "uploading")));

  try {
    await sendLeadCustomerConfirmation(leadId);
  } catch {
    console.error("lead_customer_confirmation_failed", { leadId });
  }

  return {
    publicLeadNumber: formatPublicLeadNumber(lead.id, lead.createdAt)
  };
}
