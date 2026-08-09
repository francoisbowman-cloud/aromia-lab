import { URL } from "node:url";

const DEFAULT_TIMEOUT_MS = 8000;
const MAX_SITEMAPS = 30;
const MAX_URLS = 20000;

// A Batch 003 run contains several candidates from the same house. Discovery of
// robots/sitemaps is domain-wide, so repeating it per perfume multiplies network
// cost without adding evidence. Cache the in-flight Promise as well as the final
// corpus so concurrent candidates for one house share exactly one crawl.
const discoveryCorpusCache = new Map();

function normalizeHost(host) {
  return String(host ?? "").toLowerCase().replace(/^www\./, "");
}

export function sameRegistrableHost(url, officialDomain) {
  try {
    const host = normalizeHost(new URL(url).hostname);
    const official = normalizeHost(officialDomain);
    return host === official || host.endsWith(`.${official}`);
  } catch {
    return false;
  }
}

export function tokenizeIdentity(candidate) {
  // Brand tokens are deliberately excluded: on brand-owned sites they match almost
  // every URL and swamp the actual product-name signal (observed in Bvlgari pilot).
  const text = `${candidate.name ?? ""}`
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const stop = new Set(["eau","de","du","des","the","for","pour","parfum","perfume","edp","edt","edc","extrait","elixir","le","la","les","and","homme","uomo"]);
  return [...new Set(text.split(/[^a-z0-9]+/).filter((t) => t.length >= 3 && !stop.has(t)))];
}

export function scoreUrlForCandidate(url, candidate) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(url).pathname).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
  catch { return -Infinity; }
  if (/\.xml($|\?)/i.test(url)) return -Infinity;
  const tokens = tokenizeIdentity(candidate);
  if (!tokens.length) return 0;
  const hits = tokens.filter((token) => pathname.includes(token));
  if (!hits.length) return 0;
  let score = hits.reduce((sum, token) => sum + (token.length >= 7 ? 5 : 3), 0);
  const coverage = hits.length / tokens.length;
  score += Math.round(coverage * 10);
  if (/product|products|fragrance|fragrances|perfume|parfum|eau-de/.test(pathname)) score += 4;
  if (/collection|collections|category|search|blog|article|journal|gift|discovery-set|heritage|faq|careers/.test(pathname)) score -= 5;
  return score;
}

export function parseSitemapXml(xml) {
  const out = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(String(xml ?? ""))) !== null) out.push(m[1].replace(/&amp;/g, "&").trim());
  return out;
}

export function parseRobotsSitemaps(text) {
  return String(text ?? "").split(/\r?\n/).map((line) => line.match(/^\s*Sitemap:\s*(\S+)/i)?.[1]).filter(Boolean);
}

function sitemapPriority(url) {
  const u = String(url ?? "").toLowerCase();
  let score = 0;
  if (/product|products|fragrance|fragrances|perfume|parfum/.test(u)) score += 30;
  if (/en[-_/]|\/en\/|us[-_/]|\/us\//.test(u)) score += 8;
  if (/image|video|blog|news|article|store|career|faq/.test(u)) score -= 20;
  return score;
}

function sortSitemapQueue(queue) {
  queue.sort((a, b) => sitemapPriority(b) - sitemapPriority(a) || a.localeCompare(b));
}

export function extractInternalLinks(html, baseUrl, officialDomain) {
  const links = new Set();
  const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(String(html ?? ""))) !== null) {
    try {
      const url = new URL(m[1].replace(/&amp;/g, "&"), baseUrl).toString();
      if (sameRegistrableHost(url, officialDomain) && !/\.xml($|\?)/i.test(url)) links.add(url);
    } catch {}
  }
  return [...links];
}

