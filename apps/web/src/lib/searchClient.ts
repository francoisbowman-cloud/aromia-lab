"use client";

import type { PerfumeSearchResponse } from "./types";

// Fetch de búsqueda pensado para el browser, no para Server Components:
// `api.ts`/`fetchApi` prueba primero la URL interna de Railway
// (`api.railway.internal`), que solo resuelve dentro de la red privada —
// desde el cliente hay que ir directo a la URL pública.
const PUBLIC_API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
const REQUEST_TIMEOUT_MS = 6000;

export type SearchFetchResult =
  | { status: "ok"; data: PerfumeSearchResponse }
  | { status: "error" }
  | { status: "aborted" };

// AbortSignal.timeout no está disponible en todos los runtimes que corren
// este bundle todavía — se arma el timeout a mano, encadenado a cualquier
// signal externo que ya traiga el caller (p.ej. para cancelar el pedido
// anterior al tipear de nuevo).
export async function fetchPerfumeSearch(
  params: { q?: string; familia?: string; page?: number; pageSize?: number },
  externalSignal?: AbortSignal,
): Promise<SearchFetchResult> {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.familia) qs.set("familia", params.familia);
  if (params.page) qs.set("page", String(params.page));
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));

  const controller = new AbortController();
  const onExternalAbort = () => controller.abort();
  externalSignal?.addEventListener("abort", onExternalAbort);
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(`${PUBLIC_API_URL}/api/perfumes/search?${qs.toString()}`, {
      signal: controller.signal,
    });
    if (!res.ok) return { status: "error" };
    const data = await res.json();
    return {
      status: "ok",
      data: {
        items: Array.isArray(data?.items) ? data.items : [],
        total: typeof data?.total === "number" ? data.total : 0,
        page: typeof data?.page === "number" ? data.page : 1,
        pageSize: typeof data?.pageSize === "number" ? data.pageSize : params.pageSize ?? 20,
      },
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return { status: "aborted" };
    return { status: "error" };
  } finally {
    clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", onExternalAbort);
  }
}
