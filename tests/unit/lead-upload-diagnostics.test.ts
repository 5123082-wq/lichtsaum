import { afterEach, describe, expect, it, vi } from "vitest";

import {
  LeadUploadDiagnosticError,
  leadUploadRequestType,
  logLeadUploadFailure
} from "../../src/features/lead-form/upload-diagnostics";

describe("lead upload diagnostics", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("classifies only the two Vercel Blob callback request types", () => {
    expect(
      leadUploadRequestType({ type: "blob.generate-client-token" })
    ).toBe("blob.generate-client-token");
    expect(leadUploadRequestType({ type: "blob.upload-completed" })).toBe(
      "blob.upload-completed"
    );
    expect(leadUploadRequestType({ type: "unexpected", email: "secret" })).toBe(
      "invalid"
    );
    expect(leadUploadRequestType(null)).toBe("invalid");
  });

  it("logs a bounded diagnostic without the error message or submitted data", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const error = new Error(
      "customer@example.com filename.jpg vercel_blob_rw_sensitive"
    );

    logLeadUploadFailure({
      error,
      requestType: "blob.generate-client-token"
    });

    expect(consoleError).toHaveBeenCalledWith("lead_file_upload_failed", {
      errorKind: "Error",
      requestType: "blob.generate-client-token"
    });
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
      "customer@example.com"
    );
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
      "filename.jpg"
    );
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
      "vercel_blob_rw_sensitive"
    );
  });

  it("labels malformed JSON without logging parser details", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    logLeadUploadFailure({
      error: new SyntaxError("payload contents"),
      requestType: "invalid"
    });

    expect(consoleError).toHaveBeenCalledWith("lead_file_upload_failed", {
      errorKind: "invalid_json",
      requestType: "invalid"
    });
  });

  it("preserves a bounded internal stage code", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    logLeadUploadFailure({
      error: new LeadUploadDiagnosticError("LeadUploadPlanNotAuthorized"),
      requestType: "blob.generate-client-token"
    });

    expect(consoleError).toHaveBeenCalledWith("lead_file_upload_failed", {
      errorKind: "LeadUploadPlanNotAuthorized",
      requestType: "blob.generate-client-token"
    });
  });
});
