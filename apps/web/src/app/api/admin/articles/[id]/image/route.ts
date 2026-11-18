import { NextRequest } from "next/server";
import { proxyAdminImage } from "@/lib/adminImageProxy";

export async function POST(req: NextRequest, { params: promisedparams }: { params: Promise<{ id: string }> }) {
  const params = await promisedparams;
  return proxyAdminImage(req, `/articles/${params.id}/image`);
}
