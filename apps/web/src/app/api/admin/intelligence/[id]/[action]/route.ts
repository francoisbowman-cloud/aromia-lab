import { NextRequest, NextResponse } from 'next/server';
import { proxyToAdminApi } from '@/lib/adminApiProxy';
export async function POST(_req: NextRequest,{params}:{params:{id:string;action:string}}) {
  if (!/^[0-9a-f-]{36}$/i.test(params.id) || !['cancel','retry','artifacts'].includes(params.action)) return NextResponse.json({error:'Invalid action'},{status:400});
  return proxyToAdminApi(`/intelligence/${params.id}/${params.action}`,{method:'POST',headers:{'Content-Type':'application/json'},...params.action==='artifacts'?{body:await _req.text()}:{}});
}

export async function GET(_req: NextRequest,{params}:{params:{id:string;action:string}}) {
  if (!/^[0-9a-f-]{36}$/i.test(params.id) || !['artifacts','review-package'].includes(params.action)) return NextResponse.json({error:'Invalid action'},{status:400});
  return proxyToAdminApi(`/intelligence/${params.id}/${params.action}`);
}
