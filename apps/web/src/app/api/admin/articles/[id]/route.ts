import { NextRequest } from "next/server";
import { proxyToAdminApi } from "@/lib/adminApiProxy";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return proxyToAdminApi(`/articles/${params.id}`);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.text();
  return proxyToAdminApi(`/articles/${params.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  return proxyToAdminApi(`/articles/${params.id}`, { method: "DELETE" });
}
