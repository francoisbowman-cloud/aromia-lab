import { NextRequest } from "next/server";
import { proxyToAdminApi } from "@/lib/adminApiProxy";

export async function GET(_req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  return proxyToAdminApi(`/perfumes/${params.id}`);
}

export async function PATCH(req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  const body = await req.text();
  return proxyToAdminApi(`/perfumes/${params.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

export async function DELETE(_req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  return proxyToAdminApi(`/perfumes/${params.id}`, { method: "DELETE" });
}
