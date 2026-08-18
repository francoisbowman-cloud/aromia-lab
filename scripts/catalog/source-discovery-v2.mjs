import { URL } from "node:url";
import {
  discoverOfficialUrls as discoverV1,
  fetchOfficialPage,
  sameRegistrableHost,
  scoreUrlForCandidate,
} from "./source-discovery.mjs";

const DEFAULT_TIMEOUT_MS = 5000;
const MAX_SITEMAPS = 40;
const MAX_URLS = 30000;

function normalizeHost(host) {
  return String(host ?? "").toLowerCase().replace(/^www\./, "");
}

export function parseRobotsSitemapsV2(text) {
  const out = [];
  const re = /\bSitemap:\s*(https?:\/\/[^\s<]+)/gi;
  let match;
  while ((match = re.exec(String(text ?? ""))) !== null) out.push(match[1].trim());
  return [...new Set(out)];
}

export function parseSitemapXmlV2(xml) {
  const out = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let match;
  while ((match = re.exec(String(xml ?? ""))) !== null) out.push(match[1].replace(/&amp;/g, "&").trim());
  return out;
}

function sitemapPriority(url) {
  const value = String(url ?? "").toLowerCase();
  let score = 0;
  if (/product|products|fragrance|fragrances|perfume|parfum/.test(value)) score += 40;
  if (/en[-_/]|\/en\/|us[-_/]|\/us\//.test(value)) score += 8;
  if (/image|video|blog|news|article|store|career|faq/.test(value)) score -= 25;
  return score;
}

function sortQueue(queue) {
  queue.sort((a, b) => sitemapPriority(b) - sitemapPriority(a) || a.localeCompare(b));
}

async function fetchText(url, { fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "AromiaCatalogExpansion/2.0 (+catalog research; read-only)",
        "accept-language": "en-US,en;q=0.8",
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const finalUrl = response.url || url;
    return { text: await response.text(), finalUrl };
  } finally {
    clearTimeout(timer);
  }
}

async function crawlOfficialSitemaps(candidate, officialDomain, options = {}) {
  const origin = `https://${officialDomain}`;
  const seeds = new Set([
    `${origin}/sitemap.xml`,
    `${origin}/sitemap_index.xml`,
    `${origin}/sitemap-index.xml`,
  ]);

  try {
    const robots = await fetchText(`${origin}/robots.txt`, options);
    for (const sitemap of parseRobotsSitemapsV2(robots.text)) {
      if (sameRegistrableHost(sitemap, officialDomain)) seeds.add(sitemap);
    }
  } catch {}

  const queue = [...seeds];
  sortQueue(queue);
  const visited = new Set();
  const pages = new Set();

  while (queue.length && visited.size < MAX_SITEMAPS && pages.size < MAX_URLS) {
    const sitemapUrl = queue.shift();
    if (!sitemapUrl || visited.has(sitemapUrl) || !sameRegistrableHost(sitemapUrl, officialDomain)) continue;
    visited.add(sitemapUrl);
    try {
      const result = await fetchText(sitemapUrl, options);
      if (!sameRegistrableHost(result.finalUrl, officialDomain)) continue;
      for (const location of parseSitemapXmlV2(result.text)) {
        if (!sameRegistrableHost(location, officialDomain)) continue;
        if (/\.xml(?:$|\?)/i.test(location)) {
          if (!visited.has(location) && !queue.includes(location)) queue.push(location);
        } else if (pages.size < MAX_URLS) {
          pages.add(location);
        }
      }
      sortQueue(queue);
    } catch {}
  }

  const ranked = [...pages]
    .map((url) => ({ url, score: scoreUrlForCandidate(url, candidate), method: "sitemap_v2" }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.url.localeCompare(b.url));

  return {
    status: ranked.length ? "FOUND" : "NOT_FOUND",
    urls: ranked.slice(0, 12),
    sitemapCount: visited.size,
    scannedUrlCount: pages.size,
  };
}

export async function discoverOfficialUrlsV2(candidate, options = {}) {
  const original = await discoverV1(candidate, options);
  if (original.status === "FOUND") return original;
  const officialDomain = String(candidate.official_domain ?? "").trim();
  if (!officialDomain) return original;
  const fallback = await crawlOfficialSitemaps(candidate, officialDomain, options);
  if (fallback.status === "FOUND") return fallback;
  return {
    ...original,
    sitemapCount: Math.max(original.sitemapCount ?? 0, fallback.sitemapCount ?? 0),
    scannedUrlCount: Math.max(original.scannedUrlCount ?? 0, fallback.scannedUrlCount ?? 0),
  };
}

export { fetchOfficialPage, sameRegistrableHost };
