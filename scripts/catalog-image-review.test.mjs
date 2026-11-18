import test from 'node:test';
import assert from 'node:assert/strict';
import { auditImages } from './image-quality-monitor.mjs';
import { buildImageReviewQueue, summarizeImageReviewQueue } from './catalog-image-review.mjs';

test('all catalog rows require actual visual, identity and rights review, even with a photo URL', () => {
  const rows = [
    { slug: 'declared-edp', nombre: 'Sample EDP', marca: 'Sample house', imagen_url: 'https://example.org/photo.jpg' },
    { slug: 'missing', nombre: 'Sample EDT', imagen_url: '' },
  ];
  const queue = buildImageReviewQueue(rows, auditImages(rows));
  assert.deepEqual(queue.map(x => x.slug), ['declared-edp', 'missing']);
  assert.equal(queue[0].priority, 'standard');
  assert.equal(queue[0].identity, 'unverified');
  assert.equal(queue[0].imageRights, 'unverified');
  assert.equal(queue[0].visualQuality, 'unverified');
  assert.equal(queue[0].decision, 'manual_review_required');
  assert.deepEqual(queue[1].signals, ['missing_image']);
  assert.equal(queue[1].priority, 'high');
  assert.deepEqual(summarizeImageReviewQueue(queue), {
    total: 2, high: 1, medium: 0, standard: 1,
    identityVerified: 0, rightsVerified: 0, visuallyApproved: 0,
  });
});

test('shared packshots produce a review item for each affected perfume', () => {
  const rows = [
    { slug: 'z', nombre: 'A EDT', imagen_url: 'https://example.org/shared.jpg' },
    { slug: 'a', nombre: 'B EDP', imagen_url: 'https://example.org/shared.jpg' },
  ];
  const queue = buildImageReviewQueue(rows, auditImages(rows));
  assert.deepEqual(queue.map(x => x.slug), ['a', 'z']);
  assert.ok(queue.every(x => x.signals.includes('shared_image_requires_review')));
  assert.ok(queue.every(x => x.priority === 'medium'));
  assert.deepEqual(buildImageReviewQueue([...rows].reverse(), auditImages(rows)), queue);
});

test('explicit concentration conflicts are prioritized but not treated as visual evidence', () => {
  const rows = [{ slug: 'wrong', nombre: 'Product EDT', concentracion: 'EDP', imagen_url: 'https://example.org/edp.jpg' }];
  const [item] = buildImageReviewQueue(rows, auditImages(rows));
  assert.equal(item.priority, 'high');
  assert.equal(item.identity, 'unverified');
  assert.deepEqual(item.signals, ['declared_concentration_conflict_requires_review']);
  assert.equal(item.declaredConcentration, 'EDP');
});

test('a catalog row without a stable slug cannot silently disappear from review', () => {
  assert.throws(() => buildImageReviewQueue([{ nombre: 'No slug', imagen_url: 'x' }], []), /requires slug/);
});
