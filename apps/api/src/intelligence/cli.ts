import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { pool } from '../db/pool';
import { JobStore } from './store';
import { runOnce } from './worker';
import { parseBatchSize, requireBatchWorkerEnabled, classifyBatchFailure } from './batch';
import { parseIntervalMinutes, parseRetentionDays, pruneRunLedger, readIntelligenceHealth, runLedgeredBatch } from './healthSource';
async function main() {
  const store = new JobStore(pool);
  const [command,arg,file] = process.argv.slice(2);
  switch(command) {
    case 'enqueue': return store.enqueue(arg,JSON.parse(readFileSync(file,'utf8')));
    case 'work': {
      // Preserve local one-job tooling, but fail closed in production unless
      // the same operational and Publisher approval gates are present.
      if (process.env.NODE_ENV === 'production') requireBatchWorkerEnabled(process.env);
      return { processed: await runOnce(store) };
    }
    // Opt-in one-shot invocation by an external scheduler; no self-scheduling.
    case 'work-batch': {
      requireBatchWorkerEnabled(process.env);
      return runLedgeredBatch(pool,store,parseBatchSize(arg));
    }
    // Read-only diagnostic for an external monitor. The interval is the operator's
    // declared scheduler cadence; there is deliberately no default. Exit code 2 = critical.
    case 'health': {
      if (process.env.INTELLIGENCE_ENABLED !== 'true') throw new Error('worker_not_enabled');
      if (process.env.NODE_ENV === 'production') requireBatchWorkerEnabled({...process.env,INTELLIGENCE_WORKER_ENABLED:'true'});
      const report = await readIntelligenceHealth(pool,parseIntervalMinutes(arg));
      if (report.status === 'critical') process.exitCode = 2;
      return report;
    }
    // Operational ledger retention only; never touches jobs, artifacts or reviews.
    case 'prune-runs': {
      requireBatchWorkerEnabled(process.env);
      return pruneRunLedger(pool,parseRetentionDays(arg));
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
    default: throw new Error('Usage: intelligence enqueue KEY FILE | work | work-batch N (1..25, explicit opt-in) | health INTERVAL_MINUTES | prune-runs KEEP_DAYS | list | detail/cancel/retry UUID');
  }
}
main().then(v=>console.log(JSON.stringify(v,null,2))).catch(error=>{
  console.error(JSON.stringify({ status: 'failed', code: classifyBatchFailure(error), publication: 'blocked' }));
  process.exitCode=1;
}).finally(()=>pool.end());
