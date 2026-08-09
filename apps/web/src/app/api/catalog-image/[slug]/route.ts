import { getPerfumeBySlug } from "@/lib/api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const USER_AGENT = "Mozilla/5.0 (compatible; AromiaCatalogImage/1.0; +https://www.aromialab.com)";
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 9000;

function cleanUrl(value: string | null | undefined): string | null {
  const text = String(value ?? "").trim();
  if (!text || /^(pending|por verificar|no verificado)$/i.test(text)) return null;
  try {
    const url = new URL(text);
    if (!/^https?:$/.test(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function splitUrls(value: string | null | undefined): string[] {
  return String(value ?? "")
    .split(";")
    .map((part) => cleanUrl(part))
    .filter((url): url is string => Boolean(url));
}

async function fetchWithTimeout(url: string, accept: string): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "user-agent": USER_AGENT,
        accept,
        "accept-language": "en-US,en;q=0.9,es;q=0.7",
      },
    });
    return response.ok ? response : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchImage(url: string): Promise<{ bytes: ArrayBuffer; contentType: string; finalUrl: string } | null> {
  const response = await fetchWithTimeout(url, "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8");
  if (!response) return null;
  const contentType = response.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
  if (!contentType.startsWith("image/")) return null;
  const declared = Number(response.headers.get("content-length") ?? "0");
  if (declared > MAX_IMAGE_BYTES) return null;
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_IMAGE_BYTES) return null;
  return { bytes, contentType, finalUrl: response.url || url };
}

function htmlDecode(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function imageCandidatesFromHtml(html: string, pageUrl: string): string[] {
  const candidates: string[] = [];
  const metaPatterns = [
    /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["'][^>]*>/gi,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["'][^>]*>/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["'][^>]*>/gi,
  ];
  for (const pattern of metaPatterns) {
    for (const match of Array.from(html.matchAll(pattern))) candidates.push(match[1]);
  }
  for (const match of Array.from(html.matchAll(/"image"\s*:\s*(?:\[\s*)?"(https?:\\?\/\\?\/[^"\\]+(?:\\.[^"\\]*)*)"/gi))) {
    candidates.push(match[1].replace(/\\\//g, "/"));
  }

  const out: string[] = [];
  for (const raw of candidates) {
    try {
      const resolved = new URL(htmlDecode(raw.trim()), pageUrl).toString();
      if (/^https?:/i.test(resolved) && !out.includes(resolved)) out.push(resolved);
    } catch {
      // Ignore malformed metadata URLs.
    }
  }
  return out.slice(0, 8);
}

async function discoverImageFromPage(pageUrl: string) {
  const response = await fetchWithTimeout(pageUrl, "text/html,application/xhtml+xml");
  if (!response) return null;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.startsWith("image/")) return fetchImage(response.url || pageUrl);
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) return null;
  const html = await response.text();
  for (const imageUrl of imageCandidatesFromHtml(html, response.url || pageUrl)) {
    const image = await fetchImage(imageUrl);
    if (image) return image;
  }
  return null;
}

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const perfume = await getPerfumeBySlug(params.slug);
  if (!perfume) return new Response("Not found", { status: 404 });

  const primary = cleanUrl(perfume.imagen_url);
  if (primary) {
    const image = await fetchImage(primary);
    if (image) {
      return new Response(image.bytes, {
        headers: {
          "content-type": image.contentType,
          "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800",
          "x-aromia-image-origin": "catalog-primary",
        },
      });
    }
  }

  const pageCandidates = [
    ...splitUrls(perfume.image_source),
    ...splitUrls(perfume.source_url),
  ].filter((value, index, all) => all.indexOf(value) === index);

  for (const pageUrl of pageCandidates) {
    const direct = await fetchImage(pageUrl);
    if (direct) {
      return new Response(direct.bytes, {
        headers: {
          "content-type": direct.contentType,
          "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800",
          "x-aromia-image-origin": "catalog-source-direct",
        },
      });
    }
    const discovered = await discoverImageFromPage(pageUrl);
    if (discovered) {
      return new Response(discovered.bytes, {
        headers: {
          "content-type": discovered.contentType,
          "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800",
          "x-aromia-image-origin": "catalog-source-discovery",
        },
      });
    }
  }

  return new Response("Product image unavailable", {
    status: 404,
    headers: { "cache-control": "public, max-age=300" },
  });
}
