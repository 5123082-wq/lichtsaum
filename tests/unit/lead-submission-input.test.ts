import { beforeEach, describe, expect, it, vi } from "vitest";

const leadUpload = vi.hoisted(() => ({
  createLeadUploadPlan: vi.fn()
}));

vi.mock("@/config/environment", () => ({ acceptsProductionLeads: true }));
vi.mock("@/features/lead-form/upload-service", () => ({
  confirmLeadFileUpload: vi.fn(),
  createLeadUploadPlan: leadUpload.createLeadUploadPlan,
  finalizeLeadUploadPlan: vi.fn()
}));

import { prepareProjectCheckSubmission } from "../../src/features/lead-form/submission-action";

const validSubmission = {
  email: "project@example.test",
  phone: "",
  projectContext: "",
  website: "",
  sourcePath: "/",
  idempotencyKey: "00000000-0000-4000-8000-000000000321",
  uploadToken: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  files: []
};

describe("prepareProjectCheckSubmission input boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    leadUpload.createLeadUploadPlan.mockResolvedValue({
      kind: "upload",
      plan: {
        leadId: "00000000-0000-4000-8000-000000000123",
        uploadToken: "test-upload-token",
        files: []
      }
    });
  });

  it("passes a safe site-relative source path to persistence", async () => {
    await prepareProjectCheckSubmission({
      ...validSubmission,
      sourcePath: "/kontakt"
    });

    expect(leadUpload.createLeadUploadPlan).toHaveBeenCalledWith(
      expect.objectContaining({
        sourcePath: "/kontakt",
        requestContext: undefined
      }),
      {
        idempotencyKey: validSubmission.idempotencyKey,
        uploadToken: validSubmission.uploadToken
      },
      []
    );
  });

  it("does not persist query strings or contact data from a forged source path", async () => {
    await prepareProjectCheckSubmission({
      ...validSubmission,
      sourcePath: "/?email=project@example.test"
    });

    expect(leadUpload.createLeadUploadPlan).toHaveBeenCalledWith(
      expect.objectContaining({ sourcePath: "/" }),
      {
        idempotencyKey: validSubmission.idempotencyKey,
        uploadToken: validSubmission.uploadToken
      },
      []
    );
  });

  it("maps an already accepted idempotent retry to the original success", async () => {
    leadUpload.createLeadUploadPlan.mockResolvedValueOnce({
      kind: "submitted",
      leadId: "00000000-0000-4000-8000-000000000123",
      publicLeadNumber: "LS-2026-000042"
    });

    await expect(
      prepareProjectCheckSubmission(validSubmission)
    ).resolves.toEqual({
      kind: "result",
      state: {
        status: "submitted",
        message:
          "Ihre Projektanfrage wurde sicher gespeichert. Wir melden uns über den von Ihnen angegebenen Kontaktweg.",
        fieldErrors: {},
        leadId: "00000000-0000-4000-8000-000000000123",
        publicLeadNumber: "LS-2026-000042"
      }
    });
  });
});
