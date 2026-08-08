import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import {
  authorizeLeadFileUpload,
  recordCompletedLeadFileUpload
} from "@/features/lead-form/upload-service";
import {
  leadUploadRequestType,
  logLeadUploadFailure
} from "@/features/lead-form/upload-diagnostics";
import { blobCallbackPayloadSchema } from "@/features/lead-form/upload-contract";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: HandleUploadBody | null = null;

  try {
    body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: authorizeLeadFileUpload,
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = blobCallbackPayloadSchema.parse(
          JSON.parse(tokenPayload ?? "null")
        );

        await recordCompletedLeadFileUpload(
          blob.pathname,
          blob.contentType,
          payload
        );
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    logLeadUploadFailure({
      error,
      requestType: leadUploadRequestType(body)
    });

    return NextResponse.json(
      { error: "Die Datei konnte nicht sicher hochgeladen werden." },
      { status: 400 }
    );
  }
}
