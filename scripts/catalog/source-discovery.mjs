import { URL } from "node:url";

const DEFAULT_TIMEOUT_MS = 10000;
const MAX_SITEMAPS = 12;
const MAX_URLS = 12000;

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
  const text = `${candidate.brand ?? ""} ${candidate.name ?? ""} ${candidate.concentration ?? ""}`
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const stop = new Set(["eau","de","du","des","the","for","pour","parfum","perfume","edp","edt","edc","extrait","elixir","le","la","les","and"]);
  return [...new Set(text.split(/[^a-z0-9]+/).filter((t) => t.length >= 3 && !stop.has(t)))];
}

export function scoreUrlForCandidate(url, candidate) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(url).pathname).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
  catch { return -Infinity; }
  const tokens = tokenizeIdentity(candidate);
  if (!tokens.length) return 0;
  let score = 0;
  for (const token of tokens) if (pathname.includes(token)) score += token.length >= 7 ? 4 : 2;
  if (/product|products|fragrance|perfume|parfum|eau-de/.test(pathname)) score += 2;
  if (/collection|collections|category|search|blog|article|journal|gift|discovery-set/.test(pathname)) score -= 3;
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

async function fetchText(url, { fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(url, { redirect: "follow", signal: controller.signal, headers: { "user-agent": "AromiaCatalogExpansion/1.0 (+catalog research; read-only)" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { text: await res.text(), finalUrl: res.url || url, contentType: res.headers?.get?.("content-type") ?? "" };
  } finally { clearTimeout(timer); }
}

export async function discoverOfficialUrls(candidate, options = {}) {
  const officialDomain = String(candidate.official_domain ?? "").trim();
  if (!officialDomain) return { status: "NO_OFFICIAL_DOMAIN", urls: [], sitemapCount: 0 };
  const origin = `https://${officialDomain}`;
  const sitemapSeeds = new Set([`${origin}/sitemap.xml`]);
  try {
    const robots = await fetchText(`${origin}/robots.txt`, options);
    for (const sitemap of parseRobotsSitemaps(robots.text)) if (sameRegistrableHost(sitemap, officialDomain)) sitemapSeeds.add(sitemap);
  } catch {}

  const queue = [...sitemapSeeds];
  const visited = new Set();
  const pageUrls = new Set();
  while (queue.length && visited.size < MAX_SITEMAPS && pageUrls.size < MAX_URLS) {
    const sitemapUrl = queue.shift();
    if (visited.has(sitemapUrl) || !sameRegistrableHost(sitemapUrl, officialDomain)) continue;
    visited.add(sitemapUrl);
    try {
      const { text } = await fetchText(sitemapUrl, options);
      const locations = parseSitemapXml(text);
      for (const loc of locations) {
        if (!sameRegistrableHost(loc, officialDomain)) continue;
        if (/\.xml($|\?)/i.test(loc) && queue.length + visited.size < MAX_SITEMAPS) queue.push(loc);
        else if (pageUrls.size < MAX_URLS) pageUrls.add(loc);
      }
    } catch {}
  }

  const ranked = [...pageUrls].map((url) => ({ url, score: scoreUrlForCandidate(url, candidate) })).filter((r) => r.score > 0).sort((a,b) => b.score - a.score || a.url.localeCompare(b.url));
  return { status: ranked.length ? "FOUND" : "NOT_FOUND", urls: ranked.slice(0, 5), sitemapCount: visited.size, scannedUrlCount: pageUrls.size };
}

export async function fetchOfficialPage(url, officialDomain, options = {}) {
  if (!sameRegistrableHost(url, officialDomain)) throw new Error(`Refusing non-official host: ${url}`);
  const result = await fetchText(url, options);
  if (!sameRegistrableHost(result.finalUrl, officialDomain)) throw new Error(`Redirect left official domain: ${result.finalUrl}`);
  return result;
}
