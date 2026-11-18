import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveAmazonCatalogProduct } from "./amazonCatalog.server";
import type { Perfume } from "./types";
const perfume = (url: string) => ({ amazon_url: url, link_afiliado: null, imagen_url: null }) as Perfume;
afterEach(() => vi.unstubAllGlobals());
describe("Amazon product identity", () => {
  it("does not infer a product or packshot from search ranking", async () => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    const result = await resolveAmazonCatalogProduct(perfume("https://www.amazon.com/s?k=iris+perfume"));
    expect(result?.source).toBe("amazon-link");
    expect(result?.imageUrl).toBeNull();
    expect(new URL(result!.productUrl).pathname).toBe("/s");
    expect(fetch).not.toHaveBeenCalled();
  });
  it("preserves the marketplace, exact ASIN and variant query of a supplied product", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, text: async () => '<img id="landingImage" data-old-hires="https://m.media-amazon.com/images/I/exact.jpg">' }));
    const result = await resolveAmazonCatalogProduct(perfume("https://www.amazon.es/dp/B012345678?th=1&psc=1"));
    const url = new URL(result!.productUrl);
    expect(url.hostname).toBe("www.amazon.es");
    expect(url.pathname).toBe("/dp/B012345678");
    expect(url.searchParams.get("th")).toBe("1");
    expect(url.searchParams.get("psc")).toBe("1");
    expect(result?.imageUrl).toBe("https://m.media-amazon.com/images/I/exact.jpg");
  });
  it("keeps an explicit product destination when retrieval fails, without a substitute image", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const result = await resolveAmazonCatalogProduct(perfume("https://www.amazon.com/dp/B012345678"));
    expect(result?.imageUrl).toBeNull();
    expect(new URL(result!.productUrl).pathname).toBe("/dp/B012345678");
  });
});
