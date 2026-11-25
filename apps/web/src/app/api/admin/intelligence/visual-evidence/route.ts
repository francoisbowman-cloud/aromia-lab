import { NextRequest, NextResponse } from "next/server";
import { adminAuthorizationError } from "@/lib/adminApiProxy";
import { inspectLocalVisualAsset } from "@/lib/visualEvidence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "private, no-store, max-age=0" };

// Only permitted users with a signed admin session can inspect existing public
// image bytes. Explicit opt-in; no upload, remote fetch, approval or publication.
export async function GET(request: NextRequest) {
  const denied = await adminAuthorizationError();
  if (denied) return denied;
  if (process.env.VISUAL_EVIDENCE_INSPECTION_ENABLED !== "true") {
    return NextResponse.json({ error: "Visual inspection disabled" }, { status: 503, headers: noStore });
  }
  try {
    const result = await inspectLocalVisualAsset(process.cwd().replace(/\/apps\/web$/, ""), request.nextUrl.searchParams.get("asset"));
    return NextResponse.json(result, { headers: noStore });
  } catch (error) {
    const code = error instanceof Error ? error.message : "visual_asset_unavailable";
    const status = code === "invalid_visual_asset_path" ? 400 :
      code === "visual_asset_unavailable" ? 404 : 422;
    return NextResponse.json({ error: code }, { status, headers: noStore });
  }
}
