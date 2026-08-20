import { getPerfumeBySlug } from "@/lib/api";
import { resolveAmazonCatalogProduct } from "@/lib/amazonCatalog.server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const USER_AGENT = "Mozilla/5.0 (compatible; AromiaCatalogImage/3.1; +https://www.aromialab.com)";
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 9000;
const PREFER_COMMERCE_PACKSHOT = new Set(["chance-eau-tendre", "flowerbomb"]);

function officialProductPages(slug: string, concentration?: string | null): string[] {
  if (slug === "black-afgano") return ["https://nasomatto.com/es/products/black-afgano"];
  if (slug === "acqua-di-gio-edt") return ["https://www.giorgioarmanibeauty-usa.com/fragrances/mens-cologne/acqua-di-gio/acqua-di-gio-eau-de-toilette/A005.html?geo=false"];
  if (slug === "chance-eau-tendre") {
    const edt = String(concentration ?? "").toLowerCase().includes("toilette") || String(concentration ?? "").toLowerCase() === "edt";
    return edt
      ? [
          "https://www.chanel.com/es/perfumes/p/126320/chance-eau-tendre-eau-de-toilette-vaporizador/",
          "https://www.chanel.com/us/fragrance/p/126320/chance-eau-tendre-eau-de-toilette-spray/",
        ]
      : [
          "https://www.chanel.com/es/perfumes/p/126260/chance-eau-tendre-eau-de-parfum-vaporizador/",
          "https://www.chanel.com/us/fragrance/p/126260/chance-eau-tendre-eau-de-parfum-spray/",
        ];
  }
  return [];
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
    if (url.hostname.toLowerCase() === "fimgs.net" && socialCard) {
      url.pathname = `/mdimg/perfume/375x500.${socialCard[1]}.jpg`;
      url.search = "";
    }
    return url.toString();
  } catch {
    return null;
  }
}

async function fetchImage(url: string): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const origin = new URL(url).origin;
    const response = await fetch(url, {
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "user-agent": USER_AGENT,
        accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        referer: `${origin}/`,
      },
    });
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
    if (!contentType.startsWith("image/")) return null;
    const declared = Number(response.headers.get("content-length") ?? "0");
    if (declared > MAX_IMAGE_BYTES) return null;
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength === 0 || bytes.byteLength > MAX_IMAGE_BYTES) return null;
    return { bytes, contentType };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function resolveOfficialPackshot(pageUrl: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(pageUrl, {
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml",
        "accept-language": "en-US,en;q=0.9",
      },
    });
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
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function imageResponse(image: { bytes: ArrayBuffer; contentType: string }, origin: string) {
  return new Response(image.bytes, {
    headers: {
      "content-type": image.contentType,
      "cache-control": "public, s-maxage=604800, stale-while-revalidate=2592000",
      "x-aromia-image-origin": origin,
      "x-aromia-image-policy": "omni-ccl-product-only",
    },
  });
}

function escapeSvgText(value: string | null | undefined) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function compactLabel(value: string | null | undefined, max = 34) {
  const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
  return normalized.length <= max ? normalized : `${normalized.slice(0, Math.max(0, max - 1)).trim()}…`;
}

function placeholderResponse(perfume: { nombre: string; marca: string; familia_olfativa?: string | null }) {
  const name = escapeSvgText(compactLabel(perfume.nombre, 28));
  const brand = escapeSvgText(compactLabel(perfume.marca, 24));
  const family = escapeSvgText(compactLabel(perfume.familia_olfativa ?? "Objeto olfativo", 28));
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 640" role="img" aria-label="Imagen de producto temporalmente no disponible para ${name} de ${brand}">
      <rect width="480" height="640" fill="#f3efe8"/>
      <rect x="32" y="32" width="416" height="576" fill="none" stroke="#d9ccb7" stroke-width="1"/>
      <line x1="32" y1="116" x2="448" y2="116" stroke="#d9ccb7" stroke-width="1"/>
      <line x1="330" y1="32" x2="330" y2="116" stroke="#d9ccb7" stroke-width="1"/>
      <circle cx="367" cy="425" r="92" fill="none" stroke="#c8a86b" stroke-opacity=".28" stroke-width="1"/>
      <circle cx="367" cy="425" r="58" fill="none" stroke="#c8a86b" stroke-opacity=".18" stroke-width="1"/>
      <line x1="96" y1="466" x2="392" y2="466" stroke="#c8a86b" stroke-opacity=".38" stroke-width="1"/>
      <text x="56" y="76" fill="#8d744d" font-family="Arial, Helvetica, sans-serif" font-size="12" letter-spacing="3">AROMIA / IMAGE PENDING</text>
      <text x="352" y="77" fill="#8d744d" font-family="Arial, Helvetica, sans-serif" font-size="12" letter-spacing="2">INDEX</text>
      <text x="56" y="176" fill="#8d744d" font-family="Arial, Helvetica, sans-serif" font-size="13" letter-spacing="2">${family.toUpperCase()}</text>
      <text x="56" y="256" fill="#221d18" font-family="Georgia, 'Times New Roman', serif" font-size="40">${name}</text>
      <text x="56" y="292" fill="#6f665d" font-family="Arial, Helvetica, sans-serif" font-size="16" letter-spacing="1">${brand}</text>
      <text x="56" y="548" fill="#8d8174" font-family="Arial, Helvetica, sans-serif" font-size="11" letter-spacing="2">PRODUCT IMAGE NOT VERIFIED</text>
      <text x="56" y="572" fill="#8d8174" font-family="Arial, Helvetica, sans-serif" font-size="11">Datos del catálogo preservados · sin imagen fabricada</text>
    </svg>`;
  return new Response(svg, {
    status: 200,
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=300",
      "x-aromia-image-origin": "placeholder",
      "x-aromia-image-policy": "omni-ccl-product-only",
    },
  });
}

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const perfume = await getPerfumeBySlug(params.slug);
  if (!perfume) return new Response("Not found", { status: 404 });

  for (const officialPage of officialProductPages(perfume.slug, perfume.concentracion)) {
    const officialImageUrl = await resolveOfficialPackshot(officialPage);
    if (!officialImageUrl) continue;
    const officialImage = await fetchImage(officialImageUrl);
    if (officialImage) return imageResponse(officialImage, "official-brand");
  }

  let amazonAttempted = false;
  if (PREFER_COMMERCE_PACKSHOT.has(perfume.slug)) {
    amazonAttempted = true;
    const preferredAmazon = await resolveAmazonCatalogProduct(perfume);
    if (preferredAmazon?.imageUrl) {
      const preferredImage = await fetchImage(preferredAmazon.imageUrl);
      if (preferredImage) return imageResponse(preferredImage, preferredAmazon.source);
    }
  }

  const catalogUrl = safeCatalogImageUrl(perfume.imagen_url);
  if (catalogUrl) {
    const catalogImage = await fetchImage(catalogUrl);
    if (catalogImage) return imageResponse(catalogImage, "catalog");
  }

  if (!amazonAttempted) {
    const amazon = await resolveAmazonCatalogProduct(perfume);
    if (amazon?.imageUrl) {
      const image = await fetchImage(amazon.imageUrl);
      if (image) return imageResponse(image, amazon.source);
    }
  }

  return placeholderResponse(perfume);
}
