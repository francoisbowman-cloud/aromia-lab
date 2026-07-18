import { NextRequest } from "next/server";
import { proxyToAdminApi } from "@/lib/adminApiProxy";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const incoming = await req.formData();
  const body = new FormData();
  const file = incoming.get("image");
  const field = incoming.get("field");
  if (file) body.append("image", file);
  if (field) body.append("field", field);

  return proxyToAdminApi(`/articles/${params.id}/image`, {
    method: "POST",
    body,
  });
}
