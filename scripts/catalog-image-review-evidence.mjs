// Review receipts are isolated evidence, never product-catalog writes or publish permission.
// The authenticated reviewer must inspect actual bytes: a URL or slug is NOT image proof.
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const HEX = /^[a-f0-9]{64}$/i;
const NONEMPTY = value => typeof value === 'string' && value.trim().length > 0;
const DECISIONS = new Set(['approved', 'rejected']);

export function imageReviewFingerprint(item, imageSha256) {
  if (!item || ![item.slug, item.catalogName, item.catalogBrand, item.imageUrl].every(NONEMPTY))
    throw new Error('image_review_missing_product_identity');
  if (typeof imageSha256 !== 'string' || !HEX.test(imageSha256))
    throw new Error('image_review_requires_image_bytes_sha256');
  const identity = {
    slug: item.slug.trim(),
    catalogName: item.catalogName.trim(),
    catalogBrand: item.catalogBrand.trim(),
    declaredConcentration: NONEMPTY(item.declaredConcentration) ? item.declaredConcentration.trim() : null,
    imageUrl: item.imageUrl.trim(),
    imageSha256: imageSha256.toLowerCase(),
  };
  return createHash('sha256').update(JSON.stringify(identity)).digest('hex');
}

function canonicalReview(review) {
  if (!review || !NONEMPTY(review.reviewId) || !NONEMPTY(review.reviewer) ||
      !NONEMPTY(review.identityEvidence) || !NONEMPTY(review.rightsEvidence) ||
      !NONEMPTY(review.visualEvidence) || !NONEMPTY(review.reviewedAt) ||
      !DECISIONS.has(review.decision) || typeof review.fingerprint !== 'string' ||
      !HEX.test(review.fingerprint) || !Number.isFinite(Date.parse(review.reviewedAt)) ||
      !/^\d{4}-\d{2}-\d{2}T/.test(review.reviewedAt))
    throw new Error('image_review_incomplete_evidence');
  return {
    schemaVersion: 1,
    reviewId: review.reviewId.trim(),
    fingerprint: review.fingerprint.toLowerCase(),
    decision: review.decision,
    reviewer: review.reviewer.trim(),
    identityEvidence: review.identityEvidence.trim(),
    rightsEvidence: review.rightsEvidence.trim(),
    visualEvidence: review.visualEvidence.trim(),
    reviewedAt: review.reviewedAt,
  };
}

export function signImageReview(review, key) {
  if (!NONEMPTY(key) || Buffer.byteLength(key, 'utf8') < 32) throw new Error('image_review_requires_separate_credential');
  return createHmac('sha256', key).update(JSON.stringify(canonicalReview(review))).digest('hex');
}

// Authentication proves possession of the separate review credential, not truth of assertions.
// Consumer must still check this signature against its trusted store and authorization policy.
export function assessImageReview(item, imageSha256, receipt, key) {
  let fingerprint;
  try { fingerprint = imageReviewFingerprint(item, imageSha256); }
  catch { return { status: 'missing_image_evidence', publishAllowed: false }; }
  if (!receipt) return { status: 'awaiting_authenticated_review', publishAllowed: false, fingerprint };
  if (!NONEMPTY(key) || Buffer.byteLength(key, 'utf8') < 32)
    return { status: 'review_credential_unavailable', publishAllowed: false, fingerprint };
  try {
    const normalized = canonicalReview(receipt);
    if (normalized.fingerprint !== fingerprint)
      return { status: 'stale_image_or_variant_review', publishAllowed: false, fingerprint };
    if (typeof receipt.signature !== 'string' || !HEX.test(receipt.signature))
      return { status: 'unauthenticated_review', publishAllowed: false, fingerprint };
    const expected = Buffer.from(signImageReview(normalized, key), 'hex');
    if (!timingSafeEqual(expected, Buffer.from(receipt.signature, 'hex')))
      return { status: 'unauthenticated_review', publishAllowed: false, fingerprint };
    return { status: normalized.decision === 'approved' ? 'authenticated_review_recorded' : 'authenticated_rejection_recorded',
      publishAllowed: false, fingerprint, reviewId: normalized.reviewId };
  } catch {
    return { status: 'invalid_review_receipt', publishAllowed: false, fingerprint };
  }
}
