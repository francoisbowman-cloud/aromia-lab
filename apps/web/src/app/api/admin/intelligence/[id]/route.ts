import { NextRequest, NextResponse } from 'next/server';
import { proxyToAdminApi } from '@/lib/adminApiProxy';
export async function GET(_req: NextRequest,{params: promisedparams}:{params:Promise<{id:string}>}) {
  const params = await promisedparams;
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) return NextResponse.json({error:'Invalid ID'},{status:400});
  return proxyToAdminApi(`/intelligence/${params.id}`);
}
