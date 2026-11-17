import { randomUUID } from 'node:crypto';
import { Pool, PoolClient } from 'pg';
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
  async list() { return (await this.db.query('SELECT id,kind,status,priority,attempts,error_code,created_at,updated_at FROM intelligence_jobs ORDER BY created_at DESC LIMIT 100')).rows; }
  async detail(id: string) {
    const job = (await this.db.query('SELECT id,kind,payload,status,attempts,result,error_code,created_at,updated_at FROM intelligence_jobs WHERE id=$1',[id])).rows[0];
    if (!job) return null;
    return { ...job, events:(await this.db.query('SELECT event,details,created_at FROM intelligence_events WHERE job_id=$1 ORDER BY id',[id])).rows };
  }
}
