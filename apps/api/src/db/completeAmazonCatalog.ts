import type { Pool } from "pg";

const AMAZON_TAG = process.env.AROMIA_AMAZON_ASSOCIATE_TAG || "aromialab-20";
const REQUEST_TIMEOUT_MS = 12_000;
const CONCURRENCY = 3;
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

type Candidate = { asin: string; title: string; imageUrl: string | null; score: number };
type Resolution = { asin: string; productUrl: string; imageUrl: string; title: string; score: number; source: "existing-product" | "amazon-search" };

const STOP = new Set(["by","for","the","and","de","la","le","el","eau","parfum","perfume","fragrance","spray","natural","men","man","women","woman","unisex","edp","edt","edc","ml","oz","fl","new","authentic","tester","pack","size"]);

function sleep(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function decode(value: string) { return value.replace(/&amp;/gi,"&").replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,"<").replace(/&gt;/gi,">"); }
function strip(value: string) { return decode(value.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()); }
function normalize(value: string | null | undefined) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9]+/g," ").replace(/\s+/g," ").trim();
}
function identityTokens(value: string | null | undefined) { return normalize(value).split(" ").filter((token) => token && !STOP.has(token)); }
function brandTokens(value: string | null | undefined) { return identityTokens(value).filter((token) => !/^\d+(?:\.\d+)?$/.test(token)); }
function coverage(required: string[], haystack: Set<string>) { return required.length === 0 ? 1 : required.filter((token) => haystack.has(token)).length / required.length; }
function concentration(value: string | null | undefined): "extrait"|"edp"|"edt"|"edc"|"parfum"|null {
  const text = normalize(value);
  if (/\bextrait\b/.test(text)) return "extrait";
  if (/\beau de parfum\b|\bedp\b/.test(text)) return "edp";
  if (/\beau de toilette\b|\bedt\b/.test(text)) return "edt";
  if (/\beau de cologne\b|\bedc\b/.test(text)) return "edc";
  if (/\bparfum\b/.test(text)) return "parfum";
  return null;
}

function brandCoverage(perfume: PublishedPerfume, title: string) {
  const haystack = new Set(identityTokens(title));
  let result = coverage(brandTokens(perfume.marca), haystack);
  const brand = normalize(perfume.marca);
  const text = normalize(title);
  const aliases: Record<string,string[]> = {
    "yves saint laurent":["ysl"], "giorgio armani":["armani"], "maison francis kurkdjian":["mfk","francis kurkdjian"],
    "parfums de marly":["parfums de marly","pdm"], "carolina herrera":["carolina herrera","herrera"],
    "dolce and gabbana":["dolce gabbana","d g"], "frederic malle":["frederic malle","editions de parfums frederic malle"],
    "kilian":["by kilian","kilian paris"]
  };
  for (const alias of aliases[brand] ?? []) if (text.includes(alias)) result = 1;
  return result;
}

export function scoreAmazonIdentity(perfume: PublishedPerfume, title: string) {
  const haystack = new Set(identityTokens(title));
  const nameCoverage = coverage(identityTokens(perfume.nombre), haystack);
  const brand = brandCoverage(perfume, title);
  if (brand < 0.49 || nameCoverage < 0.67) return 0;
  const wanted = concentration(perfume.concentracion);
  const found = concentration(title);
  if (wanted && found && wanted !== found) return 0;
  let score = brand * 0.36 + nameCoverage * 0.54 + (wanted ? (found === wanted ? 0.1 : 0.03) : 0.06);
  if (normalize(title).includes(normalize(perfume.nombre))) score += 0.06;
  return Math.min(1, score);
}

