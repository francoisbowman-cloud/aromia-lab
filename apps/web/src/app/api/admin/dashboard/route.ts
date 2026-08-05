import { proxyToAdminApi } from "@/lib/adminApiProxy";

export async function GET() {
  return proxyToAdminApi("/dashboard");
}
