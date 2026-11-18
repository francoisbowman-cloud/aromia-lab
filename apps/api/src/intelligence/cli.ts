import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { pool } from '../db/pool';
import { JobStore } from './store';
import { runOnce } from './worker';
import { parseBatchSize, runBoundedBatch } from './batch';
async function main() {
  const store = new JobStore(pool);
  const [command,arg,file] = process.argv.slice(2);
  switch(command) {
    case 'enqueue': return store.enqueue(arg,JSON.parse(readFileSync(file,'utf8')));
    case 'work': return { processed: await runOnce(store) };
    // Opt-in one-shot invocation by an external scheduler; no self-scheduling.
    case 'work-batch': {
      if (process.env.INTELLIGENCE_WORKER_ENABLED !== 'true') throw new Error('worker_not_enabled');
      return runBoundedBatch(store,parseBatchSize(arg));
    }
    case 'research': {
      const job=await store.detail(arg); if(!job) throw new Error('job_not_found');
      const results=[];
      const saved=await store.reviewPackage(arg);
      for(const source of job.payload.sources) {
        if(saved.sources.some(s=>s.url===source.url)) {results.push({url:source.url,status:'already_captured'});continue;}
        try {results.push(await store.captureSource(arg,source.url));} catch(error) {const reason=error instanceof Error && ['source_not_allowed','source_requires_pinned_repository','source_unavailable','source_content_type','source_too_large'].includes(error.message)?error.message:'retrieval_failed';results.push({url:source.url,status:'retrieval_failed',reason,factualApproval:false});}}
      return {results,package:await store.reviewPackage(arg)};
    }
    case 'capture-source': return store.captureSource(arg,file);
    case 'review-package': return store.reviewPackage(arg);
    case 'artifacts': return store.artifacts(arg);
    case 'append-artifact': return store.appendArtifact(arg,JSON.parse(readFileSync(file,'utf8')));
    case 'list': return store.list();
    case 'dashboard': { const jobs = await store.list(); console.table(jobs); return { displayed: jobs.length, limit: 100, publication: 'disabled', providers: 'disabled' }; }
    case 'detail': return store.detail(arg);
    case 'cancel': return { cancelled: await store.cancel(arg) };
    case 'retry': return { retried: await store.retry(arg) };
    default: throw new Error('Usage: intelligence enqueue KEY FILE | work | work-batch N (1..25, explicit opt-in) | list | detail/cancel/retry UUID');
  }
}
main().then(v=>console.log(JSON.stringify(v,null,2))).catch(()=>{console.error('Operation failed; check arguments, database and migration.');process.exitCode=1;}).finally(()=>pool.end());
