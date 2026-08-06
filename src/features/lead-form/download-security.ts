import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const DOWNLOAD_TTL_SECONDS = 7 * 24 * 60 * 60;

function downloadSecret() {
  const secret = process.env.LEAD_DOWNLOAD_SECRET?.trim();

  if (!secret || secret.length < 32) {
    throw new Error("LEAD_DOWNLOAD_SECRET must contain at least 32 characters.");
  }

  return secret;
}

function payload(leadId: string, fileId: string, expires: number) {
  return `${leadId}.${fileId}.${expires}`;
}

function signatureFor(leadId: string, fileId: string, expires: number) {
  return createHmac("sha256", downloadSecret())
    .update(payload(leadId, fileId, expires))
    .digest("base64url");
}

export function createLeadFileDownloadToken(leadId: string, fileId: string) {
  const expires = Math.floor(Date.now() / 1000) + DOWNLOAD_TTL_SECONDS;

  return {
    expires,
    signature: signatureFor(leadId, fileId, expires)
  };
}

export function verifyLeadFileDownloadToken(
  leadId: string,
  fileId: string,
  expires: number,
  signature: string
) {
  if (!Number.isSafeInteger(expires) || expires < Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expected = Buffer.from(signatureFor(leadId, fileId, expires));
  const received = Buffer.from(signature);

  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

export function buildLeadFileDownloadUrl(leadId: string, fileId: string) {
  const siteUrl = process.env.SITE_URL?.trim().replace(/\/$/, "");

  if (!siteUrl || !/^https?:\/\//.test(siteUrl)) {
    throw new Error("SITE_URL must be an absolute HTTP(S) URL.");
  }

  const token = createLeadFileDownloadToken(leadId, fileId);
  const url = new URL(`/api/leads/${leadId}/files/${fileId}`, siteUrl);
  url.searchParams.set("expires", String(token.expires));
  url.searchParams.set("signature", token.signature);

  return url.toString();
}
