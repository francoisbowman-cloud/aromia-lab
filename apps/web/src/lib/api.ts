import type { Article, Perfume } from "./types";

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
