import type { Perfume } from "./types";

const AMAZON_TAG = process.env.AROMIA_AMAZON_ASSOCIATE_TAG || "aromialab-20";
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36 AromiaCatalog/1.0";
const FETCH_TIMEOUT_MS = 9000;

export type AmazonCatalogProduct = {
  productUrl: string;
  imageUrl: string | null;
  source: "amazon-product" | "amazon-search" | "amazon-existing-image" | "amazon-link";
};

function isAmazonHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/^www\./, "");
  return host === "amazon.com" || host.endsWith(".amazon.com") || /^amazon\.[a-z.]+$/.test(host);
}

function isAmazonImageHost(hostname: string) {
  const host = hostname.toLowerCase();
  return host.endsWith("media-amazon.com") || host.endsWith("ssl-images-amazon.com");
}

export function cleanAmazonUrl(value: string | null | undefined): string | null {
  const text = String(value ?? "").trim();
  if (!text || /^(pending|por verificar|no verificado)$/i.test(text)) return null;
  try {
    const url = new URL(text);
    if (!/^https?:$/.test(url.protocol) || !isAmazonHost(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function affiliateAmazonUrl(value: string | null | undefined): string | null {
  const cleaned = cleanAmazonUrl(value);
  if (!cleaned) return null;
  const url = new URL(cleaned);
  if (AMAZON_TAG) url.searchParams.set("tag", AMAZON_TAG);
  return url.toString();
}

function cleanAmazonImage(value: string | null | undefined): string | null {
  const text = String(value ?? "").trim().replace(/\\u0026/g, "&").replace(/\\\//g, "/");
  if (!text) return null;
  try {
    const url = new URL(text);
    if (!/^https?:$/.test(url.protocol) || !isAmazonImageHost(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function fetchAmazonHtml(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
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
    if (/robot check|enter the characters you see below|validateCaptcha/i.test(html)) return null;
    return html;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function htmlDecode(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function firstAmazonImage(values: Array<string | undefined>) {
  for (const value of values) {
    const image = cleanAmazonImage(value ? htmlDecode(value) : null);
    if (image) return image;
  }
  return null;
}

function extractProductImage(html: string): string | null {
  const candidates: Array<string | undefined> = [];
  const oldHires = html.match(/id=["']landingImage["'][^>]+data-old-hires=["']([^"']+)["']/i)
    ?? html.match(/data-old-hires=["']([^"']+)["'][^>]+id=["']landingImage["']/i);
  if (oldHires) candidates.push(oldHires[1]);

  const dynamic = html.match(/id=["']landingImage["'][^>]+data-a-dynamic-image=["']([^"']+)["']/i)
    ?? html.match(/data-a-dynamic-image=["']([^"']+)["'][^>]+id=["']landingImage["']/i);
  if (dynamic) {
    const decoded = htmlDecode(dynamic[1]);
    const urls = Array.from(decoded.matchAll(/"(https?:\/\/[^" ]+(?:media-amazon|ssl-images-amazon)[^" ]*)"/gi));
    candidates.push(...urls.map((match) => match[1]));
  }

  const hiRes = html.match(/"hiRes"\s*:\s*"([^"]+)"/i);
  const large = html.match(/"large"\s*:\s*"([^"]+)"/i);
  const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  candidates.push(hiRes?.[1], large?.[1], og?.[1]);
  return firstAmazonImage(candidates);
}

function directAsin(url: string) {
  return url.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:[/?]|$)/i)?.[1]?.toUpperCase() ?? null;
}

function productUrlForAsin(asin: string) {
  const url = new URL(`https://www.amazon.com/dp/${asin}`);
  if (AMAZON_TAG) url.searchParams.set("tag", AMAZON_TAG);
  return url.toString();
}

function extractSearchResult(html: string): { asin: string; imageUrl: string | null } | null {
  const asinMatches = Array.from(html.matchAll(/data-asin=["']([A-Z0-9]{10})["']/gi));
  for (const match of asinMatches) {
    const asin = match[1].toUpperCase();
    if (!asin) continue;
    const start = match.index ?? 0;
    const block = html.slice(start, start + 24000);
    if (/s-sponsored-label-text|Sponsored/i.test(block.slice(0, 2500))) continue;
    const imageMatch = block.match(/<img[^>]+class=["'][^"']*s-image[^"']*["'][^>]+src=["']([^"']+)["']/i)
      ?? block.match(/<img[^>]+src=["']([^"']+)["'][^>]+class=["'][^"']*s-image[^"']*["']/i);
    const imageUrl = firstAmazonImage([imageMatch?.[1]]);
    if (imageUrl) return { asin, imageUrl };
  }
  return null;
}

async function resolveFromAmazonUrl(url: string): Promise<AmazonCatalogProduct | null> {
  const affiliateUrl = affiliateAmazonUrl(url);
  if (!affiliateUrl) return null;
  const asin = directAsin(affiliateUrl);
  const html = await fetchAmazonHtml(affiliateUrl);
  if (asin) {
    return {
      productUrl: productUrlForAsin(asin),
      imageUrl: html ? extractProductImage(html) : null,
      source: "amazon-product",
    };
  }
  if (html) {
    const result = extractSearchResult(html);
    if (result) {
      return {
        productUrl: productUrlForAsin(result.asin),
        imageUrl: result.imageUrl,
        source: "amazon-search",
      };
    }
  }
  return { productUrl: affiliateUrl, imageUrl: null, source: "amazon-link" };
}

export async function resolveAmazonCatalogProduct(perfume: Perfume): Promise<AmazonCatalogProduct | null> {
  const links = [perfume.link_afiliado, perfume.amazon_url]
    .map((value) => cleanAmazonUrl(value))
    .filter((value): value is string => Boolean(value))
    .filter((value, index, all) => all.indexOf(value) === index);

  const existingImage = (() => {
    try {
      const raw = String(perfume.imagen_url ?? "").trim();
      if (!raw) return null;
      const parsed = new URL(raw);
      return isAmazonImageHost(parsed.hostname) ? cleanAmazonImage(raw) : null;
    } catch {
      return null;
    }
  })();

  for (const link of links) {
    const result = await resolveFromAmazonUrl(link);
    if (result?.imageUrl) return result;
    if (result && existingImage) return { ...result, imageUrl: existingImage, source: "amazon-existing-image" };
  }

  if (links[0]) {
    const productUrl = affiliateAmazonUrl(links[0]);
    if (productUrl) return { productUrl, imageUrl: existingImage, source: existingImage ? "amazon-existing-image" : "amazon-link" };
  }
  return null;
}
