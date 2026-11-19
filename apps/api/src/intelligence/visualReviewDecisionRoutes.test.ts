import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
test('visual decisions require admin authentication, opt-in and separate Publisher credential',async()=>{
  const express=(await import('express')).default;
  const {adminAuth}=await import('../middleware/adminAuth');
  const {intelligenceRouter}=await import('../routes/admin/intelligence');
  const keys=['ADMIN_API_TOKEN','EDITORIAL_REVIEW_TOKEN','INTELLIGENCE_ENABLED','VISUAL_REVIEW_JOURNAL_ENABLED'] as const;
  const original=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
  const token=randomUUID(),publisher=randomUUID();
  process.env.ADMIN_API_TOKEN=token;
  process.env.EDITORIAL_REVIEW_TOKEN=publisher;
  process.env.INTELLIGENCE_ENABLED='true';
  delete process.env.VISUAL_REVIEW_JOURNAL_ENABLED;
  const app=express();app.use(express.json());app.use('/ops',adminAuth,intelligenceRouter);
  const server=app.listen(0,'127.0.0.1');
  await new Promise<void>(resolve=>server.once('listening',resolve));
  const port=(server.address() as {port:number}).port;
  const url=`http://127.0.0.1:${port}/ops/visual-decisions`;
  try{
    assert.equal((await fetch(url,{method:'POST'})).status,401);
    const auth={authorization:`Bearer ${token}`};
    assert.equal((await fetch(url,{method:'POST',headers:auth})).status,503);
    process.env.VISUAL_REVIEW_JOURNAL_ENABLED='true';
    assert.equal((await fetch(url,{method:'POST',headers:auth})).status,403);
    assert.equal((await fetch(url,{method:'POST',headers:{...auth,'x-editorial-review-token':'fake'}})).status,403);
    assert.equal((await fetch(url+'/0',{headers:auth})).status,400);
    assert.equal((await fetch(url,{method:'POST',headers:{...auth,'x-editorial-review-token':publisher,
      'Content-Type':'application/json'},body:JSON.stringify({decision:'approved'})})).status,400);
  }finally{
    server.closeAllConnections();
    await new Promise<void>(resolve=>server.close(()=>resolve()));
    for(const key of keys){if(original[key]===undefined)delete process.env[key];else process.env[key]=original[key];}
  }
});
