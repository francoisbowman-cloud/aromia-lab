import type { Pool } from "pg";

const AMAZON_TAG = process.env.AROMIA_AMAZON_ASSOCIATE_TAG || "aromialab-20";
const REQUEST_TIMEOUT_MS = 12_000;
const CONCURRENCY = 3;
const SEARCH_RESULT_LIMIT = 8;

const DESKTOP_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const MOBILE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1";

export type PublishedPerfume = {
  id: number;
  slug: string;
  nombre: string;
  marca: string;
  concentracion: string | null;
  genero: string | null;
  amazon_url: string | null;
  link_afiliado: string | null;
  imagen_url: string | null;
};

type AmazonCandidate = {
  asin: string;
  title: string;
  imageUrl: string | null;
  score: number;
};

type Resolution = {
  asin: string;
  productUrl: string;
  imageUrl: string;
  title: string;
  score: number;
  source: "existing-product" | "amazon-search";
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function htmlDecode(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripTags(value: string) {
  return htmlDecode(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function normalize(value: string | null | undefined) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP = new Set([
  "by", "for", "the", "and", "de", "la", "le", "el", "eau", "parfum", "perfume", "fragrance", "spray", "natural",
  "men", "man", "women", "woman", "unisex", "edp", "edt", "edc", "ml", "oz", "fl", "new", "authentic", "tester", "pack", "size",
]);

function tokens(value: string | null | undefined) {
  return normalize(value).split(" ").filter((token) => token && !STOP.has(token) && !/^\d+(?:\.\d+)?$/.test(token));
}

function identityTokens(value: string | null | undefined) {
  return normalize(value).split(" ").filter((token) => token && !STOP.has(token));
}

function concentrationKind(value: string | null | undefined): "extrait" | "edp" | "edt" | "edc" | "parfum" | null {
  const text = normalize(value);
  if (!text) return null;
  if (/\bextrait\b/.test(text)) return "extrait";
  if (/\beau de parfum\b|\bedp\b/.test(text)) return "edp";
  if (/\beau de toilette\b|\bedt\b/.test(text)) return "edt";
  if (/\beau de cologne\b|\bedc\b/.test(text)) return "edc";
  if (/\bparfum\b/.test(text)) return "parfum";
  return null;
}

function tokenCoverage(required: string[], haystack: Set<string>) {
  if (required.length === 0) return 1;
  return required.filter((token) => haystack.has(token)).length / required.length;
}

function brandCoverage(perfume: PublishedPerfume, title: string) {
  const brand = tokens(perfume.marca);
  const haystack = new Set(identityTokens(title));
  let coverage = tokenCoverage(brand, haystack);
  const normalizedBrand = normalize(perfume.marca);
  const normalizedTitle = normalize(title);
  const aliases: Record<string, string[]> = {
    "yves saint laurent": ["ysl"],
    "giorgio armani": ["armani"],
    "maison francis kurkdjian": ["mfk", "francis kurkdjian"],
    "parfums de marly": ["parfums de marly", "pdm"],
    "carolina herrera": ["carolina herrera", "herrera"],
    "dolce and gabbana": ["dolce gabbana", "d g"],
    "frederic malle": ["frederic malle", "editions de parfums frederic malle"],
    "kilian": ["by kilian", "kilian paris"],
  };
  for (const alias of aliases[normalizedBrand] ?? []) {
    if (normalizedTitle.includes(alias)) coverage = Math.max(coverage, 1);
  }
  return coverage;
}

export function scoreAmazonIdentity(perfume: PublishedPerfume, title: string) {
  const titleTokens = new Set(identityTokens(title));
  const nameTokens = identityTokens(perfume.nombre);
  const nameCoverage = tokenCoverage(nameTokens, titleTokens);
  const brand = brandCoverage(perfume, title);
  if (brand < 0.49 || nameCoverage < 0.67) return 0;

  const desiredConc = concentrationKind(perfume.concentracion);
  const foundConc = concentrationKind(title);
  if (desiredConc && foundConc && desiredConc !== foundConc) return 0;

  let score = brand * 0.36 + nameCoverage * 0.54;
  if (desiredConc && foundConc === desiredConc) score += 0.1;
  else if (!desiredConc) score += 0.06;
  else score += 0.03;

  const normalizedTitle = normalize(title);
  const normalizedName = normalize(perfume.nombre);
  if (normalizedTitle.includes(normalizedName)) score += 0.06;
  return Math.min(1, score);
}

function isAmazonHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/^www\./, "");
  return host === "amazon.com" || host.endsWith(".amazon.com") || /^amazon\.[a-z.]+$/.test(host);
}

function isAmazonImageHost(hostname: string) {
  const host = hostname.toLowerCase();
  return host.endsWith("media-amazon.com") || host.endsWith("ssl-images-amazon.com");
}

function cleanAmazonImage(value: string | null | undefined) {
  const raw = String(value ?? "").trim().replace(/\\u0026/g, "&").replace(/\\\//g, "/");
  if (!raw) return null;
  try {
    const url = new URL(htmlDecode(raw));
    if (!/^https?:$/.test(url.protocol) || !isAmazonImageHost(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function asinFromUrl(value: string | null | undefined) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (!isAmazonHost(url.hostname)) return null;
    return url.pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})(?:[/?]|$)/i)?.[1]?.toUpperCase() ?? null;
  } catch {
    return null;
  }
}

function affiliateProductUrl(asin: string) {
  const url = new URL(`https://www.amazon.com/dp/${asin}`);
  url.searchParams.set("tag", AMAZON_TAG);
  return url.toString();
}

function isCaptcha(html: string) {
  return /robot check|validatecaptcha|enter the characters you see below|sorry, we just need to make sure you're not a robot/i.test(html);
}

async function fetchHtml(url: string) {
  const agents = [DESKTOP_UA, MOBILE_UA];
  for (let attempt = 0; attempt < agents.length; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        redirect: "follow",
        cache: "no-store",
        signal: controller.signal,
        headers: {
          "user-agent": agents[attempt],
          accept: "text/html,application/xhtml+xml",
          "accept-language": "en-US,en;q=0.9",
        },
      });
      if (!response.ok) {
        await sleep(450 + attempt * 350);
        continue;
      }
      const html = await response.text();
      if (isCaptcha(html)) {
        await sleep(700 + attempt * 450);
        continue;
      }
      return { html, finalUrl: response.url || url };
    } catch {
      await sleep(450 + attempt * 350);
    } finally {
      clearTimeout(timer);
    }
  }
  return null;
}