async function fetchText(url, { fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, { redirect: "follow", signal: controller.signal, headers: { "user-agent": "AromiaCatalogExpansion/1.0 (+catalog research; read-only)", "accept-language": "en-US,en;q=0.8" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { text: await res.text(), finalUrl: res.url || url, contentType: res.headers?.get?.("content-type") ?? "" };
  } finally { clearTimeout(timer); }
}

async function buildOfficialCorpus(officialDomain, options = {}) {
  const origin = `https://${officialDomain}`;
  const sitemapSeeds = new Set([`${origin}/sitemap.xml`]);
  try {
    const robots = await fetchText(`${origin}/robots.txt`, options);
    for (const sitemap of parseRobotsSitemaps(robots.text)) if (sameRegistrableHost(sitemap, officialDomain)) sitemapSeeds.add(sitemap);
  } catch {}

  const queue = [...sitemapSeeds];
  sortSitemapQueue(queue);
  const visited = new Set();
  const pageUrls = new Set();
  while (queue.length && visited.size < MAX_SITEMAPS && pageUrls.size < MAX_URLS) {
    const sitemapUrl = queue.shift();
    if (visited.has(sitemapUrl) || !sameRegistrableHost(sitemapUrl, officialDomain)) continue;
    visited.add(sitemapUrl);
    try {
      const { text } = await fetchText(sitemapUrl, options);
      const locations = parseSitemapXml(text);
      const nested = [];
      for (const loc of locations) {
        if (!sameRegistrableHost(loc, officialDomain)) continue;
        if (/\.xml($|\?)/i.test(loc)) nested.push(loc);
        else if (pageUrls.size < MAX_URLS) pageUrls.add(loc);
      }
      for (const loc of nested) if (!visited.has(loc) && !queue.includes(loc)) queue.push(loc);
      sortSitemapQueue(queue);
    } catch {}
  }

  // Landing links are domain-wide too. Cache them once, but use them only for a
  // candidate whose sitemap corpus has no identity match.
  let landingLinks = [];
  try {
    const landing = await fetchText(origin, options);
    landingLinks = extractInternalLinks(landing.text, landing.finalUrl, officialDomain);
  } catch {}

  return {
    officialDomain,
    pageUrls: [...pageUrls],
    landingLinks,
    sitemapCount: visited.size,
    scannedUrlCount: pageUrls.size,
  };
}

function getOfficialCorpus(officialDomain, options = {}) {
  // Custom fetch implementations are used by tests and must remain isolated from
  // global network cache to keep fixtures deterministic.
  if (options.fetchImpl) return buildOfficialCorpus(officialDomain, options);
  const key = normalizeHost(officialDomain);
  if (!discoveryCorpusCache.has(key)) {
    const promise = buildOfficialCorpus(officialDomain, options).catch((error) => {
      discoveryCorpusCache.delete(key);
      throw error;
    });
    discoveryCorpusCache.set(key, promise);
  }
  return discoveryCorpusCache.get(key);
}

export function clearDiscoveryCorpusCache() {
  discoveryCorpusCache.clear();
}

export async function discoverOfficialUrls(candidate, options = {}) {
  const officialDomain = String(candidate.official_domain ?? "").trim();
  if (!officialDomain) return { status: "NO_OFFICIAL_DOMAIN", urls: [], sitemapCount: 0 };

  const corpus = await getOfficialCorpus(officialDomain, options).catch(() => ({ pageUrls: [], landingLinks: [], sitemapCount: 0, scannedUrlCount: 0 }));
  let ranked = corpus.pageUrls.map((url) => ({ url, score: scoreUrlForCandidate(url, candidate) })).filter((r) => r.score > 0).sort((a,b) => b.score - a.score || a.url.localeCompare(b.url));
  if (!ranked.length) {
    ranked = corpus.landingLinks.map((url) => ({ url, score: scoreUrlForCandidate(url, candidate) })).filter((r) => r.score > 0).sort((a,b) => b.score - a.score || a.url.localeCompare(b.url));
  }

  return { status: ranked.length ? "FOUND" : "NOT_FOUND", urls: ranked.slice(0, 8), sitemapCount: corpus.sitemapCount, scannedUrlCount: corpus.scannedUrlCount };
}

export async function fetchOfficialPage(url, officialDomain, options = {}) {
  if (!sameRegistrableHost(url, officialDomain)) throw new Error(`Refusing non-official host: ${url}`);
  const result = await fetchText(url, options);
  if (!sameRegistrableHost(result.finalUrl, officialDomain)) throw new Error(`Redirect left official domain: ${result.finalUrl}`);
  return result;
}
