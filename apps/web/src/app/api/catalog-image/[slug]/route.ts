import { getPerfumeBySlug } from "@/lib/api";
import { resolveAmazonCatalogProduct } from "@/lib/amazonCatalog.server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const USER_AGENT = "Mozilla/5.0 (compatible; AromiaCatalogImage/2.0; +https://www.aromialab.com)";
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 9000;

async function fetchImage(url: string): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "user-agent": USER_AGENT,
        accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "accept-language": "en-US,en;q=0.9",
        referer: "https://www.amazon.com/",
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

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const perfume = await getPerfumeBySlug(params.slug);
  if (!perfume) return new Response("Not found", { status: 404 });

  const amazon = await resolveAmazonCatalogProduct(perfume);
  if (!amazon?.imageUrl) {
    return new Response("Amazon product image unavailable", {
      status: 404,
      headers: {
        "cache-control": "public, max-age=300",
        "x-aromia-image-policy": "amazon-only",
      },
    });
  }

  const image = await fetchImage(amazon.imageUrl);
  if (!image) {
    return new Response("Amazon product image unavailable", {
      status: 404,
      headers: {
        "cache-control": "public, max-age=300",
        "x-aromia-image-policy": "amazon-only",
      },
    });
  }

  return new Response(image.bytes, {
    headers: {
      "content-type": image.contentType,
      "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "x-aromia-image-origin": amazon.source,
      "x-aromia-image-policy": "amazon-only",
    },
  });
}
