import { NextRequest } from "next/server";
import { proxyAdminImage } from "@/lib/adminImageProxy";

export async function POST(req: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  return proxyAdminImage(req, `/perfumes/${params.id}/image`);
}
