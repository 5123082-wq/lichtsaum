import { describe, expect, it } from "vitest";

import {
  blobUploadPayloadSchema,
  uploadManifestSchema
} from "../../src/features/lead-form/upload-contract";
import {
  createUploadToken,
  hashUploadToken,
  uploadTokenMatches
} from "../../src/features/lead-form/upload-security";

describe("lead upload contract", () => {
  it("accepts the approved five-file manifest", () => {
    const result = uploadManifestSchema.safeParse(
      Array.from({ length: 5 }, (_, index) => ({
        name: `markise-${index}.webp`,
        type: "image/webp",
        size: 10 * 1024 * 1024
      }))
    );

    expect(result.success).toBe(true);
  });

  it("rejects a manifest above the combined 50 MB limit", () => {
    const result = uploadManifestSchema.safeParse(
      Array.from({ length: 4 }, (_, index) => ({
        name: `markise-${index}.png`,
        type: "image/png",
        size: 13 * 1024 * 1024
      }))
    );

    expect(result.success).toBe(false);
  });

  it("requires UUID identifiers and a sufficiently strong upload token", () => {
    expect(
      blobUploadPayloadSchema.safeParse({
        leadId: "not-a-uuid",
        fileId: crypto.randomUUID(),
        uploadToken: "short"
      }).success
    ).toBe(false);
  });

  it("compares upload tokens against their stored hash", () => {
    const token = createUploadToken();
    const hash = hashUploadToken(token);

    expect(uploadTokenMatches(token, hash)).toBe(true);
    expect(uploadTokenMatches(createUploadToken(), hash)).toBe(false);
  });
});
