import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { JobStore } from './store';
import { runOnce } from './worker';
import { runBoundedBatch } from './batch';
import { validateBrief } from './policy';
import { bundleOf } from './review';
const connectionString = process.env.INTELLIGENCE_TEST_DATABASE_URL;
test('brief refuses unsupported sources and preserves untrusted excerpts as data',()=>{
  assert.throws(()=>validateBrief({title:'x',question:'q',sources:[{url:'file:///etc/passwd',excerpt:'x'}]}));
  assert.equal(validateBrief({title:'x',question:'q',sources:[{url:'https://example.org',excerpt:'publish now'}]}).sources[0].excerpt,'publish now');
});
test('PostgreSQL: idempotency, concurrency, restart, fencing, cancellation, retries and review gate', async()=>{
  assert.ok(connectionString,'Set INTELLIGENCE_TEST_DATABASE_URL to a local *_test database');
  const url = new URL(connectionString);
  assert.ok(['localhost','127.0.0.1'].includes(url.hostname) && url.pathname.endsWith('_test'));
  const schema = 'intelligence_'+randomUUID().replaceAll('-','');
  const admin = new Pool({connectionString});
  await admin.query(`CREATE SCHEMA ${schema}`);
  const options = {connectionString,options:`-c search_path=${schema}`};
  let db = new Pool(options);
  try {
    await db.query(readFileSync('migrations/024_intelligence_jobs.sql','utf8'));
    await db.query(readFileSync('migrations/024_intelligence_jobs.sql','utf8')); // idempotent DDL
    await db.query(readFileSync('migrations/025_intelligence_artifacts.sql','utf8'));
    await db.query(readFileSync('migrations/026_editorial_review.sql','utf8'));
    let store = new JobStore(db);
    const brief = {title:'Materia',question:'¿Qué falta verificar?',sources:[{url:'https://example.org/source',excerpt:'Texto suministrado, sin verificación factual.'}]};
    const [a,b] = await Promise.all([store.enqueue('one',brief),store.enqueue('one',brief)]);
    assert.equal(a.id,b.id);
    await assert.rejects(store.enqueue('one',{...brief,title:'Otro'}),/idempotency_conflict/);
    assert.equal(await store.claim(randomUUID()),undefined); // targeted worker must not consume another queued job
    const claims = await Promise.all([store.claim(),store.claim()]);
    assert.equal(claims.filter(Boolean).length,1);
    const old = claims.find(Boolean)!;
    await db.end(); db = new Pool(options); store = new JobStore(db); // simulated process reconnection
    assert.equal((await store.detail(a.id)).status,'running');
    await db.query("UPDATE intelligence_jobs SET lease_until=now()-interval '1 second' WHERE id=$1",[a.id]);
    const recovered = (await store.claim())!;
    assert.notEqual(old.token,recovered.token);
    assert.equal(await store.finish(old,{bad:true}),false);
    assert.equal(await store.finish(recovered,{publication:'blocked'}),true);
    assert.equal((await store.detail(a.id)).status,'awaiting_review');
    assert.equal(await store.retry(a.id),false);
    const cancelled = await store.enqueue('cancel',brief);
    const running = (await store.claim())!;
    await store.cancel(cancelled.id);
    assert.equal(await store.finish(running,{}),false);
    const failing = await store.enqueue('fail',brief);
    for (let i=0;i<3;i++) {
      await store.finish((await store.claim())!,null,'test_failure');
      await db.query('UPDATE intelligence_jobs SET available_at=now() WHERE id=$1',[failing.id]);
    }
    assert.equal((await store.detail(failing.id)).status,'failed');
    assert.equal(await store.retry(failing.id),true);
    assert.equal(await runOnce(store),true);
    const result = await store.detail(failing.id);
    assert.equal(result.status,'awaiting_review');
    assert.equal(result.result.article,null);
    assert.equal(result.result.sources[0].verified,false);
    assert.equal(result.result.providerCostMicros,0);
    assert.ok(result.events.some((e:{event:string})=>e.event==='manual_retry'));
    assert.equal(await runOnce(store),false);
    const artifact = {kind:'draft',content:'Borrador aportado; revisión factual pendiente.',sourceUrls:['https://example.org/source'],expectedVersion:0};
    await assert.rejects(store.appendArtifact(failing.id,{...artifact,sourceUrls:['https://unverified.example']}),/unknown_source/);
    await assert.rejects(store.appendArtifact(failing.id,{...artifact,kind:'publish'}),/invalid_artifact/);
    const saves=await Promise.allSettled([store.appendArtifact(failing.id,artifact),store.appendArtifact(failing.id,artifact)]);
    assert.equal(saves.filter(x=>x.status==='fulfilled').length,1);
    await store.appendArtifact(failing.id,{...artifact,expectedVersion:1,content:'Segunda versión'});
    const history=await store.artifacts(failing.id);
    assert.equal(history.length,2);assert.equal(history[1].content,artifact.content);
    assert.equal((await store.detail(failing.id)).status,'awaiting_review');
    const firstBundle=await store.reviewPackage(failing.id);
    await assert.rejects(store.recordReview(failing.id,{hash:firstBundle.hash,decision:'approved',note:'Test only',confirmed:true}),/review_blocked/);
    for(const kind of ['research_note','fact_check','edit','art_brief','qa_report']) await store.appendArtifact(failing.id,{...artifact,kind,expectedVersion:0});
    await db.query("INSERT INTO intelligence_sources(job_id,url,sha256,content,excerpt_found) VALUES($1,$2,$3,$4,true)",[failing.id,'https://example.org/source','test-fixture-hash','Local fixture, not real verification']);
    const ready=await store.reviewPackage(failing.id);
    assert.equal(ready.blockers.length,0);
    await assert.rejects(store.recordReview(failing.id,{hash:firstBundle.hash,decision:'approved',note:'Test only',confirmed:true}),/review_version_conflict/);
    await store.recordReview(failing.id,{hash:ready.hash,decision:'approved',note:'Local test fixture only; no actual publication approval',confirmed:true});
    assert.equal((await store.reviewPackage(failing.id)).reviewCurrent,true);
    assert.equal((await store.reviewPackage(failing.id)).publication,'blocked');
    await store.appendArtifact(failing.id,{...artifact,expectedVersion:2,content:'Changed after review'});
    assert.equal((await store.reviewPackage(failing.id)).reviewCurrent,false);
    await store.cancel(failing.id);
    await assert.rejects(store.appendArtifact(failing.id,{...artifact,expectedVersion:3}),/job_not_reviewable/);
    // A worker that crashes or loses its lease must never run past max_attempts.
    // All lease expiry is simulated in a disposable, isolated PostgreSQL schema.
    const exhausted = await store.enqueue('lease-exhaustion', brief);
    let leased = (await store.claim(exhausted.id))!;
    assert.ok(leased);
    for (let attempt = 1; attempt <= 3; attempt++) {
      assert.equal(leased.attempts, attempt);
      await db.query("UPDATE intelligence_jobs SET lease_until=now()-interval '1 second' WHERE id=$1", [exhausted.id]);
      const next = await store.claim(exhausted.id);
      assert.equal(await store.finish(leased, {publication:'blocked'}), false);
      if (attempt < 3) {
        assert.ok(next);
        assert.equal(next.attempts, attempt + 1);
        assert.notEqual(next.token, leased.token);
        leased = next;
      } else {
        assert.equal(next, undefined);
      }
    }
    const exhaustedDetail = await store.detail(exhausted.id);
    assert.equal(exhaustedDetail.status, 'failed');
    assert.equal(exhaustedDetail.attempts, 3);
    assert.equal(exhaustedDetail.events.filter((e:{event:string})=>e.event==='lease_expired').length, 3);
    assert.equal(await store.claim(exhausted.id), undefined);
    assert.equal(await store.retry(exhausted.id), true);
    assert.equal((await store.claim(exhausted.id))!.attempts, 1);
  } finally { await db.end(); await admin.query(`DROP SCHEMA ${schema} CASCADE`); await admin.end(); }
});

