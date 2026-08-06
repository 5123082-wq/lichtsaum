import { get } from "@vercel/blob";
import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { z } from "zod";

import { getDb } from "@/db";
import { leadFiles, leads } from "@/db/schema";
import { verifyLeadFileDownloadToken } from "@/features/lead-form/download-security";

const routeParamsSchema = z.object({
  leadId: z.string().uuid(),
  fileId: z.string().uuid()
});

function safeDownloadName(name: string) {
  return name.replace(/[\r\n"\\]/g, "_");
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ leadId: string; fileId: string }> }
) {
  const params = routeParamsSchema.safeParse(await context.params);
  const expires = Number(request.nextUrl.searchParams.get("expires"));
  const signature = request.nextUrl.searchParams.get("signature") ?? "";

  if (
    !params.success ||
    !verifyLeadFileDownloadToken(
      params.data.leadId,
      params.data.fileId,
      expires,
      signature
    )
  ) {
    return new Response("Not found", { status: 404 });
  }

  const db = getDb();
  const [file] = await db
    .select({
      storageKey: leadFiles.storageKey,
      originalName: leadFiles.originalName,
      mediaType: leadFiles.mediaType
    })
    .from(leadFiles)
    .innerJoin(leads, eq(leadFiles.leadId, leads.id))
    .where(
      and(
        eq(leads.leadId, params.data.leadId),
        eq(leadFiles.fileId, params.data.fileId),
        eq(leadFiles.status, "uploaded")
      )
    )
    .limit(1);

  if (!file) {
    return new Response("Not found", { status: 404 });
  }

  const blob = await get(file.storageKey, { access: "private" });

  if (!blob || blob.statusCode !== 200) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(blob.stream, {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Disposition": `attachment; filename="${safeDownloadName(file.originalName)}"; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
      "Content-Type": file.mediaType,
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow"
    }
  });
}
