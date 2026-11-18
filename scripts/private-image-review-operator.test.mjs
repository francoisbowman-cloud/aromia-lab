import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkPrivateImageReviews } from './private-image-review-operator.mjs';
import { imageReviewFingerprint, signImageReview } from './catalog-image-review-evidence.mjs';

const key = 'separate-offline-review-test-key-with-enough-entropy';
function fixture(run) {
  const root = mkdtempSync(join(tmpdir(), 'aromia-private-image-review-'));
  try {
    const dest=join(root,'apps/web/public/assets');
    mkdirSync(dest,{recursive:true});
    const bytes=Buffer.from('fixture image bytes');
    writeFileSync(join(dest,'bottle.webp'),bytes);
    const item={slug:'sample-edt',catalogName:'Sample Eau de Toilette',catalogBrand:'Sample',
      declaredConcentration:'EDT',imageUrl:'/assets/bottle.webp'};
    const sha=createHash('sha256').update(bytes).digest('hex');
    return run({root,item,sha});
  } finally {rmSync(root,{recursive:true,force:true});}
}
function signed(item,sha,decision='approved') {
  const receipt={reviewId:'review-sample-1',fingerprint:imageReviewFingerprint(item,sha),
    decision,reviewer:'private operator test',identityEvidence:'manufacturer variant matched',
    rightsEvidence:'rights evidence reviewed',visualEvidence:'manual crop review',
    reviewedAt:'2026-11-17T21:45:00.000Z'};
  return {...receipt,signature:signImageReview(receipt,key)};
}
test('private operator binds local image bytes and retains no publication permission',()=>fixture(({root,item,sha})=>{
  const result=checkPrivateImageReviews([item],[{slug:item.slug,receipt:signed(item,sha)}],root,key);
  assert.equal(result.totals.authenticated,1);
  assert.equal(result.checks[0].status,'authenticated_review_recorded');
  assert.equal(result.checks[0].publishAllowed,false);
  assert.equal(result.publication,'blocked');
  assert.equal(JSON.stringify(result).includes(key),false);
  assert.equal(JSON.stringify(result).includes('rights evidence reviewed'),false);
}));
test('editing image bytes invalidates prior evidence; missing, rejected and absent also blocked',()=>fixture(({root,item,sha})=>{
  const first=signed(item,sha);
  writeFileSync(join(root,'apps/web/public/assets/bottle.webp'),Buffer.from('changed'));
  assert.equal(checkPrivateImageReviews([item],[{slug:item.slug,receipt:first}],root,key).checks[0].status,'stale_image_or_variant_review');
  const rejected=signed(item,createHash('sha256').update(Buffer.from('changed')).digest('hex'),'rejected');
  assert.equal(checkPrivateImageReviews([item],[{slug:item.slug,receipt:rejected}],root,key).checks[0].status,'authenticated_rejection_recorded');
  assert.equal(checkPrivateImageReviews([item],[],root,key).checks[0].status,'awaiting_authenticated_review');
  assert.equal(checkPrivateImageReviews([{...item,imageUrl:'/assets/missing.webp'}],[],root,key).checks[0].status,'local_image_missing_or_unreadable');
}));
test('remote URLs and unsupported local paths never imply approval or download',()=>fixture(({root,item,sha})=>{
  const remote={...item,imageUrl:'https://m.media-amazon.com/images/packshot.jpg'};
  const result=checkPrivateImageReviews([remote],[{slug:item.slug,receipt:signed(item,sha)}],root,key);
  assert.equal(result.checks[0].status,'remote_or_unsupported_image_requires_capture');
  assert.equal(result.totals.authenticated,0);
  assert.equal(checkPrivateImageReviews([{...item,imageUrl:'/../../etc/passwd'}],[],root,key).checks[0].status,'remote_or_unsupported_image_requires_capture');
}));
test('duplicate or orphan receipts never masquerade as review',()=>fixture(({root,item,sha})=>{
  const r={slug:item.slug,receipt:signed(item,sha)};
  assert.throws(()=>checkPrivateImageReviews([item],[r,r],root,key),/invalid_or_duplicate_private_review/);
  assert.throws(()=>checkPrivateImageReviews([item],[{slug:'other',receipt:r.receipt}],root,key),/unknown_catalog_product/);
  assert.throws(()=>checkPrivateImageReviews([item,item],[],root,key),/duplicate_catalog_slug/);
}));
