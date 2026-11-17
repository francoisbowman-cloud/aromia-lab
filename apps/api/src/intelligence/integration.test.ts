import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { JobStore } from './store';
import { runOnce } from './worker';
import { validateBrief } from './policy';
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
    let store = new JobStore(db);
    const brief = {title:'Materia',question:'¿Qué falta verificar?',sources:[{url:'https://example.org/source',excerpt:'Texto suministrado, sin verificación factual.'}]};
    const [a,b] = await Promise.all([store.enqueue('one',brief),store.enqueue('one',brief)]);
    assert.equal(a.id,b.id);
    await assert.rejects(store.enqueue('one',{...brief,title:'Otro'}),/idempotency_conflict/);
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
    assert.equal((await fetch(`http://127.0.0.1:${address.port}/ops/00000000-0000-0000-0000-000000000000/approve`,{method:'POST',headers:{authorization:`Bearer ${token}`}})).status,404);
  } finally {
    server.closeAllConnections(); await new Promise<void>(resolve=>server.close(()=>resolve()));
    if(beforeToken===undefined) delete process.env.ADMIN_API_TOKEN; else process.env.ADMIN_API_TOKEN=beforeToken;
    if(beforeFlag===undefined) delete process.env.INTELLIGENCE_ENABLED; else process.env.INTELLIGENCE_ENABLED=beforeFlag;
  }
});
