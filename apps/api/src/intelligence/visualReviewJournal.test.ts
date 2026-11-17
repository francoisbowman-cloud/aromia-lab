import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { Pool } from 'pg';
import { VisualReviewJournal, validateVisualReviewObservation } from './visualReviewJournal';

const input = {
  reviewId: 'review-001',
  productSlug: 'chance-eau-tendre',
  productFingerprint: 'a'.repeat(64),
  imageSha256: 'b'.repeat(64),
  operatorNote: 'Local evidence has not independently validated this packshot.',
  evidence: {
    identity: 'Claimed EDT identity; exact bottle requires independent review.',
    rights: 'Permission and source terms remain pending.',
    visual: 'Editor found crop pending assessment.',
  },
};
test('visual journal rejects missing, malformed and unverifiable observations', () => {
  assert.throws(() => validateVisualReviewObservation({...input, productSlug:'../../etc/passwd'}),/invalid_visual_review/);
  assert.throws(() => validateVisualReviewObservation({...input, imageSha256:'url-hash'}),/invalid_visual_review/);
  assert.throws(() => validateVisualReviewObservation({...input, evidence:{...input.evidence, rights:''}}),/invalid_visual_review/);
  assert.equal(validateVisualReviewObservation(input).reviewId,'review-001');
});

test('PostgreSQL opt-in visual review journal is append-only and never grants approval', async () => {
  const connectionString=process.env.INTELLIGENCE_TEST_DATABASE_URL;
  assert.ok(connectionString,'Set INTELLIGENCE_TEST_DATABASE_URL to a local *_test database');
  const url=new URL(connectionString);
  assert.ok(['localhost','127.0.0.1'].includes(url.hostname) && url.pathname.endsWith('_test'));
  const schema='visualreview_'+randomUUID().replaceAll('-','');
  const admin=new Pool({connectionString});
  await admin.query(`CREATE SCHEMA ${schema}`);
  const db=new Pool({connectionString, options:`-c search_path=${schema}`});
  try {
    await db.query(readFileSync('migrations/027_visual_review_journal.sql','utf8'));
    await db.query(readFileSync('migrations/027_visual_review_journal.sql','utf8'));
    const journal=new VisualReviewJournal(db);
    const added=await journal.append(input);
    assert.equal(added.status,'recorded_pending_independent_verification');
    assert.equal(added.publication,'blocked');
    assert.equal(added.identityVerified,false);
    assert.equal(added.rightsVerified,false);
    await assert.rejects(journal.append(input),/visual_review_id_conflict/);
    const changed={...input,reviewId:'review-002',imageSha256:'c'.repeat(64)};
    await journal.append(changed);
    const history=await journal.list(input.productSlug);
    assert.equal(history.reviews.length,2);
    assert.equal(history.reviews[0].review_id,'review-002');
    assert.equal(history.reviews[1].image_sha256,input.imageSha256);
    assert.equal(history.publication,'blocked');
    await assert.rejects(journal.list('../invalid'),/invalid_visual_review_slug/);
    // No in-place update is exposed by the journal API; rollback must refuse evidence loss.
    await assert.rejects(db.query(readFileSync('migrations/down/027_visual_review_journal.sql','utf8')),/archive and obtain explicit authorization/i);
    assert.equal((await journal.list(input.productSlug)).reviews.length,2);
  } finally {
    await db.end();
    await admin.query(`DROP SCHEMA ${schema} CASCADE`);
    await admin.end();
  }
});
