import { NextRequest } from "next/server";
import { proxyToAdminApi } from "@/lib/adminApiProxy";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.search;
  return proxyToAdminApi(`/perfumes${search}`);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  return proxyToAdminApi("/perfumes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
