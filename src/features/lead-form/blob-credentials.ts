import "server-only";

import { LeadUploadDiagnosticError } from "./upload-diagnostics";

const READ_WRITE_TOKEN_PATTERN = /^vercel_blob_rw_[^_]+_.+$/;

export function getBlobReadWriteToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  if (!token) {
    throw new LeadUploadDiagnosticError("LeadUploadBlobTokenMissing");
  }

  if (!READ_WRITE_TOKEN_PATTERN.test(token)) {
    throw new LeadUploadDiagnosticError("LeadUploadBlobTokenInvalid");
  }

  return token;
}
