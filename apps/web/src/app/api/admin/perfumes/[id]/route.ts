import { NextRequest } from "next/server";
import { proxyToAdminApi } from "@/lib/adminApiProxy";

export async function GET(_req: NextRequest, { params: promisedparams }: { params: Promise<{ id: string }> }) {
  const params = await promisedparams;
  return proxyToAdminApi(`/perfumes/${params.id}`);
}

export async function PATCH(req: NextRequest, { params: promisedparams }: { params: Promise<{ id: string }> }) {
  const params = await promisedparams;
  const body = await req.text();
  return proxyToAdminApi(`/perfumes/${params.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

export async function DELETE(_req: NextRequest, { params: promisedparams }: { params: Promise<{ id: string }> }) {
  const params = await promisedparams;
  return proxyToAdminApi(`/perfumes/${params.id}`, { method: "DELETE" });
}
