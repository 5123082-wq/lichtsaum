import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildLeadFileDownloadUrl,
  createLeadFileDownloadToken,
  verifyLeadFileDownloadToken
} from "../../src/features/lead-form/download-security";

describe("lead file download security", () => {
  beforeEach(() => {
    process.env.LEAD_DOWNLOAD_SECRET = "a".repeat(64);
    process.env.SITE_URL = "https://lichtsaum.com";
    vi.useRealTimers();
  });

  it("creates a valid, expiring signature for the exact lead and file", () => {
    const leadId = crypto.randomUUID();
    const fileId = crypto.randomUUID();
    const token = createLeadFileDownloadToken(leadId, fileId);

    expect(
      verifyLeadFileDownloadToken(
        leadId,
        fileId,
        token.expires,
        token.signature
      )
    ).toBe(true);
    expect(
      verifyLeadFileDownloadToken(
        leadId,
        crypto.randomUUID(),
        token.expires,
        token.signature
      )
    ).toBe(false);
  });

  it("rejects an expired signature", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-06T12:00:00Z"));
    const leadId = crypto.randomUUID();
    const fileId = crypto.randomUUID();
    const token = createLeadFileDownloadToken(leadId, fileId);

    vi.setSystemTime(new Date("2026-08-14T12:00:00Z"));

    expect(
      verifyLeadFileDownloadToken(
        leadId,
        fileId,
        token.expires,
        token.signature
      )
    ).toBe(false);
  });

  it("builds an absolute URL without contact data", () => {
    const leadId = crypto.randomUUID();
    const fileId = crypto.randomUUID();
    const url = new URL(buildLeadFileDownloadUrl(leadId, fileId));

    expect(url.origin).toBe("https://lichtsaum.com");
    expect(url.pathname).toBe(`/api/leads/${leadId}/files/${fileId}`);
    expect(url.searchParams.get("expires")).toMatch(/^\d+$/);
    expect(url.searchParams.get("signature")).toBeTruthy();
  });
});
