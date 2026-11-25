import { NextRequest, NextResponse } from "next/server";
import { proxyToAdminApi } from "@/lib/adminApiProxy";

// Read-only proxy: a valid admin session is required by proxyToAdminApi.
// Never accept or forward publisher credentials from client JavaScript.
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") ?? "";
  if (!/^[a-z0-9][a-z0-9._-]{0,159}$/.test(slug)) {
    return NextResponse.json({ error: "Invalid product slug" }, { status: 400 });
  }
  return proxyToAdminApi(`/intelligence/visual-reviews?slug=${encodeURIComponent(slug)}`);
}
// POST deliberately absent; it requires a separate publisher authorization process.
