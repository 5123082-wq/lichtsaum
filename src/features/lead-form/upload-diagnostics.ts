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

function safeErrorDetail(error: unknown) {
  if (!(error instanceof Error)) {
    return undefined;
  }

  const redacted = error.message
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[email]")
    .replace(/https?:\/\/\S+/gi, "[url]")
    .replace(
      /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi,
      "[uuid]"
    )
    .replace(/vercel_blob_[A-Za-z0-9_-]+/g, "[blob-token]")
    .replace(/\b\S+\.(?:jpe?g|png|webp|pdf)\b/gi, "[filename]")
    .replace(/[\r\n\t]+/g, " ")
    .trim();

  return redacted ? redacted.slice(0, 180) : undefined;
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
  const errorDetail = safeErrorDetail(input.error);

  console.error(LEAD_UPLOAD_ERROR_EVENT, {
    ...(errorDetail ? { errorDetail } : {}),
    errorKind: errorKind(input.error),
    requestType: input.requestType
  });
}
