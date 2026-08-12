import { getPerfumeBySlug } from "@/lib/api";
import { resolveAmazonCatalogProduct } from "@/lib/amazonCatalog.server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const USER_AGENT = "Mozilla/5.0 (compatible; AromiaCatalogImage/3.1; +https://www.aromialab.com)";
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 9000;

function officialProductPage(slug: string, concentration?: string | null) {
  if (slug === "black-afgano") return "https://nasomatto.com/es/products/black-afgano";
  if (slug === "chance-eau-tendre") {
    return String(concentration ?? "").toLowerCase().includes("toilette") || String(concentration ?? "").toLowerCase() === "edt"
      ? "https://www.chanel.com/us/fragrance/p/126320/chance-eau-tendre-eau-de-toilette-spray/"
      : "https://www.chanel.com/us/fragrance/p/126260/chance-eau-tendre-eau-de-parfum-spray/";
  }
  return null;
}

function safeCatalogImageUrl(value: string | null | undefined): string | null {
  try {
    const url = new URL(String(value ?? "").trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || host === "0.0.0.0" || host === "::1" || host.endsWith(".local")) return null;
    if (/^(10|127)\./.test(host) || /^169\.254\./.test(host) || /^192\.168\./.test(host)) return null;
    const private172 = host.match(/^172\.(\d+)\./);
    if (private172 && Number(private172[1]) >= 16 && Number(private172[1]) <= 31) return null;
    const socialCard = url.pathname.match(/^\/mdimg\/perfume-social-cards\/en-social-([0-9]+)\.jpeg$/i);
    if (url.hostname.toLowerCase() === "fimgs.net" && socialCard) { url.pathname = `/mdimg/perfume/375x500.${socialCard[1]}.jpg`; url.search = ""; }
    return url.toString();
  } catch { return null; }
}

async function fetchImage(url: string): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const origin = new URL(url).origin;
    const response = await fetch(url, { redirect: "follow", cache: "no-store", signal: controller.signal, headers: { "user-agent": USER_AGENT, accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8", "accept-language": "en-US,en;q=0.9", referer: `${origin}/` } });
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
    if (!contentType.startsWith("image/")) return null;
    const declared = Number(response.headers.get("content-length") ?? "0"); if (declared > MAX_IMAGE_BYTES) return null;
    const bytes = await response.arrayBuffer(); if (bytes.byteLength === 0 || bytes.byteLength > MAX_IMAGE_BYTES) return null;
    return { bytes, contentType };
  } catch { return null; } finally { clearTimeout(timer); }
}

async function resolveOfficialPackshot(pageUrl: string): Promise<string | null> {
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(pageUrl, { redirect: "follow", cache: "no-store", signal: controller.signal, headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml", "accept-language": "en-US,en;q=0.9" } });
    if (!response.ok) return null;
    const html = await response.text();
    const candidates = [
      html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i)?.[1],
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i)?.[1],
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)?.[1],
    ];
    for (const raw of candidates) {
      if (!raw) continue;
      const decoded = raw.replace(/&amp;/g, "&");
      const absolute = safeCatalogImageUrl(new URL(decoded, pageUrl).toString());
      if (absolute) return absolute;
    }
    return null;
  } catch { return null; } finally { clearTimeout(timer); }
}

function imageResponse(image: { bytes: ArrayBuffer; contentType: string }, origin: string) {
  return new Response(image.bytes, { headers: { "content-type": image.contentType, "cache-control": "public, s-maxage=604800, stale-while-revalidate=2592000", "x-aromia-image-origin": origin, "x-aromia-image-policy": "omni-ccl-product-only" } });
}

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const perfume = await getPerfumeBySlug(params.slug);
  if (!perfume) return new Response("Not found", { status: 404 });

  // OMNI visual quarantine: known aesthetic outliers use the manufacturer product
  // page first. We resolve its current social/product packshot at request time rather
  // than checking an unverified binary into the repository.
  const officialPage = officialProductPage(perfume.slug, perfume.concentracion);
  if (officialPage) {
    const officialImageUrl = await resolveOfficialPackshot(officialPage);
    if (officialImageUrl) {
      const officialImage = await fetchImage(officialImageUrl);
      if (officialImage) return imageResponse(officialImage, "official-brand");
    }
  }

  const catalogUrl = safeCatalogImageUrl(perfume.imagen_url);
  if (catalogUrl) {
    const catalogImage = await fetchImage(catalogUrl);
    if (catalogImage) return imageResponse(catalogImage, "catalog");
  }

  const amazon = await resolveAmazonCatalogProduct(perfume);
  if (!amazon?.imageUrl) return new Response("Product image unavailable", { status: 404, headers: { "cache-control": "public, max-age=300", "x-aromia-image-policy": "omni-ccl-product-only" } });
  const image = await fetchImage(amazon.imageUrl);
  if (!image) return new Response("Product image unavailable", { status: 404, headers: { "cache-control": "public, max-age=300", "x-aromia-image-policy": "omni-ccl-product-only" } });
  return imageResponse(image, amazon.source);
}
