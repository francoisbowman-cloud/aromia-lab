import { NextRequest } from "next/server";
import { proxyToAdminApi } from "@/lib/adminApiProxy";

export async function POST(req: NextRequest, { params: promisedparams }: { params: Promise<{ id: string }> }) {
  const params = await promisedparams;
  const body = await req.text();
  return proxyToAdminApi(`/perfumes/${params.id}/retailers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

export async function DELETE(req: NextRequest, { params: promisedparams }: { params: Promise<{ id: string }> }) {
  const params = await promisedparams;
  const retailerId = req.nextUrl.searchParams.get("retailerId");
  return proxyToAdminApi(`/perfumes/${params.id}/retailers/${retailerId}`, {
    method: "DELETE",
  });
}