function isAmazonHost(host: string) { const value = host.toLowerCase().replace(/^www\./,""); return value === "amazon.com" || value.endsWith(".amazon.com") || /^amazon\.[a-z.]+$/.test(value); }
function isAmazonImageHost(host: string) { const value = host.toLowerCase(); return value.endsWith("media-amazon.com") || value.endsWith("ssl-images-amazon.com"); }
function cleanImage(value: string | null | undefined) {
  const raw = String(value ?? "").trim().replace(/\\u0026/g,"&").replace(/\\\//g,"/");
  if (!raw) return null;
  try { const url = new URL(decode(raw)); return /^https?:$/.test(url.protocol) && isAmazonImageHost(url.hostname) ? url.toString() : null; } catch { return null; }
}
function asinFromUrl(value: string | null | undefined) {
  try { const url = new URL(String(value ?? "")); if (!isAmazonHost(url.hostname)) return null; return url.pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})(?:[/?]|$)/i)?.[1]?.toUpperCase() ?? null; } catch { return null; }
}
function affiliateUrl(asin: string) { const url = new URL(`https://www.amazon.com/dp/${asin}`); url.searchParams.set("tag",AMAZON_TAG); return url.toString(); }
function captcha(html: string) { return /robot check|validatecaptcha|enter the characters you see below|sorry, we just need to make sure you're not a robot/i.test(html); }

async function fetchHtml(url: string) {
  for (const [index,userAgent] of [DESKTOP_UA,MOBILE_UA].entries()) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(url,{redirect:"follow",cache:"no-store",signal:controller.signal,headers:{"user-agent":userAgent,accept:"text/html,application/xhtml+xml","accept-language":"en-US,en;q=0.9"}});
      if (response.ok) { const html = await response.text(); if (!captcha(html)) return html; }
    } catch { /* retry with alternate user agent */ }
    finally { clearTimeout(timer); }
    await sleep(500 + index * 400);
  }
  return null;
}

