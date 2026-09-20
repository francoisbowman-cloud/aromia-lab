import type { Article, DiscoveryPerfume, Perfume, PerfumeFacetsResponse, PerfumeSearchResponse } from "./types";

const LOCAL_API = "http://localhost:4000";
const PRIVATE_API = "http://api.railway.internal:4000";
const PUBLIC_API = "https://api-production-fe2f.up.railway.app";
const RETRY_DELAYS_MS = [200, 500, 900];

function apiBases() {
  if (process.env.NODE_ENV === "production") {
    return [PRIVATE_API, PUBLIC_API];
  }
  return [(process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? LOCAL_API).replace(/\/$/, "")];
}

async function fetchWithRetry(url: string, init?: RequestInit & { next?: { revalidate?: number } }): Promise<Response | null> {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      const response = await fetch(url, init);
      if (response.ok || response.status === 404 || response.status < 500) return response;
    } catch {
      // Retry transient network failures during API deploy/restart windows.
    }
    if (attempt < RETRY_DELAYS_MS.length) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
    }
  }
  return null;
}

async function fetchApi(path: string, init?: RequestInit & { next?: { revalidate?: number } }): Promise<Response | null> {
  for (const base of apiBases()) {
    const response = await fetchWithRetry(`${base}${path}`, init);
    if (response?.ok || response?.status === 404 || (response && response.status < 500)) return response;
  }
  return null;
}

export async function getPerfumes(): Promise<Perfume[]> {
  const res = await fetchApi("/api/perfumes", { cache: "no-store" });
  if (!res?.ok) return [];
  try {
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Búsqueda acotada server-backed (reemplaza cargar Perfume[] completo en
// /buscar — ver handoffs/AROMIA_CODE_DISCOVERY_SEARCH_ARCHITECTURE_2026-09-20.md).
// `revalidate` corto en vez de no-store: mismas queries repetidas en una
// ventana de 30s reusan cache, sin perder frescura real.
export async function searchPerfumes(params: { q?: string; familia?: string; page?: number; pageSize?: number }): Promise<PerfumeSearchResponse> {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.familia) qs.set("familia", params.familia);
  if (params.page) qs.set("page", String(params.page));
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));

  const res = await fetchApi(`/api/perfumes/search?${qs.toString()}`, { next: { revalidate: 30 } });
  const empty: PerfumeSearchResponse = { items: [], total: 0, page: 1, pageSize: params.pageSize ?? 20 };
  if (!res?.ok) return empty;
  try {
    const data = await res.json();
    return {
      items: Array.isArray(data?.items) ? data.items : [],
      total: typeof data?.total === "number" ? data.total : 0,
      page: typeof data?.page === "number" ? data.page : 1,
      pageSize: typeof data?.pageSize === "number" ? data.pageSize : empty.pageSize,
    };
  } catch {
    return empty;
  }
}

export async function getPerfumeFacets(): Promise<PerfumeFacetsResponse> {
  const res = await fetchApi("/api/perfumes/facets", { next: { revalidate: 300 } });
  if (!res?.ok) return { families: [] };
  try {
    const data = await res.json();
    return { families: Array.isArray(data?.families) ? data.families : [] };
  } catch {
    return { families: [] };
  }
}

// Muestra acotada y diversa para rankear recomendaciones en /descubrir sin
// transportar el catálogo completo — ver discovery-seed en apps/api.
export async function getDiscoverySeedPerfumes(limit = 48): Promise<DiscoveryPerfume[]> {
  const res = await fetchApi(`/api/perfumes/discovery-seed?limit=${limit}`, { next: { revalidate: 300 } });
  if (!res?.ok) return [];
  try {
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function subscribe(email: string, fuente: "home" | "quiz" | "club"): Promise<boolean> {
  const res = await fetchApi("/api/subscribers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, fuente }),
  });
  return Boolean(res?.ok);
}

export async function getArticulos(): Promise<Article[]> {
  const res = await fetchApi("/api/articulos", { next: { revalidate: 60 } });
  if (!res?.ok) return [];
  try { return await res.json(); } catch { return []; }
}

export async function getArticuloBySlug(slug: string): Promise<Article | null> {
  const res = await fetchApi(`/api/articulos/${slug}`, { next: { revalidate: 60 } });
  if (!res || res.status === 404 || !res.ok) return null;
  try { return await res.json(); } catch { return null; }
}

export async function getPerfumeBySlug(slug: string): Promise<Perfume | null> {
  const res = await fetchApi(`/api/perfumes/${slug}`, { cache: "no-store" });
  if (!res || res.status === 404 || !res.ok) return null;
  try { return await res.json(); } catch { return null; }
}