function productTitle(html: string) {
  const match = html.match(/<span[^>]+id=["']productTitle["'][^>]*>([\s\S]*?)<\/span>/i)
    ?? html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? stripTags(match[1]).replace(/\s*:\s*Amazon\.com.*$/i, "").trim() : "";
}

function extractProductImage(html: string) {
  const candidates: Array<string | undefined> = [];
  const oldHires = html.match(/id=["']landingImage["'][^>]+data-old-hires=["']([^"']+)["']/i)
    ?? html.match(/data-old-hires=["']([^"']+)["'][^>]+id=["']landingImage["']/i);
  candidates.push(oldHires?.[1]);

  const dynamic = html.match(/id=["']landingImage["'][^>]+data-a-dynamic-image=["']([^"']+)["']/i)
    ?? html.match(/data-a-dynamic-image=["']([^"']+)["'][^>]+id=["']landingImage["']/i);
  if (dynamic) {
    const decoded = htmlDecode(dynamic[1]);
    for (const match of Array.from(decoded.matchAll(/"(https?:\/\/[^" ]+(?:media-amazon|ssl-images-amazon)[^" ]*)"/gi))) candidates.push(match[1]);
  }

  candidates.push(
    html.match(/"hiRes"\s*:\s*"([^"]+)"/i)?.[1],
    html.match(/"large"\s*:\s*"([^"]+)"/i)?.[1],
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1],
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1],
  );
  for (const value of candidates) {
    const cleaned = cleanAmazonImage(value);
    if (cleaned) return cleaned;
  }
  return null;
}

function parseSearchCandidates(perfume: PublishedPerfume, html: string) {
  const starts = Array.from(html.matchAll(/<div[^>]+data-component-type=["']s-search-result["'][^>]+data-asin=["']([A-Z0-9]{10})["'][^>]*>/gi));
  const candidates: AmazonCandidate[] = [];
  for (let index = 0; index < starts.length && candidates.length < SEARCH_RESULT_LIMIT; index += 1) {
    const match = starts[index];
    const asin = match[1]?.toUpperCase();
    if (!asin) continue;
    const from = match.index ?? 0;
    const to = starts[index + 1]?.index ?? Math.min(html.length, from + 48_000);
    const block = html.slice(from, to);
    if (/s-sponsored-label-text|aria-label=["']Sponsored["']/i.test(block.slice(0, 5000))) continue;
    const titleMatch = block.match(/<h2[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>[\s\S]*?<\/h2>/i)
      ?? block.match(/<h2[^>]+aria-label=["']([^"']+)["']/i);
    const title = titleMatch ? stripTags(titleMatch[1]) : "";
    if (!title) continue;
    const imageMatch = block.match(/<img[^>]+class=["'][^"']*s-image[^"']*["'][^>]+src=["']([^"']+)["']/i)
      ?? block.match(/<img[^>]+src=["']([^"']+)["'][^>]+class=["'][^"']*s-image[^"']*["']/i);
    const score = scoreAmazonIdentity(perfume, title);
    if (score <= 0) continue;
    candidates.push({ asin, title, imageUrl: cleanAmazonImage(imageMatch?.[1]), score });
  }
  return candidates.sort((a, b) => b.score - a.score);
}

function searchUrls(perfume: PublishedPerfume) {
  const out: string[] = [];
  for (const existing of [perfume.amazon_url, perfume.link_afiliado]) {
    try {
      const url = new URL(String(existing ?? ""));
      if (isAmazonHost(url.hostname) && !asinFromUrl(existing) && /\/s(?:earch)?\b|\/gp\/aw\/s\b/.test(url.pathname)) out.push(url.toString());
    } catch {
      // Ignore malformed stored URLs.
    }
  }
  const queries = [
    [perfume.marca, perfume.nombre, perfume.concentracion].filter(Boolean).join(" "),
    [perfume.marca, perfume.nombre].filter(Boolean).join(" "),
  ];
  for (const query of queries) {
    const url = new URL("https://www.amazon.com/s");
    url.searchParams.set("k", query);
    out.push(url.toString());
    const mobile = new URL("https://www.amazon.com/gp/aw/s");
    mobile.searchParams.set("k", query);
    out.push(mobile.toString());
  }
  return out.filter((value, index, all) => all.indexOf(value) === index);
}

async function resolveAsin(perfume: PublishedPerfume, asin: string, fallbackImage: string | null, source: Resolution["source"]) {
  const productUrl = affiliateProductUrl(asin);
  const desktop = await fetchHtml(productUrl);
  const mobile = desktop ?? await fetchHtml(`https://www.amazon.com/gp/aw/d/${asin}`);
  const page = mobile;
  if (!page && fallbackImage) {
    return { asin, productUrl, imageUrl: fallbackImage, title: `${perfume.marca} ${perfume.nombre}`, score: 0.82, source } satisfies Resolution;
  }
  if (!page) return null;
  const title = productTitle(page.html);
  const score = title ? scoreAmazonIdentity(perfume, title) : 0;
  if (title && score < 0.72) return null;
  const imageUrl = extractProductImage(page.html) ?? fallbackImage;
  if (!imageUrl) return null;
  return { asin, productUrl, imageUrl, title: title || `${perfume.marca} ${perfume.nombre}`, score: Math.max(score, 0.82), source } satisfies Resolution;
}

async function resolvePerfume(perfume: PublishedPerfume): Promise<Resolution | null> {
  for (const current of [perfume.amazon_url, perfume.link_afiliado]) {
    const asin = asinFromUrl(current);
    if (!asin) continue;
    const resolved = await resolveAsin(perfume, asin, cleanAmazonImage(perfume.imagen_url), "existing-product");
    if (resolved) return resolved;
  }

  for (const url of searchUrls(perfume)) {
    const page = await fetchHtml(url);
    if (!page) continue;
    const candidates = parseSearchCandidates(perfume, page.html).slice(0, 4);
    for (const candidate of candidates) {
      if (candidate.score < 0.72) continue;
      const resolved = await resolveAsin(perfume, candidate.asin, candidate.imageUrl, "amazon-search");
      if (resolved) return { ...resolved, score: Math.max(resolved.score, candidate.score) };
    }
    await sleep(180);
  }
  return null;
}

function rowAlreadyComplete(perfume: PublishedPerfume) {
  const asin = asinFromUrl(perfume.amazon_url) ?? asinFromUrl(perfume.link_afiliado);
  return Boolean(asin && cleanAmazonImage(perfume.imagen_url));
}

async function ensureAuditTable(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS catalog_amazon_completion_audit (
      id BIGSERIAL PRIMARY KEY,
      run_id TEXT NOT NULL,
      perfume_id INTEGER NOT NULL REFERENCES perfumes(id) ON DELETE CASCADE,
      slug TEXT NOT NULL,
      status TEXT NOT NULL,
      asin TEXT,
      amazon_url TEXT,
      image_url TEXT,
      match_score NUMERIC(5,4),
      source TEXT,
      details TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

async function persistResolution(pool: Pool, perfume: PublishedPerfume, resolution: Resolution, runId: string) {
  await pool.query("BEGIN");
  try {
    await pool.query(
      `UPDATE perfumes
       SET amazon_url = $1,
           link_afiliado = $1,
           imagen_url = $2,
           image_source = $1,
           affiliate_status = 'active',
           visual_quality = 'amazon-product',
           actualizado_en = now()
       WHERE id = $3`,
      [resolution.productUrl, resolution.imageUrl, perfume.id],
    );
    await pool.query(
      `INSERT INTO catalog_amazon_completion_audit
       (run_id, perfume_id, slug, status, asin, amazon_url, image_url, match_score, source, details)
       VALUES ($1,$2,$3,'RESOLVED',$4,$5,$6,$7,$8,$9)`,
      [runId, perfume.id, perfume.slug, resolution.asin, resolution.productUrl, resolution.imageUrl, resolution.score, resolution.source, resolution.title],
    );
    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

async function recordUnresolved(pool: Pool, perfume: PublishedPerfume, runId: string) {
  await pool.query(
    `INSERT INTO catalog_amazon_completion_audit
     (run_id, perfume_id, slug, status, details)
     VALUES ($1,$2,$3,'UNRESOLVED',$4)`,
    [runId, perfume.id, perfume.slug, `${perfume.marca} — ${perfume.nombre} — ${perfume.concentracion ?? "n/a"}`],
  );
}

async function mapLimit<T>(items: T[], limit: number, worker: (item: T, index: number) => Promise<void>) {
  let next = 0;
  async function run() {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => run()));
}

export async function completePublishedAmazonCatalog(pool: Pool) {
  await ensureAuditTable(pool);
  const runId = `amazon-completion-${new Date().toISOString()}`;
  const result = await pool.query<PublishedPerfume>(
    `SELECT id, slug, nombre, marca, concentracion, genero, amazon_url, link_afiliado, imagen_url
     FROM perfumes
     WHERE activo = true AND estado = 'publicado'
     ORDER BY id`,
  );
  const published = result.rows;
  const pending = published.filter((row) => !rowAlreadyComplete(row));
  console.log(`[amazon-completion] run=${runId} published=${published.length} pending=${pending.length} tag=${AMAZON_TAG}`);

  const unresolved: PublishedPerfume[] = [];
  let resolvedCount = 0;
  await mapLimit(pending, CONCURRENCY, async (perfume, index) => {
    const resolution = await resolvePerfume(perfume);
    if (!resolution) {
      unresolved.push(perfume);
      await recordUnresolved(pool, perfume, runId);
      console.error(`[amazon-completion] UNRESOLVED ${index + 1}/${pending.length} ${perfume.slug} :: ${perfume.marca} ${perfume.nombre} ${perfume.concentracion ?? ""}`);
      return;
    }
    await persistResolution(pool, perfume, resolution, runId);
    resolvedCount += 1;
    console.log(`[amazon-completion] RESOLVED ${index + 1}/${pending.length} ${perfume.slug} asin=${resolution.asin} score=${resolution.score.toFixed(3)} source=${resolution.source}`);
    await sleep(120);
  });

  const gate = await pool.query<{
    total: string;
    bad_link: string;
    bad_image: string;
    missing_tag: string;
  }>(`
    SELECT
      count(*)::text AS total,
      count(*) FILTER (WHERE COALESCE(amazon_url, link_afiliado, '') !~* '^https?://([^/]*\\.)?amazon\\.com/(dp|gp/product)/[A-Z0-9]{10}')::text AS bad_link,
      count(*) FILTER (WHERE COALESCE(imagen_url, '') !~* '^https?://([^/]*\\.)?(media-amazon\\.com|ssl-images-amazon\\.com)/')::text AS bad_image,
      count(*) FILTER (WHERE COALESCE(amazon_url, link_afiliado, '') NOT ILIKE '%tag=${AMAZON_TAG.replace(/'/g, "''")}%')::text AS missing_tag
    FROM perfumes
    WHERE activo = true AND estado = 'publicado'
  `);
  const summary = gate.rows[0];
  console.log(`[amazon-completion] FINAL total=${summary.total} resolved_now=${resolvedCount} unresolved_now=${unresolved.length} bad_link=${summary.bad_link} bad_image=${summary.bad_image} missing_tag=${summary.missing_tag}`);

  if (Number(summary.bad_link) !== 0 || Number(summary.bad_image) !== 0 || Number(summary.missing_tag) !== 0) {
    const sample = unresolved.slice(0, 20).map((row) => row.slug).join(", ");
    throw new Error(`AMAZON_COMPLETION_GATE_FAILED bad_link=${summary.bad_link} bad_image=${summary.bad_image} missing_tag=${summary.missing_tag} unresolved_sample=[${sample}]`);
  }
}
