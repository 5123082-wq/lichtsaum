import { beforeEach, describe, expect, it, vi } from "vitest";

const blobStorage = vi.hoisted(() => ({
  attachmentsAreEnabled: vi.fn(),
  buildLeadBlobPath: vi.fn(),
  deletePrivateBlob: vi.fn(),
  inspectPrivateBlob: vi.fn(),
  retentionUntilFrom: vi.fn(),
  uploadExpiryFrom: vi.fn()
}));
const uploadSecurity = vi.hoisted(() => ({
  createUploadToken: vi.fn(),
  hashUploadToken: vi.fn(),
  uploadTokenMatches: vi.fn()
}));
const database = vi.hoisted(() => {
  const limit = vi.fn();
  const where = vi.fn(() => ({ limit }));
  const innerJoin = vi.fn(() => ({ where }));
  const from = vi.fn(() => ({ innerJoin, where }));
  const select = vi.fn(() => ({ from }));

  return { from, innerJoin, limit, select, where };
});

vi.mock("@/db", () => ({
  getDb: () => ({ select: database.select })
}));
vi.mock("@/features/lead-form/blob-storage", () => blobStorage);
vi.mock("@/features/lead-form/upload-security", () => uploadSecurity);
vi.mock("@/features/lead-form/notification-service", () => ({
  sendLeadCustomerConfirmation: vi.fn(),
  sendLeadNotification: vi.fn()
}));

import {
  confirmLeadFileUpload,
  recordCompletedLeadFileUpload
} from "@/features/lead-form/upload-service";

const authorizedLead = {
  uploadTokenHash: "expected-hash",
  uploadExpiresAt: new Date("2099-01-01T00:00:00.000Z")
};

describe("lead upload confirmation security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    blobStorage.attachmentsAreEnabled.mockReturnValue(true);
    uploadSecurity.uploadTokenMatches.mockReturnValue(true);
  });

  it("rejects public confirmation while attachment intake is disabled", async () => {
    blobStorage.attachmentsAreEnabled.mockReturnValue(false);

    await expect(
      confirmLeadFileUpload({
        leadId: "00000000-0000-4000-8000-000000000001",
        fileId: "00000000-0000-4000-8000-000000000002",
        uploadToken: "valid-plan-token",
        contentType: "image/png"
      })
    ).rejects.toMatchObject({ name: "LeadUploadIntakeDisabled" });
    expect(database.select).not.toHaveBeenCalled();
    expect(blobStorage.deletePrivateBlob).not.toHaveBeenCalled();
  });

  it("does not accept or delete a caller-supplied pathname for an unknown file", async () => {
    database.limit
      .mockResolvedValueOnce([authorizedLead])
      .mockResolvedValueOnce([]);
    const forgedInput = {
      leadId: "00000000-0000-4000-8000-000000000001",
      fileId: "00000000-0000-4000-8000-000000000002",
      uploadToken: "valid-plan-token",
      contentType: "image/png",
      pathname: "leads/ffffffff-ffff-4fff-8fff-ffffffffffff/eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee"
    };

    await expect(confirmLeadFileUpload(forgedInput)).rejects.toMatchObject({
      name: "LeadUploadCompletionMismatch"
    });
    expect(blobStorage.inspectPrivateBlob).not.toHaveBeenCalled();
    expect(blobStorage.deletePrivateBlob).not.toHaveBeenCalled();
  });

  it("never deletes an unrecognized callback pathname", async () => {
    database.limit.mockResolvedValueOnce([]);

    await expect(
      recordCompletedLeadFileUpload(
        "leads/ffffffff-ffff-4fff-8fff-ffffffffffff/eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        "image/png",
        {
          leadId: "00000000-0000-4000-8000-000000000001",
          fileId: "00000000-0000-4000-8000-000000000002"
        }
      )
    ).rejects.toMatchObject({ name: "LeadUploadCompletionMismatch" });
    expect(blobStorage.inspectPrivateBlob).not.toHaveBeenCalled();
    expect(blobStorage.deletePrivateBlob).not.toHaveBeenCalled();
  });
});
