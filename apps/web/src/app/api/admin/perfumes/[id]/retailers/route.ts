import { NextRequest } from "next/server";
import { proxyToAdminApi } from "@/lib/adminApiProxy";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.text();
  return proxyToAdminApi(`/perfumes/${params.id}/retailers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
