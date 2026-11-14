import { NextRequest } from "next/server";
import { proxyAdminImage } from "@/lib/adminImageProxy";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return proxyAdminImage(req, `/perfumes/${params.id}/image`);
}
