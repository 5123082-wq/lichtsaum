import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createLeadUploadPlan: vi.fn(),
  prepareConfiguratorProjectContext: vi.fn()
}));

vi.mock("@/config/environment", () => ({ acceptsProductionLeads: true }));
vi.mock("@/features/lead-form/server-request-context", () => ({
  prepareConfiguratorProjectContext: mocks.prepareConfiguratorProjectContext
}));
vi.mock("@/features/lead-form/upload-service", () => ({
  confirmLeadFileUpload: vi.fn(),
  createLeadUploadPlan: mocks.createLeadUploadPlan,
  finalizeLeadUploadPlan: vi.fn()
}));

import { prepareProjectCheckSubmission } from "@/features/lead-form/submission-action";

const plainSubmission = {
  email: "projekt@example.test",
  phone: "",
  projectContext: "",
  website: "",
  sourcePath: "/konfigurator",
  idempotencyKey: "00000000-0000-4000-8000-000000000321",
  uploadToken: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  files: []
};

describe("configurator lead action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createLeadUploadPlan.mockResolvedValue({
      kind: "upload",
      plan: {
        leadId: "00000000-0000-4000-8000-000000000123",
        uploadToken: "test-upload-token",
        files: []
      }
    });
  });

  it("passes the server-produced request context to the shared lead persistence", async () => {
    const requestContext = {
      schemaVersion: 1,
      origin: "full_configurator",
      evaluation: "valid"
    };
    mocks.prepareConfiguratorProjectContext.mockResolvedValue({
      kind: "ready",
      requestContext
    });

    await prepareProjectCheckSubmission({
      ...plainSubmission,
      configuratorProject: {} as never
    });

    expect(mocks.createLeadUploadPlan).toHaveBeenCalledWith(
      expect.objectContaining({
        sourcePath: "/konfigurator",
        requestContext
      }),
      {
        idempotencyKey: plainSubmission.idempotencyKey,
        uploadToken: plainSubmission.uploadToken
      },
      []
    );
  });

  it("returns an updated price without creating a lead on mismatch", async () => {
    const mismatch = {
      kind: "pricing_changed",
      pricingVersion: "2026-08-20.v4",
      calculation: { netTotalCents: 67_000 }
    };
    mocks.prepareConfiguratorProjectContext.mockResolvedValue(mismatch);

    await expect(
      prepareProjectCheckSubmission({
        ...plainSubmission,
        configuratorProject: {} as never
      })
    ).resolves.toBe(mismatch);
    expect(mocks.createLeadUploadPlan).not.toHaveBeenCalled();
  });
});
