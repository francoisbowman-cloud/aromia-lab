import test from 'node:test';
import assert from 'node:assert/strict';
import { retrieveSource,sourceUrl } from './sources';
test('source retrieval rejects arbitrary/internal targets and mutable repository refs',()=>{
 for(const url of ['http://en.wikipedia.org','https://127.0.0.1','https://en.wikipedia.org.evil.test','https://user:secret@en.wikipedia.org','https://en.wikipedia.org:8443','https://raw.githubusercontent.com/francoisbowman-cloud/aromia-lab/main/file']) assert.throws(()=>sourceUrl(url));
});
test('capture hashes actual bytes, labels literal excerpt match, rejects oversized or non-text',async()=>{
 const mock=(body:string,type='text/plain')=>async(_u:unknown,init?:RequestInit)=>{assert.equal(init?.redirect,'error');return new Response(body,{headers:{'content-type':type}});};
 const captured=await retrieveSource('https://en.wikipedia.org/wiki/Olfaction','source text',mock('source text') as typeof fetch);
 assert.equal(captured.excerptFound,true);assert.equal(captured.sha256.length,64);
 assert.equal((await retrieveSource(captured.url,'missing',mock('source text') as typeof fetch)).excerptFound,false);
 await assert.rejects(retrieveSource(captured.url,'x',mock('x','application/pdf') as typeof fetch),/source_content_type/);
 await assert.rejects(retrieveSource(captured.url,'x',mock('x'.repeat(1048577)) as typeof fetch),/source_too_large/);
});
