import { randomUUID } from 'node:crypto';
import { Pool, PoolClient } from 'pg';
import { bundleOf } from './review';
import { retrieveSource } from './sources';
import { validateArtifact } from './artifacts';
import { validateBrief } from './policy';
export type Job = { id: string; token: string; payload: unknown; attempts: number; status: string };
export class JobStore {
  constructor(readonly db: Pool) {}
  private async tx<T>(fn: (c: PoolClient) => Promise<T>): Promise<T> {
    const c = await this.db.connect();
    try { await c.query('BEGIN'); const v = await fn(c); await c.query('COMMIT'); return v; }
    catch (e) { await c.query('ROLLBACK'); throw e; } finally { c.release(); }
  }
  private async event(c: PoolClient, id: string, event: string, details: unknown = {}) {
    await c.query('INSERT INTO intelligence_events(job_id,event,details) VALUES($1,$2,$3)', [id,event,JSON.stringify(details)]);
  }
  async enqueue(key: string, input: unknown, priority = 0) {
    if (typeof key !== 'string' || !/^[a-zA-Z0-9:_-]{1,160}$/.test(key) || !Number.isInteger(priority) || priority < 0 || priority > 10) throw new Error('invalid_request');
    const payload = validateBrief(input);
    return this.tx(async c => {
      const inserted = await c.query('INSERT INTO intelligence_jobs(id,dedupe_key,kind,payload,priority) VALUES($1,$2,$3,$4,$5) ON CONFLICT(dedupe_key) DO NOTHING RETURNING *', [randomUUID(),key,'editorial.prepare',JSON.stringify(payload),priority]);
      if (inserted.rowCount) { await this.event(c,inserted.rows[0].id,'queued'); return inserted.rows[0]; }
      const existing = await c.query('SELECT *, payload=$2::jsonb AS same_payload FROM intelligence_jobs WHERE dedupe_key=$1', [key,JSON.stringify(payload)]);
      if (!existing.rows[0].same_payload || existing.rows[0].priority !== priority) throw new Error('idempotency_conflict');
      return existing.rows[0];
    });
  }
  async claim(): Promise<Job | undefined> {
    return this.tx(async c => {
      // Locks and fencing tokens prevent concurrent workers/stale completion.
      const expired = await c.query("SELECT * FROM intelligence_jobs WHERE status='running' AND lease_until<=now() FOR UPDATE SKIP LOCKED");
      for (const j of expired.rows) {
        await c.query("UPDATE intelligence_jobs SET status=CASE WHEN attempts>=max_attempts THEN 'failed' ELSE 'queued' END,token=NULL,lease_until=NULL,updated_at=now() WHERE id=$1", [j.id]);
        await this.event(c,j.id,'lease_expired');
      }
      const r = await c.query("SELECT * FROM intelligence_jobs WHERE status='queued' AND available_at<=now() AND attempts<max_attempts ORDER BY priority DESC,created_at FOR UPDATE SKIP LOCKED LIMIT 1");
      if (!r.rowCount) return;
      const j = await c.query("UPDATE intelligence_jobs SET status='running',attempts=attempts+1,token=$2,lease_until=now()+interval '60 seconds',updated_at=now() WHERE id=$1 RETURNING *",[r.rows[0].id,randomUUID()]);
      await this.event(c,j.rows[0].id,'claimed',{attempt:j.rows[0].attempts}); return j.rows[0];
    });
  }
  async finish(job: Job, result: unknown, errorCode?: string) {
    return this.tx(async c => {
      const r = await c.query(`UPDATE intelligence_jobs SET status=CASE WHEN $4::text IS NULL THEN 'awaiting_review' WHEN attempts<max_attempts THEN 'queued' ELSE 'failed' END,
        result=$3,error_code=$4,available_at=now()+interval '10 seconds'*attempts,token=NULL,lease_until=NULL,updated_at=now()
        WHERE id=$1 AND token=$2 AND status='running' AND lease_until>now() RETURNING *`,[job.id,job.token,JSON.stringify(result),errorCode ?? null]);
      if (!r.rowCount) return false;
      await this.event(c,job.id,errorCode ? 'attempt_failed' : 'prepared',{errorCode:errorCode ?? null}); return true;
    });
  }
  async cancel(id: string) {
    return this.tx(async c => {
      const r = await c.query("UPDATE intelligence_jobs SET status='cancelled',token=NULL,lease_until=NULL,updated_at=now() WHERE id=$1 AND status IN ('queued','running','awaiting_review') RETURNING id",[id]);
      if (r.rowCount) await this.event(c,id,'cancelled'); return Boolean(r.rowCount);
    });
  }
  async retry(id: string) {
    return this.tx(async c => {
      const r = await c.query("UPDATE intelligence_jobs SET status='queued',attempts=0,available_at=now(),error_code=NULL,updated_at=now() WHERE id=$1 AND status='failed' RETURNING id",[id]);
      if (r.rowCount) await this.event(c,id,'manual_retry'); return Boolean(r.rowCount);
    });
  }
  async appendArtifact(id: string, input: unknown) {
    const a = validateArtifact(input);
    return this.tx(async c => {
      const job = (await c.query('SELECT payload,status FROM intelligence_jobs WHERE id=$1 FOR UPDATE',[id])).rows[0];
      if (!job) throw new Error('job_not_found');
      if (job.status !== 'awaiting_review') throw new Error('job_not_reviewable');
      const sources = validateBrief(job.payload).sources.map(s=>s.url);
      if (a.sourceUrls.some(url=>!sources.includes(url))) throw new Error('unknown_source');
      const latest = (await c.query('SELECT coalesce(max(version),0)::int AS version FROM intelligence_artifacts WHERE job_id=$1 AND kind=$2',[id,a.kind])).rows[0].version;
      if (latest !== a.expectedVersion) throw new Error('artifact_version_conflict');
      const result = await c.query('INSERT INTO intelligence_artifacts(job_id,kind,version,content,source_urls,actor) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',[id,a.kind,latest+1,a.content,JSON.stringify(a.sourceUrls),'admin']);
      await this.event(c,id,'artifact_added',{kind:a.kind,version:latest+1,publication:'blocked'});
      return result.rows[0];
    });
  }
  async artifacts(id: string) {
    return (await this.db.query('SELECT id,kind,version,content,source_urls,actor,created_at FROM intelligence_artifacts WHERE job_id=$1 ORDER BY id DESC LIMIT 100',[id])).rows;
  }
  async captureSource(id: string, url: string) {
    const job=await this.detail(id);
    if(!job || job.status!=='awaiting_review') throw new Error('job_not_reviewable');
    const source=validateBrief(job.payload).sources.find(s=>s.url===url);
    if(!source) throw new Error('unknown_source');
    let result;
    try {result=await retrieveSource(source.url,source.excerpt);}
    catch(error) {
      await this.tx(c=>this.event(c,id,'source_retrieval_failed',{url:source.url}));
      throw error;
    }
    return this.tx(async c=>{
      const current=(await c.query('SELECT status FROM intelligence_jobs WHERE id=$1 FOR UPDATE',[id])).rows[0];
      if(current.status!=='awaiting_review') throw new Error('job_not_reviewable');
      const r=await c.query('INSERT INTO intelligence_sources(job_id,url,sha256,content,excerpt_found) VALUES($1,$2,$3,$4,$5) ON CONFLICT(job_id,url,sha256) DO NOTHING RETURNING id',[id,url,result.sha256,result.content,result.excerptFound]);
      if(r.rowCount) await this.event(c,id,'source_captured',{url,sha256:result.sha256,excerptFound:result.excerptFound});
      return {url,sha256:result.sha256,excerptFound:result.excerptFound,factualApproval:false};
    });
  }
  private async bundle(c: PoolClient, id: string) {
    const artifacts=(await c.query('SELECT id,kind,version,content,source_urls FROM intelligence_artifacts WHERE job_id=$1 ORDER BY id',[id])).rows;
    const sources=(await c.query('SELECT id,url,sha256,excerpt_found FROM intelligence_sources WHERE job_id=$1 ORDER BY id',[id])).rows;
    return bundleOf(id,artifacts,sources);
  }
  async reviewPackage(id: string) {
    return this.tx(async c=>{
      const job=(await c.query('SELECT status FROM intelligence_jobs WHERE id=$1 FOR UPDATE',[id])).rows[0];
      if(!job) throw new Error('job_not_found');
      const bundle=await this.bundle(c,id);
      const last=(await c.query('SELECT bundle_hash,decision,note,actor,created_at FROM intelligence_reviews WHERE job_id=$1 ORDER BY id DESC LIMIT 1',[id])).rows[0];
      return {...bundle,status:job.status,review:last??null,reviewCurrent:Boolean(last && last.bundle_hash===bundle.hash)};
    });
  }
  async recordReview(id: string,input: unknown) {
    const r=input as {hash:string;decision:string;note:string;confirmed:boolean};
    if(!r || !/^[a-f0-9]{64}$/.test(r.hash) || !['approved','changes_requested'].includes(r.decision) || typeof r.note!=='string' || !r.note.trim() || r.note.length>5000 || r.confirmed!==true) throw new Error('invalid_review');
    return this.tx(async c=>{
      const job=(await c.query('SELECT status FROM intelligence_jobs WHERE id=$1 FOR UPDATE',[id])).rows[0];
      if(!job || job.status!=='awaiting_review') throw new Error('job_not_reviewable');
      const bundle=await this.bundle(c,id);
      if(bundle.hash!==r.hash) throw new Error('review_version_conflict');
      if(r.decision==='approved' && bundle.blockers.length) throw new Error('review_blocked');
      const saved=await c.query('INSERT INTO intelligence_reviews(job_id,bundle_hash,decision,note,actor) VALUES($1,$2,$3,$4,$5) RETURNING *',[id,r.hash,r.decision,r.note,'publisher_credential']);
      await this.event(c,id,'review_recorded',{hash:r.hash,decision:r.decision});
      return {...saved.rows[0],publication:'blocked'};
    });
  }
  async list() { return (await this.db.query('SELECT id,kind,status,priority,attempts,error_code,created_at,updated_at FROM intelligence_jobs ORDER BY created_at DESC LIMIT 100')).rows; }
  async detail(id: string) {
    const job = (await this.db.query('SELECT id,kind,payload,status,attempts,result,error_code,created_at,updated_at FROM intelligence_jobs WHERE id=$1',[id])).rows[0];
    if (!job) return null;
    return { ...job, events:(await this.db.query('SELECT event,details,created_at FROM intelligence_events WHERE job_id=$1 ORDER BY id',[id])).rows };
  }
}
