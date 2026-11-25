// Local operator-only image evidence check. No server route, image download, signing,
// catalogue mutation, publishing or credentials in output. Remote assets remain unverified.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assessImageReview } from './catalog-image-review-evidence.mjs';
import { readFeedbackAsset } from './image-quality-monitor.mjs';

function localAsset(imageUrl) {
  if (typeof imageUrl !== 'string' || !/^\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g|avif|gif)$/i.test(imageUrl)) return null;
  return `apps/web/public${imageUrl}`;
}

export function checkPrivateImageReviews(queue, receipts, root, key) {
  if (!Array.isArray(queue) || !Array.isArray(receipts)) throw new Error('invalid_review_inputs');
  const bySlug = new Map();
  for (const record of receipts) {
    if (!record || typeof record.slug !== 'string' || !record.receipt ||
        bySlug.has(record.slug)) throw new Error('invalid_or_duplicate_private_review');
    bySlug.set(record.slug, record.receipt);
  }
  const seen = new Set();
  const checks = [];
  for (const item of queue) {
    if (!item || typeof item.slug !== 'string' || seen.has(item.slug)) throw new Error('invalid_or_duplicate_catalog_slug');
    seen.add(item.slug);
    const path = localAsset(item.imageUrl);
    if (!path) {
      checks.push({slug:item.slug, status:'remote_or_unsupported_image_requires_capture', publishAllowed:false});
      continue;
    }
    const bytes = readFeedbackAsset(root, path);
    if (!bytes) {
      checks.push({slug:item.slug, status:'local_image_missing_or_unreadable', publishAllowed:false});
      continue;
    }
    const digest = createHash('sha256').update(bytes).digest('hex');
    const outcome = assessImageReview(item, digest, bySlug.get(item.slug), key);
    checks.push({slug:item.slug, ...outcome});
  }
  const unrecognized = [...bySlug.keys()].filter(slug => !seen.has(slug));
  if (unrecognized.length) throw new Error('private_review_unknown_catalog_product');
  return {
    schemaVersion:1,
    scope:'local_public_images_only',
    publication:'blocked',
    totals:{catalog:checks.length,authenticated:checks.filter(x=>x.status==='authenticated_review_recorded').length,rejected:checks.filter(x=>x.status==='authenticated_rejection_recorded').length},
    checks,
    limitations:[
      'A signed receipt is not proof of product identity, source rights or reviewer human identity.',
      'Remote product packshots require an independent authorized capture and rights verification pathway.',
      'No reviews, images, products or production data are modified; publishing is always blocked.'
    ],
  };
}

function readLimitedJson(path) {
  const bytes = readFileSync(path);
  if (bytes.length > 2 * 1024 * 1024) throw new Error('private_review_input_too_large');
  return JSON.parse(bytes.toString('utf8'));
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [manifestPath, privateReceiptsPath] = process.argv.slice(2);
  if (!manifestPath || !privateReceiptsPath) throw new Error('usage: node scripts/private-image-review-operator.mjs <image-quality-signals.json> <private-receipts.json>');
  const root = fileURLToPath(new URL('../', import.meta.url));
  const manifest = readLimitedJson(manifestPath);
  if (manifest.schemaVersion !== 2 || !Array.isArray(manifest.reviewQueue)) throw new Error('invalid_catalog_review_manifest');
  const reviews = readLimitedJson(privateReceiptsPath);
  if (!reviews || !Array.isArray(reviews.reviews)) throw new Error('invalid_private_review_receipts');
  const result = checkPrivateImageReviews(manifest.reviewQueue, reviews.reviews, root, process.env.IMAGE_REVIEW_HMAC_KEY);
  console.log(JSON.stringify(result,null,2));
}
