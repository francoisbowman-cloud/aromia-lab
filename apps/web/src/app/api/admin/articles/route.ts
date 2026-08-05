import { NextRequest } from "next/server";
import { proxyToAdminApi } from "@/lib/adminApiProxy";

export async function GET(req: NextRequest) {
  return proxyToAdminApi(`/articles${req.nextUrl.search}`);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  return proxyToAdminApi("/articles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
