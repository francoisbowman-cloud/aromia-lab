import { NextResponse } from "next/server";

const API = "https://api-production-fe2f.up.railway.app";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(`${API}/api/perfumes`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      return NextResponse.json({ ok: false, count: 0, perfumes: [] }, { status: 502 });
    }
    const data = await response.json();
    const perfumes = Array.isArray(data) ? data : [];
    return NextResponse.json({ ok: perfumes.length > 0, count: perfumes.length, perfumes }, { status: perfumes.length > 0 ? 200 : 502 });
  } catch {
    return NextResponse.json({ ok: false, count: 0, perfumes: [] }, { status: 502 });
  }
}
