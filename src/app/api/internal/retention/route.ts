import { NextResponse } from "next/server";

import { deleteExpiredLeads } from "@/features/lead-form/retention-service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization");

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json(await deleteExpiredLeads());
  } catch {
    return NextResponse.json(
      { error: "Retention cleanup failed." },
      { status: 500 }
    );
  }
}
