import { writeFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";

const API_BASE = (process.env.AROMIA_API_BASE || "https://api-production-fe2f.up.railway.app").replace(/\/$/, "");
const WEB_BASE = (process.env.AROMIA_WEB_BASE || "https://www.aromialab.com").replace(/\/$/, "");
const EXPECTED = Number(process.env.AROMIA_EXPECTED_PUBLISHED || "125");
const CONCURRENCY = Math.max(1, Number(process.env.AROMIA_AUDIT_CONCURRENCY || "8"));
const REPORT_PATH = process.env.AROMIA_CCL_REPORT || "docs/audits/ccl-production-latest.json";
const TIMEOUT_MS = 15_000;

const failures = [];
const warnings = [];
const detail = [];

function timeoutSignal(ms = TIMEOUT_MS) {
  return AbortSignal.timeout(ms);
}

async function fetchChecked(url, init = {}) {
  return fetch(url, { redirect: "follow", signal: timeoutSignal(), ...init });
}

async function mapLimit(items, limit, worker) {
  let cursor = 0;
  const out = new Array(items.length);
  async function run() {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      out[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return out;
}

function isSocialCard(url) {
  return /\/perfume-social-cards\//i.test(String(url || ""));
}

function identityKey(p) {
  return [p.marca, p.nombre, p.concentracion]
    .map((v) => String(v || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim())
    .join("|");
}

const catalogResponse = await fetchChecked(`${API_BASE}/api/perfumes`, { headers: { accept: "application/json" } });
if (!catalogResponse.ok) throw new Error(`CCL cannot read catalog: HTTP ${catalogResponse.status}`);
const perfumes = await catalogResponse.json();
if (!Array.isArray(perfumes)) throw new Error("CCL catalog payload is not an array");

if (perfumes.length !== EXPECTED) failures.push(`published_count expected=${EXPECTED} actual=${perfumes.length}`);

const slugSet = new Set();
const identitySet = new Set();
for (const perfume of perfumes) {
  if (!perfume.slug || !perfume.nombre || !perfume.marca) failures.push(`required_identity_missing id=${perfume.id ?? "unknown"}`);
  if (slugSet.has(perfume.slug)) failures.push(`duplicate_slug slug=${perfume.slug}`);
  slugSet.add(perfume.slug);
  const identity = identityKey(perfume);
  if (identitySet.has(identity)) warnings.push(`duplicate_identity candidate=${perfume.marca} ${perfume.nombre} ${perfume.concentracion || ""}`.trim());
  identitySet.add(identity);
  if (!perfume.imagen_url) warnings.push(`catalog_image_metadata_missing slug=${perfume.slug}`);
  if (isSocialCard(perfume.imagen_url)) failures.push(`social_card_forbidden slug=${perfume.slug}`);
  if (!perfume.source_url) warnings.push(`provenance_source_missing slug=${perfume.slug}`);
  if (!perfume.data_confidence) warnings.push(`data_confidence_missing slug=${perfume.slug}`);
}

await mapLimit(perfumes, CONCURRENCY, async (perfume) => {
  const row = { slug: perfume.slug, pdp: null, image: null, imagePolicy: null };
  try {
    const pdp = await fetchChecked(`${WEB_BASE}/catalogo/${encodeURIComponent(perfume.slug)}`, { headers: { accept: "text/html" } });
    row.pdp = pdp.status;
    if (pdp.status !== 200) failures.push(`pdp_unavailable slug=${perfume.slug} status=${pdp.status}`);
    else {
      const html = await pdp.text();
      if (!html.includes(perfume.nombre)) warnings.push(`pdp_name_not_observed slug=${perfume.slug}`);
      if (!html.includes(`/catalogo/${perfume.slug}`)) warnings.push(`pdp_canonical_not_observed slug=${perfume.slug}`);
      if (!html.includes('application/ld+json')) warnings.push(`pdp_product_jsonld_not_observed slug=${perfume.slug}`);
    }
  } catch (error) {
    failures.push(`pdp_fetch_failed slug=${perfume.slug} error=${error instanceof Error ? error.message : String(error)}`);
  }

  try {
    const image = await fetchChecked(`${WEB_BASE}/api/catalog-image/${encodeURIComponent(perfume.slug)}`, { headers: { accept: "image/*" } });
    row.image = image.status;
    row.imagePolicy = image.headers.get("x-aromia-image-policy");
    const contentType = image.headers.get("content-type") || "";
    if (image.status !== 200 || !contentType.startsWith("image/")) failures.push(`ccl_image_unavailable slug=${perfume.slug} status=${image.status} type=${contentType}`);
    if (row.imagePolicy !== "omni-ccl-product-only") failures.push(`ccl_image_policy_missing slug=${perfume.slug} policy=${row.imagePolicy || "none"}`);
  } catch (error) {
    failures.push(`ccl_image_fetch_failed slug=${perfume.slug} error=${error instanceof Error ? error.message : String(error)}`);
  }
  detail.push(row);
});

const report = {
  generatedAt: new Date().toISOString(),
  apiBase: API_BASE,
  webBase: WEB_BASE,
  expectedPublished: EXPECTED,
  actualPublished: perfumes.length,
  productPagesExpected: perfumes.length,
  productPagesPass: detail.filter((r) => r.pdp === 200).length,
  cclImagesPass: detail.filter((r) => r.image === 200 && r.imagePolicy === "omni-ccl-product-only").length,
  status: failures.length === 0 ? "PASS" : "FAIL",
  failures,
  warnings,
  detail: detail.sort((a, b) => a.slug.localeCompare(b.slug)),
};

await mkdir(REPORT_PATH.split("/").slice(0, -1).join("/"), { recursive: true });
await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);

console.log(`[ccl] published ${perfumes.length}/${EXPECTED}`);
console.log(`[ccl] PDP ${report.productPagesPass}/${perfumes.length}`);
console.log(`[ccl] product images ${report.cclImagesPass}/${perfumes.length}`);
console.log(`[ccl] warnings=${warnings.length} failures=${failures.length}`);
if (warnings.length) console.warn(warnings.slice(0, 30).join("\n"));
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
