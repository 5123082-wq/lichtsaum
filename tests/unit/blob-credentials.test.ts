import { afterEach, describe, expect, it } from "vitest";

import { getBlobReadWriteToken } from "../../src/features/lead-form/blob-credentials";

const originalToken = process.env.BLOB_READ_WRITE_TOKEN;

describe("Blob credentials", () => {
  afterEach(() => {
    if (originalToken === undefined) {
      delete process.env.BLOB_READ_WRITE_TOKEN;
    } else {
      process.env.BLOB_READ_WRITE_TOKEN = originalToken;
    }
  });

  it("trims a valid read-write token before passing it to the SDK", () => {
    process.env.BLOB_READ_WRITE_TOKEN = "  vercel_blob_rw_store_secret  \n";

    expect(getBlobReadWriteToken()).toBe("vercel_blob_rw_store_secret");
  });

  it.each([undefined, "", "not-a-blob-token"])(
    "rejects a missing or malformed token without exposing it",
    (token) => {
      if (token === undefined) {
        delete process.env.BLOB_READ_WRITE_TOKEN;
      } else {
        process.env.BLOB_READ_WRITE_TOKEN = token;
      }

      expect(() => getBlobReadWriteToken()).toThrow("Lead file upload failed.");
    }
  );
});
