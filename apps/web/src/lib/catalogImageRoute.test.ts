import { afterEach, expect, it, vi } from "vitest";
vi.mock("@/lib/api", () => ({ getPerfumeBySlug: vi.fn() }));
vi.mock("@/lib/amazonCatalog.server", () => ({ resolveAmazonCatalogProduct: vi.fn() }));
import { getPerfumeBySlug } from "./api";
import { resolveAmazonCatalogProduct } from "./amazonCatalog.server";
import { GET } from "@/app/api/catalog-image/[slug]/route";
import type { Perfume } from "./types";
afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });
it("does not fetch an invented official variant when concentration and sources are missing", async () => {
  vi.mocked(getPerfumeBySlug).mockResolvedValue({slug:"chance-eau-tendre",nombre:"Chance Eau Tendre",marca:"Chanel",concentracion:null,imagen_url:null} as Perfume);
  vi.mocked(resolveAmazonCatalogProduct).mockResolvedValue(null);
  const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
  const response = await GET(new Request("http://localhost/api/catalog-image/chance-eau-tendre"), {params: Promise.resolve({slug:"chance-eau-tendre"})});
  expect(fetch).not.toHaveBeenCalled();
  expect(response.headers.get("x-aromia-image-origin")).toBe("placeholder");
  expect(await response.text()).toContain("Imagen no disponible");
});
