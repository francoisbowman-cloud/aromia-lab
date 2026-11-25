// Read-only quality signals: no paid calls, image generation, approvals or publishing.
import { readFileSync, realpathSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, relative, isAbsolute, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'csv-parse/sync';
import { buildImageReviewQueue, summarizeImageReviewQueue } from './catalog-image-review.mjs';
// Compare only concentrations explicitly written in product names/metadata.
// A slug, remote image URL or Amazon link is not evidence for a perfume variant.
export function declaredConcentration(value) {
  const text = String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const edt = /\b(?:edt|eau\s+de\s+toilette)\b/.test(text);
  const edp = /\b(?:edp|eau\s+de\s+parfum)\b/.test(text);
  return edt && edp ? 'ambiguous' : edt ? 'edt' : edp ? 'edp' : null;
}
export function auditImages(products) {
  const findings = [];
  const urls = new Map();
  for (const product of products) {
    if (!product.slug) throw new Error('Catalog row requires slug');
    const named = declaredConcentration(product.nombre);
    const metadata = declaredConcentration(product.concentracion);
    if (named === 'ambiguous' || metadata === 'ambiguous' || (named && metadata && named !== metadata))
      findings.push({ key: `variant-conflict:${product.slug}`, slug: product.slug, reason: 'declared_concentration_conflict_requires_review', namedConcentration: named, metadataConcentration: metadata });
    const url = String(product.imagen_url ?? '').trim();
    if (!url) findings.push({ key: `missing:${product.slug}`, slug: product.slug, reason: 'missing_image' });
    else {
      let slugs = urls.get(url); if (!slugs) urls.set(url, slugs = new Set());
      slugs.add(product.slug);
    }
    // Names and explicit concentration are authority; legacy slugs may retain an old suffix.
    if (product.slug === 'chance-eau-tendre' && !/^(edt|edp|eau de toilette|eau de parfum)$/i.test(String(product.concentracion ?? '').trim()))
      findings.push({ key: `variant:${product.slug}`, slug: product.slug, reason: 'concentration_requires_verification' });
  }
  for (const [url, slugs] of urls) if (slugs.size > 1)
    findings.push({ key: `shared:${createHash('sha256').update(url).digest('hex').slice(0,16)}`, slugs: [...slugs].sort(), reason: 'shared_image_requires_review', url });
  return findings.sort((a,b) => a.key.localeCompare(b.key));
}
// Feedback files are repository-controlled, but their asset paths are still untrusted.
// Never hash/read files outside the public image directory (including symlink escapes).
export function readFeedbackAsset(root, asset) {
  if (typeof asset !== 'string' || !/^apps\/web\/public\/[a-zA-Z0-9_./-]+\.(webp|png|jpe?g|avif|gif)$/i.test(asset)) return null;
  const publicRoot = resolve(root, 'apps/web/public');
  const requested = resolve(root, asset);
  const inside = path => path && path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path);
  if (!inside(relative(publicRoot, requested))) return null;
  try {
    const canonicalRoot = realpathSync(publicRoot);
    const canonicalFile = realpathSync(requested);
    if (!inside(relative(canonicalRoot, canonicalFile))) return null;
    const info = statSync(canonicalFile);
    if (!info.isFile() || info.size > 25 * 1024 * 1024) return null;
    return readFileSync(canonicalFile);
  } catch {
    return null; // Missing or unreadable assets stay "missing"; CI must not access arbitrary paths.
  }
}
export function inspectFeedback(observations, readAsset) {
  return observations.map(item => {
    const bytes = readAsset(item.asset);
    const hash = bytes && createHash('sha256').update(bytes).digest('hex');
    return { ...item, currentSha256: hash, assetState: !hash ? 'missing' : hash === item.sha256 ? 'unchanged' : 'changed_requires_review' };
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const input = process.argv[2];
  const products = input ? JSON.parse(readFileSync(input, 'utf8')) : parse(readFileSync(resolve(root,'PERFUMES_INITIAL_50.csv'),'utf8'), { columns: true, skip_empty_lines: true });
  if (!Array.isArray(products)) throw new Error('Input must be an array of catalog records');
  const ledger = JSON.parse(readFileSync(resolve(root,'docs/intelligence/visual/feedback.json'),'utf8'));
  const feedback = inspectFeedback(ledger.observations, path => readFeedbackAsset(root, path));
  const findings = auditImages(products);
  const reviewQueue = buildImageReviewQueue(products, findings);
  console.log(JSON.stringify({ schemaVersion: 2, input: input ?? 'PERFUMES_INITIAL_50.csv (historical baseline, not live production)', products: products.length, findings, reviewSummary: summarizeImageReviewQueue(reviewQueue), reviewQueue, feedback, publication: 'blocked', limitations: ['A review queue is not visual proof: no perfume image, license or aesthetic quality was certified.', 'Historical baseline is not the live production catalog; a new production snapshot needs separate authorization and provenance.', 'No model calls or automatic image replacements.', 'Changed bytes require a new review, never an inferred approval.'] }, null, 2));
}