function productTitle(html: string) {
  const match = html.match(/<span[^>]+id=["']productTitle["'][^>]*>([\s\S]*?)<\/span>/i) ?? html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? strip(match[1]).replace(/\s*:\s*Amazon\.com.*$/i,"").trim() : "";
}
function productImage(html: string) {
  const values: Array<string|undefined> = [];
  values.push((html.match(/id=["']landingImage["'][^>]+data-old-hires=["']([^"']+)["']/i) ?? html.match(/data-old-hires=["']([^"']+)["'][^>]+id=["']landingImage["']/i))?.[1]);
  const dynamic = html.match(/id=["']landingImage["'][^>]+data-a-dynamic-image=["']([^"']+)["']/i) ?? html.match(/data-a-dynamic-image=["']([^"']+)["'][^>]+id=["']landingImage["']/i);
  if (dynamic) for (const match of Array.from(decode(dynamic[1]).matchAll(/"(https?:\/\/[^" ]+(?:media-amazon|ssl-images-amazon)[^" ]*)"/gi))) values.push(match[1]);
  values.push(html.match(/"hiRes"\s*:\s*"([^"]+)"/i)?.[1],html.match(/"large"\s*:\s*"([^"]+)"/i)?.[1],html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1]);
  for (const value of values) { const image = cleanImage(value); if (image) return image; }
  return null;
}

function searchCandidates(perfume: PublishedPerfume, html: string) {
  const starts = Array.from(html.matchAll(/<div[^>]+data-component-type=["']s-search-result["'][^>]+data-asin=["']([A-Z0-9]{10})["'][^>]*>/gi));
  const out: Candidate[] = [];
  for (let index=0; index<starts.length && out.length<10; index+=1) {
    const asin = starts[index][1]?.toUpperCase(); if (!asin) continue;
    const from = starts[index].index ?? 0; const to = starts[index+1]?.index ?? Math.min(html.length,from+48_000); const block = html.slice(from,to);
    if (/s-sponsored-label-text|aria-label=["']Sponsored["']/i.test(block.slice(0,5000))) continue;
    const titleMatch = block.match(/<h2[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>[\s\S]*?<\/h2>/i) ?? block.match(/<h2[^>]+aria-label=["']([^"']+)["']/i);
    const title = titleMatch ? strip(titleMatch[1]) : ""; if (!title) continue;
    const imageMatch = block.match(/<img[^>]+class=["'][^"']*s-image[^"']*["'][^>]+src=["']([^"']+)["']/i) ?? block.match(/<img[^>]+src=["']([^"']+)["'][^>]+class=["'][^"']*s-image[^"']*["']/i);
    const score = scoreAmazonIdentity(perfume,title); if (score > 0) out.push({asin,title,imageUrl:cleanImage(imageMatch?.[1]),score});
  }
  return out.sort((a,b)=>b.score-a.score);
}

function searchUrls(perfume: PublishedPerfume) {
  const urls: string[] = [];
  for (const existing of [perfume.amazon_url,perfume.link_afiliado]) {
    try { const url = new URL(String(existing ?? "")); if (isAmazonHost(url.hostname) && !asinFromUrl(existing) && /\/s(?:earch)?\b|\/gp\/aw\/s\b/.test(url.pathname)) urls.push(url.toString()); } catch { /* ignore */ }
  }
  for (const query of [[perfume.marca,perfume.nombre,perfume.concentracion].filter(Boolean).join(" "),[perfume.marca,perfume.nombre].filter(Boolean).join(" ")]) {
    for (const path of ["/s","/gp/aw/s"]) { const url = new URL(`https://www.amazon.com${path}`); url.searchParams.set("k",query); urls.push(url.toString()); }
  }
  return urls.filter((value,index,all)=>all.indexOf(value)===index);
}

async function resolveAsin(perfume: PublishedPerfume, asin: string, fallbackImage: string | null, source: Resolution["source"]): Promise<Resolution|null> {
  const url = affiliateUrl(asin);
  const html = await fetchHtml(url) ?? await fetchHtml(`https://www.amazon.com/gp/aw/d/${asin}`);
  if (!html && fallbackImage) return {asin,productUrl:url,imageUrl:fallbackImage,title:`${perfume.marca} ${perfume.nombre}`,score:0.82,source};
  if (!html) return null;
  const title = productTitle(html); const score = title ? scoreAmazonIdentity(perfume,title) : 0;
  if (title && score < 0.72) return null;
  const imageUrl = productImage(html) ?? fallbackImage; if (!imageUrl) return null;
  return {asin,productUrl:url,imageUrl,title:title || `${perfume.marca} ${perfume.nombre}`,score:Math.max(score,0.82),source};
}

async function resolvePerfume(perfume: PublishedPerfume) {
  for (const current of [perfume.amazon_url,perfume.link_afiliado]) { const asin = asinFromUrl(current); if (asin) { const result = await resolveAsin(perfume,asin,cleanImage(perfume.imagen_url),"existing-product"); if (result) return result; } }
  for (const url of searchUrls(perfume)) {
    const html = await fetchHtml(url); if (!html) continue;
    for (const candidate of searchCandidates(perfume,html).slice(0,4)) { if (candidate.score < 0.72) continue; const result = await resolveAsin(perfume,candidate.asin,candidate.imageUrl,"amazon-search"); if (result) return {...result,score:Math.max(result.score,candidate.score)}; }
    await sleep(160);
  }
  return null;
}

function complete(row: PublishedPerfume) { return Boolean((asinFromUrl(row.amazon_url) ?? asinFromUrl(row.link_afiliado)) && cleanImage(row.imagen_url)); }

async function ensureAudit(pool: Pool) {
  await pool.query(`CREATE TABLE IF NOT EXISTS catalog_amazon_completion_audit (
    id BIGSERIAL PRIMARY KEY, run_id TEXT NOT NULL, perfume_id INTEGER NOT NULL REFERENCES perfumes(id) ON DELETE CASCADE,
    slug TEXT NOT NULL, status TEXT NOT NULL, asin TEXT, amazon_url TEXT, image_url TEXT, match_score NUMERIC(5,4), source TEXT, details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
}

async function persist(pool: Pool, row: PublishedPerfume, resolution: Resolution, runId: string) {
  await pool.query(`WITH updated AS (
    UPDATE perfumes SET amazon_url=$1, link_afiliado=$1, imagen_url=$2, image_source=$1, affiliate_status='active', visual_quality='amazon-product', actualizado_en=now()
    WHERE id=$3 RETURNING id,slug)
    INSERT INTO catalog_amazon_completion_audit(run_id,perfume_id,slug,status,asin,amazon_url,image_url,match_score,source,details)
    SELECT $4,id,slug,'RESOLVED',$5,$1,$2,$6,$7,$8 FROM updated`,
    [resolution.productUrl,resolution.imageUrl,row.id,runId,resolution.asin,resolution.score,resolution.source,resolution.title]);
}
async function unresolved(pool: Pool,row: PublishedPerfume,runId: string) {
  await pool.query(`INSERT INTO catalog_amazon_completion_audit(run_id,perfume_id,slug,status,details) VALUES($1,$2,$3,'UNRESOLVED',$4)`,[runId,row.id,row.slug,`${row.marca} — ${row.nombre} — ${row.concentracion ?? "n/a"}`]);
}
async function mapLimit<T>(items:T[],limit:number,worker:(item:T,index:number)=>Promise<void>) { let next=0; async function run(){ while(true){ const index=next++; if(index>=items.length)return; await worker(items[index],index); } } await Promise.all(Array.from({length:Math.min(limit,items.length)},()=>run())); }

export async function completePublishedAmazonCatalog(pool: Pool) {
  await ensureAudit(pool);
  const runId = `amazon-completion-${new Date().toISOString()}`;
  const result = await pool.query<PublishedPerfume>(`SELECT id,slug,nombre,marca,concentracion,genero,amazon_url,link_afiliado,imagen_url FROM perfumes WHERE activo=true AND estado='publicado' ORDER BY id`);
  const pending = result.rows.filter((row)=>!complete(row));
  console.log(`[amazon-completion] run=${runId} published=${result.rows.length} pending=${pending.length} tag=${AMAZON_TAG}`);
  const unresolvedRows: PublishedPerfume[] = []; let resolvedNow=0;
  await mapLimit(pending,CONCURRENCY,async(row,index)=>{
    const resolution = await resolvePerfume(row);
    if (!resolution) { unresolvedRows.push(row); await unresolved(pool,row,runId); console.error(`[amazon-completion] UNRESOLVED ${index+1}/${pending.length} ${row.slug}`); return; }
    await persist(pool,row,resolution,runId); resolvedNow+=1; console.log(`[amazon-completion] RESOLVED ${index+1}/${pending.length} ${row.slug} asin=${resolution.asin} score=${resolution.score.toFixed(3)}`); await sleep(120);
  });
  const gate = await pool.query<{total:string;bad_link:string;bad_image:string;missing_tag:string}>(`SELECT count(*)::text total,
    count(*) FILTER(WHERE COALESCE(amazon_url,link_afiliado,'') !~* '^https?://([^/]*\\.)?amazon\\.com/(dp|gp/product)/[A-Z0-9]{10}')::text bad_link,
    count(*) FILTER(WHERE COALESCE(imagen_url,'') !~* '^https?://([^/]*\\.)?(media-amazon\\.com|ssl-images-amazon\\.com)/')::text bad_image,
    count(*) FILTER(WHERE COALESCE(amazon_url,link_afiliado,'') NOT ILIKE '%tag=${AMAZON_TAG.replace(/'/g,"''")}%')::text missing_tag
    FROM perfumes WHERE activo=true AND estado='publicado'`);
  const summary=gate.rows[0];
  console.log(`[amazon-completion] FINAL total=${summary.total} resolved_now=${resolvedNow} unresolved_now=${unresolvedRows.length} bad_link=${summary.bad_link} bad_image=${summary.bad_image} missing_tag=${summary.missing_tag}`);
  if (+summary.bad_link || +summary.bad_image || +summary.missing_tag) throw new Error(`AMAZON_COMPLETION_GATE_FAILED bad_link=${summary.bad_link} bad_image=${summary.bad_image} missing_tag=${summary.missing_tag} unresolved=[${unresolvedRows.slice(0,25).map((row)=>row.slug).join(",")}]`);
}
