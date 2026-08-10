import type { Article, Perfume } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const RETRY_DELAYS_MS = [250, 700, 1400];

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

export async function getPerfumes(): Promise<Perfume[]> {
  const res = await fetchWithRetry(`${API_BASE_URL}/api/perfumes`, { cache: "no-store" });
  if (!res?.ok) return [];
  try { return await res.json(); } catch { return []; }
}

export async function subscribe(email: string, fuente: "home" | "quiz" | "club"): Promise<boolean> {
  const res = await fetchWithRetry(`${API_BASE_URL}/api/subscribers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, fuente }),
  });
  return Boolean(res?.ok);
}

export async function getArticulos(): Promise<Article[]> {
  const res = await fetchWithRetry(`${API_BASE_URL}/api/articulos`, { next: { revalidate: 60 } });
  if (!res?.ok) return [];
  try { return await res.json(); } catch { return []; }
}

export async function getArticuloBySlug(slug: string): Promise<Article | null> {
  const res = await fetchWithRetry(`${API_BASE_URL}/api/articulos/${slug}`, { next: { revalidate: 60 } });
  if (!res || res.status === 404 || !res.ok) return null;
  try { return await res.json(); } catch { return null; }
}

export async function getPerfumeBySlug(slug: string): Promise<Perfume | null> {
  const res = await fetchWithRetry(`${API_BASE_URL}/api/perfumes/${slug}`, { cache: "no-store" });
  if (!res || res.status === 404 || !res.ok) return null;
  try { return await res.json(); } catch { return null; }
}
