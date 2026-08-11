import { beforeEach, describe, expect, it, vi } from "vitest";

const leadServices = vi.hoisted(() => ({
  createLeadUploadPlan: vi.fn(),
  finalizeLeadUploadPlan: vi.fn()
}));

vi.mock("@/config/environment", () => ({
  acceptsProductionLeads: false,
  isProductionDeployment: true
}));
vi.mock("@/features/lead-form/server-request-context", () => ({
  prepareConfiguratorProjectContext: vi.fn(async () => ({ kind: "absent" }))
}));
vi.mock("@/features/lead-form/upload-service", () => ({
  confirmLeadFileUpload: vi.fn(),
  createLeadUploadPlan: leadServices.createLeadUploadPlan,
  finalizeLeadUploadPlan: leadServices.finalizeLeadUploadPlan
}));

import {
  finalizeProjectCheckSubmission,
  prepareProjectCheckSubmission
} from "@/features/lead-form/submission-action";

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

describe("production lead intake release gate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not create a lead while intake is disabled", async () => {
    await expect(
      prepareProjectCheckSubmission(validSubmission)
    ).resolves.toMatchObject({
      kind: "result",
      state: {
        status: "prototype_unavailable",
        message: expect.not.stringContaining("Prototyp")
      }
    });
    expect(leadServices.createLeadUploadPlan).not.toHaveBeenCalled();
  });

  it("does not finalize a previously prepared lead while intake is disabled", async () => {
    await expect(
      finalizeProjectCheckSubmission(
        "00000000-0000-4000-8000-000000000123",
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      )
    ).resolves.toMatchObject({
      status: "prototype_unavailable",
      message: expect.not.stringContaining("Prototyp")
    });
    expect(leadServices.finalizeLeadUploadPlan).not.toHaveBeenCalled();
  });
});
