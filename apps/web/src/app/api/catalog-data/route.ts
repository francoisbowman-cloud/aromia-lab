import { NextResponse } from "next/server";

const API_BASES = [
  "http://api.railway.internal:4000",
  "https://api-production-fe2f.up.railway.app",
];

export const dynamic = "force-dynamic";

async function fetchCatalog() {
  for (const base of API_BASES) {
    try {
      const response = await fetch(`${base}/api/perfumes`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) continue;
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return { base, perfumes: data };
      }
    } catch {
      // Try the next API transport.
    }
  }
  return null;
}

export async function GET() {
  const result = await fetchCatalog();
  if (!result) {
    return NextResponse.json(
      { ok: false, count: 0, source: null, perfumes: [] },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { ok: true, count: result.perfumes.length, source: result.base.includes("railway.internal") ? "private" : "public", perfumes: result.perfumes },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
