import "server-only";

import { del, head } from "@vercel/blob";

import { acceptsProductionLeadAttachments } from "@/config/environment";

import { PROJECT_FILE_RETENTION_DAYS } from "./file-rules";

const LEAD_BLOB_PATH = /^leads\/([0-9a-f-]{36})\/([0-9a-f-]{36})$/i;

export function attachmentsAreEnabled() {
  return acceptsProductionLeadAttachments;
}

export function buildLeadBlobPath(leadId: string, fileId: string) {
  return `leads/${leadId}/${fileId}`;
}

export function parseLeadBlobPath(pathname: string) {
  const match = LEAD_BLOB_PATH.exec(pathname);

  return match ? { leadId: match[1], fileId: match[2] } : null;
}

export function uploadExpiryFrom(now: Date) {
  return new Date(now.getTime() + 30 * 60 * 1000);
}

export function retentionUntilFrom(now: Date) {
  return new Date(
    now.getTime() + PROJECT_FILE_RETENTION_DAYS * 24 * 60 * 60 * 1000
  );
}

export async function inspectPrivateBlob(pathname: string) {
  return head(pathname);
}

export async function deletePrivateBlob(pathname: string) {
  await del(pathname);
}

export async function deletePrivateBlobs(pathnames: string[]) {
  if (pathnames.length > 0) {
    await del(pathnames);
  }
}
