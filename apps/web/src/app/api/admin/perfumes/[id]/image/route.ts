import { NextRequest } from "next/server";
import { proxyToAdminApi } from "@/lib/adminApiProxy";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const formData = await req.formData();
  const body = new FormData();
  const file = formData.get("image");
  if (file) body.append("image", file);

  return proxyToAdminApi(`/perfumes/${params.id}/image`, {
    method: "POST",
    body,
  });
}