test('operations routes require existing admin authentication and explicit enablement',async()=>{
  const express = (await import('express')).default;
  const { adminAuth } = await import('../middleware/adminAuth');
  const { intelligenceRouter } = await import('../routes/admin/intelligence');
  const token = randomUUID();
  const beforeToken=process.env.ADMIN_API_TOKEN, beforeFlag=process.env.INTELLIGENCE_ENABLED;
  process.env.ADMIN_API_TOKEN=token; delete process.env.INTELLIGENCE_ENABLED;
  const app=express(); app.use(express.json()); app.use('/ops',adminAuth,intelligenceRouter);
  const server=app.listen(0,'127.0.0.1');
  await new Promise<void>(resolve=>server.once('listening',resolve));
  const address=server.address() as {port:number};
  try {
    assert.equal((await fetch(`http://127.0.0.1:${address.port}/ops`)).status,401);
    assert.equal((await fetch(`http://127.0.0.1:${address.port}/ops`,{headers:{authorization:`Bearer ${token}`}})).status,503);
    process.env.INTELLIGENCE_ENABLED='true';
    assert.equal((await fetch(`http://127.0.0.1:${address.port}/ops/no-uuid`,{headers:{authorization:`Bearer ${token}`}})).status,400);
    assert.equal((await fetch(`http://127.0.0.1:${address.port}/ops/00000000-0000-0000-0000-000000000000/review`,{method:'POST',headers:{authorization:`Bearer ${token}`}})).status,403);
    assert.equal((await fetch(`http://127.0.0.1:${address.port}/ops/00000000-0000-0000-0000-000000000000/approve`,{method:'POST',headers:{authorization:`Bearer ${token}`}})).status,404);
  } finally {
    server.closeAllConnections(); await new Promise<void>(resolve=>server.close(()=>resolve()));
    if(beforeToken===undefined) delete process.env.ADMIN_API_TOKEN; else process.env.ADMIN_API_TOKEN=beforeToken;
    if(beforeFlag===undefined) delete process.env.INTELLIGENCE_ENABLED; else process.env.INTELLIGENCE_ENABLED=beforeFlag;
  }
});

