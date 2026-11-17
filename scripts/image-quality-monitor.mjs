// Read-only quality signals: no paid calls, image generation, approvals or publishing.
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'csv-parse/sync';
export function auditImages(products) {
  const findings = [];
  const urls = new Map();
  for (const product of products) {
    if (!product.slug) throw new Error('Catalog row requires slug');
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
  const feedback = inspectFeedback(ledger.observations, path => existsSync(resolve(root,path)) ? readFileSync(resolve(root,path)) : null);
  console.log(JSON.stringify({ schemaVersion: 1, input: input ?? 'PERFUMES_INITIAL_50.csv (historical baseline, not live production)', products: products.length, findings: auditImages(products), feedback, publication: 'blocked', limitations: ['Signals do not certify visual identity or image rights.', 'No model calls or automatic image replacements.', 'Changed bytes require a new review, never an inferred approval.'] }, null, 2));
}
