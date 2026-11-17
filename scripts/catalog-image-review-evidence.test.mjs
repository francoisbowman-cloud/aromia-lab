import test from 'node:test';
import assert from 'node:assert/strict';
import { imageReviewFingerprint, signImageReview, assessImageReview } from './catalog-image-review-evidence.mjs';

const item = {
  slug: 'chance-eau-tendre', catalogName: 'Chance Eau Tendre',
  catalogBrand: 'Chanel', declaredConcentration: 'EDT',
  imageUrl: 'https://example.org/verified-asset.png',
};
const digest = 'a'.repeat(64);
const key = 'isolated-test-review-credential-32-plus-bytes';
const review = fingerprint => ({
  reviewId: 'review-1', fingerprint,
  reviewer: 'Authorized visual editor', decision: 'approved',
  identityEvidence: 'Compared source packshot against manufacturer EDT page for exact flanker.',
  rightsEvidence: 'Licensing decision and source contract must be verified by editorial.',
  visualEvidence: 'Reviewed desktop/mobile crop and color accuracy with original bytes.',
  reviewedAt: '2026-11-17T21:00:00.000Z',
});

test('unsigned or absent evidence never produces verified approval or publication', () => {
  const fingerprint = imageReviewFingerprint(item, digest);
  assert.equal(fingerprint.length, 64);
  const absent = assessImageReview(item, digest, null, key);
  assert.equal(absent.status, 'awaiting_authenticated_review');
  assert.equal(absent.publishAllowed, false);
  const unsigned = assessImageReview(item, digest, review(fingerprint), key);
  assert.equal(unsigned.status, 'unauthenticated_review');
  assert.equal(unsigned.publishAllowed, false);
  assert.equal(assessImageReview(item, null, null, key).status, 'missing_image_evidence');
});

test('authenticated record is bound to exact product and image bytes', () => {
  const fingerprint = imageReviewFingerprint(item, digest);
  const receipt = review(fingerprint);
  receipt.signature = signImageReview(receipt, key);
  const valid = assessImageReview(item, digest, receipt, key);
  assert.equal(valid.status, 'authenticated_review_recorded');
  assert.equal(valid.publishAllowed, false);
  for (const altered of [
    { ...item, declaredConcentration: 'EDP' },
    { ...item, catalogBrand: 'Other brand' },
    { ...item, imageUrl: 'https://example.org/another.png' },
    { ...item, slug: 'other-product' },
  ]) {
    assert.equal(assessImageReview(altered, digest, receipt, key).status, 'stale_image_or_variant_review');
  }
  assert.equal(assessImageReview(item, 'b'.repeat(64), receipt, key).status, 'stale_image_or_variant_review');
  assert.equal(assessImageReview(item, digest, receipt, 'different-secret-that-is-at-least-32-bytes').status, 'unauthenticated_review');
});

test('tampering with review decision or provenance invalidates signature', () => {
  const receipt = review(imageReviewFingerprint(item, digest));
  receipt.signature = signImageReview(receipt, key);
  assert.equal(assessImageReview(item, digest, { ...receipt, decision: 'rejected' }, key).status, 'unauthenticated_review');
  assert.equal(assessImageReview(item, digest, { ...receipt, rightsEvidence: 'Changed rights note' }, key).status, 'unauthenticated_review');
  assert.equal(assessImageReview(item, digest, { ...receipt, reviewer: '' }, key).status, 'invalid_review_receipt');
  assert.equal(assessImageReview(item, digest, receipt, null).status, 'review_credential_unavailable');
});

test('rejections are recorded, never switched into approvals', () => {
  const receipt = { ...review(imageReviewFingerprint(item, digest)), decision: 'rejected' };
  receipt.signature = signImageReview(receipt, key);
  const outcome = assessImageReview(item, digest, receipt, key);
  assert.equal(outcome.status, 'authenticated_rejection_recorded');
  assert.equal(outcome.publishAllowed, false);
});

test('missing product identity or an invented URL hash cannot satisfy evidence gate', () => {
  assert.throws(() => imageReviewFingerprint({ ...item, imageUrl: '' }, digest), /missing_product_identity/);
  assert.throws(() => imageReviewFingerprint(item, 'https://example.org/foo.png'), /image_bytes_sha256/);
  assert.throws(() => signImageReview(review(imageReviewFingerprint(item, digest)), 'short'), /separate_credential/);
});