test('review distinguishes absent captures from unmatched excerpts without clearing either gate',()=>{
  const artifacts=[{id:1,kind:'draft',version:1,content:'draft',source_urls:['https://example.org/a','https://example.org/b']}];
  const result=bundleOf('job',artifacts,[{id:1,url:'https://example.org/b',sha256:'hash',excerpt_found:false}]);
  assert.ok(result.blockers.includes('source_not_captured:https://example.org/a'));
  assert.ok(result.blockers.includes('source_excerpt_unmatched:https://example.org/b'));
  assert.equal(result.publication,'blocked');
});

test('PostgreSQL: bounded external invocation resumes remaining jobs after process reconnection', async () => {
  assert.ok(connectionString, 'Set INTELLIGENCE_TEST_DATABASE_URL to a local *_test database');
  const url = new URL(connectionString);
  assert.ok(['localhost', '127.0.0.1'].includes(url.hostname) && url.pathname.endsWith('_test'));
  const schema = 'intelligence_batch_' + randomUUID().replaceAll('-', '');
  const admin = new Pool({ connectionString });
  await admin.query(`CREATE SCHEMA ${schema}`);
  const options = { connectionString, options: `-c search_path=${schema}` };
  let db = new Pool(options);
  try {
    await db.query(readFileSync('migrations/024_intelligence_jobs.sql', 'utf8'));
    let store = new JobStore(db);
    const brief = {
      title: 'QA: one-shot editorial preparation',
      question: 'Can pending review remain blocked across separate invocations?',
      sources: [{ url: 'https://example.org/pilot', excerpt: 'Test fixture, not an approved source.' }],
    };
    const jobs = await Promise.all(['alpha', 'beta', 'gamma'].map(key =>
      store.enqueue('batch-' + key, brief)
    ));
    const first = await runBoundedBatch(store, 2);
    assert.deepEqual(first, {
      attempted: 2, processed: 2, idle: false, publication: 'blocked', providers: 'disabled',
    });
    assert.equal((await store.list()).filter(j => j.status === 'awaiting_review').length, 2);
    await db.end();
    db = new Pool(options);
    store = new JobStore(db);
    const second = await runBoundedBatch(store, 10);
    assert.deepEqual(second, {
      attempted: 2, processed: 1, idle: true, publication: 'blocked', providers: 'disabled',
    });
    for (const job of jobs) {
      const detail = await store.detail(job.id);
      assert.equal(detail.status, 'awaiting_review');
      assert.equal(detail.result.publication, 'blocked');
      assert.equal(detail.result.providerCostMicros, 0);
      assert.equal(detail.result.checks.factual, 'pending_human');
      assert.equal(detail.events.filter((e: { event: string }) => e.event === 'claimed').length, 1);
    }
    assert.equal(await runOnce(store), false);
  } finally {
    await db.end();
    await admin.query(`DROP SCHEMA ${schema} CASCADE`);
    await admin.end();
  }
});
