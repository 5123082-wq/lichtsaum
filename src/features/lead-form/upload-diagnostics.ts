const LEAD_UPLOAD_ERROR_EVENT = "lead_file_upload_failed";

export type LeadUploadRequestType =
  | "blob.generate-client-token"
  | "blob.upload-completed"
  | "invalid";

export class LeadUploadDiagnosticError extends Error {
  constructor(kind: string) {
    super("Lead file upload failed.");
    this.name = kind;
  }
}

function errorKind(error: unknown) {
  if (error instanceof SyntaxError) {
    return "invalid_json";
  }

  if (error instanceof Error) {
    return error.name || "Error";
  }

  return "unknown";
}

export function leadUploadRequestType(body: unknown): LeadUploadRequestType {
  if (!body || typeof body !== "object" || !("type" in body)) {
    return "invalid";
  }

  const type = body.type;

  return type === "blob.generate-client-token" ||
    type === "blob.upload-completed"
    ? type
    : "invalid";
}

export function logLeadUploadFailure(input: {
  error: unknown;
  requestType: LeadUploadRequestType;
}) {
  console.error(LEAD_UPLOAD_ERROR_EVENT, {
    errorKind: errorKind(input.error),
    requestType: input.requestType
  });
}
