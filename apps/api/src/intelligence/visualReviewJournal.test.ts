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

test('private visual-review routes require existing admin auth and explicit opt-in', async()=>{
  const express=(await import('express')).default;
  const {adminAuth}=await import('../middleware/adminAuth');
  const {intelligenceRouter}=await import('../routes/admin/intelligence');
  const keys=['ADMIN_API_TOKEN','EDITORIAL_REVIEW_TOKEN','INTELLIGENCE_ENABLED','VISUAL_REVIEW_JOURNAL_ENABLED'] as const;
  const saved=Object.fromEntries(keys.map(key=>[key,process.env[key]]));
  process.env.ADMIN_API_TOKEN='visual-review-test-admin-token';
  process.env.EDITORIAL_REVIEW_TOKEN='visual-review-test-editorial-token';
  process.env.INTELLIGENCE_ENABLED='true';
  delete process.env.VISUAL_REVIEW_JOURNAL_ENABLED;
  const app=express();app.use(express.json());app.use('/ops',adminAuth,intelligenceRouter);
  const server=app.listen(0,'127.0.0.1');
  await new Promise<void>(resolve=>server.once('listening',resolve));
  const address=server.address() as {port:number};
  const url=`http://127.0.0.1:${address.port}/ops/visual-reviews`;
  try {
    assert.equal((await fetch(url+'?slug=chance-eau-tendre')).status,401);
    const auth={authorization:'Bearer visual-review-test-admin-token'};
    assert.equal((await fetch(url+'?slug=chance-eau-tendre',{headers:auth})).status,503);
    process.env.VISUAL_REVIEW_JOURNAL_ENABLED='true';
    assert.equal((await fetch(url,{method:'POST',headers:auth})).status,403);
    assert.equal((await fetch(url,{method:'POST',headers:{
      ...auth,'x-editorial-review-token':'wrong-credential'
    }})).status,403);
    // Invalid slugs are rejected before any database query.
    assert.equal((await fetch(url+'?slug=..%2Fsecret',{headers:auth})).status,400);
    assert.equal((await fetch(url+'?slug=chance-eau-tendre',{headers:{}})).status,401);
  } finally {
    server.closeAllConnections();
    await new Promise<void>(resolve=>server.close(()=>resolve()));
    for(const key of keys){if(saved[key]===undefined)delete process.env[key];else process.env[key]=saved[key];}
  }
});
