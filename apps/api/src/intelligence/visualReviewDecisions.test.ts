import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {Pool} from 'pg';
import {validateVisualDecision,VisualReviewDecisions} from './visualReviewDecisions';
const input={decisionKey:'decision-001',observationId:1,
  decision:'changes_requested',reason:'Request exact EDT packaging and image license evidence.'};
test('only non-approval decisions are accepted',()=>{
  assert.equal(validateVisualDecision(input).decision,'changes_requested');
  assert.throws(()=>validateVisualDecision({...input,decision:'approved'}),/invalid_visual_decision/);
  assert.throws(()=>validateVisualDecision({...input,reason:'ok'}),/invalid_visual_decision/);
  assert.throws(()=>validateVisualDecision({...input,observationId:-1}),/invalid_visual_decision/);
  assert.throws(()=>validateVisualDecision({...input,decisionKey:'../escape'}),/invalid_visual_decision/);
});
test('PostgreSQL decisions are append-only and scoped to real observations',async()=>{
  const connectionString=process.env.INTELLIGENCE_TEST_DATABASE_URL;
  assert.ok(connectionString,'Set INTELLIGENCE_TEST_DATABASE_URL to a local *_test database');
  const url=new URL(connectionString);
  assert.ok(['localhost','127.0.0.1'].includes(url.hostname)&&url.pathname.endsWith('_test'));
  const schema='visualdecision_'+randomUUID().replaceAll('-','');
  const admin=new Pool({connectionString});
  await admin.query(`CREATE SCHEMA ${schema}`);
  const db=new Pool({connectionString,options:`-c search_path=${schema}`});
  try{
    await db.query(readFileSync('migrations/027_visual_review_journal.sql','utf8'));
    await db.query(readFileSync('migrations/028_visual_review_decisions.sql','utf8'));
    await db.query(readFileSync('migrations/028_visual_review_decisions.sql','utf8'));
    const rows=await db.query(`INSERT INTO intelligence_visual_reviews
      (product_slug,product_fingerprint,image_sha256,review_id,operator_note,evidence)
      VALUES($1,$2,$3,$4,$5,$6::jsonb) RETURNING id`,[
        'chance-eau-tendre','a'.repeat(64),'b'.repeat(64),'review-parent',
        'Source not yet independently verified',
        JSON.stringify({identity:'pending',rights:'pending',visual:'pending'})
      ]);
    const observationId=Number(rows.rows[0].id);
    const journal=new VisualReviewDecisions(db);
    const created=await journal.append({...input,observationId});
    assert.equal(created.approval,false);
    assert.equal(created.publication,'blocked');
    assert.equal(created.applied,false);
    await assert.rejects(journal.append({...input,observationId}),/visual_decision_conflict/);
    await assert.rejects(journal.append({...input,decisionKey:'other',observationId:observationId+999}),/visual_observation_not_found/);
    const second=await journal.append({...input,decisionKey:'decision-002',decision:'rejected',observationId});
    assert.equal(second.decision,'rejected');
    const listed=await journal.list(observationId);
    assert.equal(listed.decisions.length,2);
    assert.equal(listed.decisions[0].decision,'rejected');
    assert.equal(listed.decisions[1].decision,'changes_requested');
    assert.equal(listed.publication,'blocked');
    await assert.rejects(db.query(readFileSync('migrations/down/028_visual_review_decisions.sql','utf8')),/archival and authorization required/i);
    assert.equal((await journal.list(observationId)).decisions.length,2);
  }finally{await db.end();await admin.query(`DROP SCHEMA ${schema} CASCADE`);await admin.end();}
});
