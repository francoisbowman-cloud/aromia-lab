import { NextRequest } from 'next/server';
import { proxyToAdminApi } from '@/lib/adminApiProxy';
export async function GET() { return proxyToAdminApi('/intelligence'); }
export async function POST(req: NextRequest) {
  return proxyToAdminApi('/intelligence',{method:'POST',headers:{'Content-Type':'application/json'},body:await req.text()});
}
