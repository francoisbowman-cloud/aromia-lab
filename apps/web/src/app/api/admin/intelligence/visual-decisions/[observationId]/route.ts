import { NextRequest, NextResponse } from "next/server";
import { proxyToAdminApi } from "@/lib/adminApiProxy";

// Read-only display. Publishing/editorial secrets must never transit the browser.
export async function GET(_request: NextRequest, { params: paramsPromise }: { params: Promise<{ observationId: string }> }) {
  const params = await paramsPromise;
  if (!/^[1-9][0-9]{0,14}$/.test(params.observationId) ||
      !Number.isSafeInteger(Number(params.observationId))) {
    return NextResponse.json({ error: "Invalid observation ID" }, { status: 400 });
  }
  return proxyToAdminApi(`/intelligence/visual-decisions/${params.observationId}`);
}
