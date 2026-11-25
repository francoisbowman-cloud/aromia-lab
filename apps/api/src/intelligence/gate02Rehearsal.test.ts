import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { Pool } from 'pg';
import { JobStore } from './store';
import { parseRetentionDays, pruneRunLedger } from './healthSource';

// Local rehearsal of the Gate 02 operational procedure on a disposable database.
// It proves behaviour of the code paths; it is NOT a runtime-authorized certification run.
const connectionString = process.env.INTELLIGENCE_TEST_DATABASE_URL;
const ALL = ['024_intelligence_jobs', '025_intelligence_artifacts', '026_editorial_review',
  '027_visual_review_journal', '028_visual_review_decisions', '029_intelligence_runs'].map(m => `${m}.sql`);
const brief = (n: number) => ({ title: `Rehearsal ${n}`, question: 'Ensayo local', sources: [{ url: 'https://example.org/fixture', excerpt: 'Test data only.' }] });

async function withSchema(prefix: string, fn: (ctx: { db: Pool; schema: string }) => Promise<void>) {
  assert.ok(connectionString, 'Set INTELLIGENCE_TEST_DATABASE_URL to a local *_test database');
  const url = new URL(connectionString);
  assert.ok(['localhost', '127.0.0.1'].includes(url.hostname) && url.pathname.endsWith('_test'));
  const schema = `${prefix}_${randomUUID().replaceAll('-', '')}`;
  const admin = new Pool({ connectionString });
  await admin.query(`CREATE SCHEMA ${schema}`);
  const db = new Pool({ connectionString, options: `-c search_path=${schema}` });
  try {
    for (const m of ALL) await db.query(readFileSync(`migrations/${m}`, 'utf8'));
    await fn({ db, schema });
  } finally {
    await db.end();
    await admin.query(`DROP SCHEMA ${schema} CASCADE`);
    await admin.end();
  }
}
const cli = (schema: string, args: string[], extra: NodeJS.ProcessEnv = {}) => {
  const u = new URL(connectionString!);
  u.searchParams.set('options', `-c search_path=${schema}`);
  return spawnSync(process.execPath, ['--import', 'tsx', 'src/intelligence/cli.ts', ...args], {
    cwd: process.cwd(), encoding: 'utf8', timeout: 30000,
    env: { ...process.env, DATABASE_URL: u.toString(), INTELLIGENCE_ENABLED: 'true', INTELLIGENCE_WORKER_ENABLED: 'true', NODE_ENV: 'test', ...extra },
  });
};
const status = async (db: Pool) =>
  Object.fromEntries((await db.query('SELECT status, count(*)::int AS n FROM intelligence_jobs GROUP BY status')).rows.map(r => [r.status, r.n]));

test('rehearsal: external scheduler simulation survives a crashed worker and an overdue schedule', async () => {
  await withSchema('rehearsal_sched', async ({ db, schema }) => {
    const store = new JobStore(db);
    for (let i = 0; i < 12; i++) await store.enqueue(`job-${i}`, brief(i));

    // Invocation 1 (separate process) drains 5 and records a heartbeat.
    const first = JSON.parse(cli(schema, ['work-batch', '5']).stdout);
    assert.equal(first.processed, 5);
    assert.equal(first.ledger, 'recorded');
    assert.deepEqual(await status(db), { queued: 7, awaiting_review: 5 });

    // A worker claims a job and dies: lease held, nobody finishes it.
    const crashed = (await store.claim())!;
    assert.ok(crashed);
    assert.equal((await status(db)).running, 1);
    // Before the lease expires the batch must not steal it (6 remaining queued).
    const second = JSON.parse(cli(schema, ['work-batch', '10']).stdout);
    assert.equal(second.processed, 6);
    assert.equal((await status(db)).running, 1, 'live lease is respected');

    // Lease expires -> next invocation recovers it; the dead worker's token is fenced out.
    await db.query("UPDATE intelligence_jobs SET lease_until=now()-interval '1 second' WHERE status='running'");
    const third = JSON.parse(cli(schema, ['work-batch', '5']).stdout);
    assert.equal(third.processed, 1);
    assert.equal(await store.finish(crashed, { late: true }), false, 'stale token cannot complete');
    assert.deepEqual(await status(db), { awaiting_review: 12 });
    assert.equal((await db.query("SELECT count(*)::int AS n FROM intelligence_events WHERE event='lease_expired'")).rows[0].n, 1);
    for (const row of (await db.query('SELECT result FROM intelligence_jobs')).rows) {
      assert.equal(row.result.publication, 'blocked');
      assert.equal(row.result.providerCostMicros, 0);
    }

    // Idle invocation still beats; health is ok.
    const idle = JSON.parse(cli(schema, ['work-batch', '5']).stdout);
    assert.equal(idle.idle, true);
    const ok = cli(schema, ['health', '5']);
    assert.equal(ok.status, 0);
    assert.equal(JSON.parse(ok.stdout).status, 'ok');
    assert.equal((await db.query('SELECT count(*)::int AS n FROM intelligence_runs')).rows[0].n, 4);

    // Scheduler stops: after >2 intervals health is critical (exit 2), a new run clears it.
    await db.query("UPDATE intelligence_runs SET finished_at=finished_at-interval '20 minutes'");
    const overdue = cli(schema, ['health', '5']);
    assert.equal(overdue.status, 2);
    assert.deepEqual(JSON.parse(overdue.stdout).signals, ['scheduler_overdue']);
    cli(schema, ['work-batch', '1']);
    assert.equal(cli(schema, ['health', '5']).status, 0);

    // Disabling either flag refuses execution even with ready work.
    await store.enqueue('after-disable', brief(100));
    for (const flag of ['INTELLIGENCE_ENABLED', 'INTELLIGENCE_WORKER_ENABLED']) {
      const refused = cli(schema, ['work-batch', '2'], { [flag]: 'false' });
      assert.notEqual(refused.status, 0);
      assert.equal(JSON.parse(refused.stderr.trim().split('\n').pop()!).code, 'worker_not_enabled');
    }
    assert.equal((await status(db)).queued, 1, 'refused invocations processed nothing');
  });
});

test('rehearsal: ledger retention never changes last-success or the failure streak', async () => {
  assert.throws(() => parseRetentionDays('0'), /invalid_retention_days/);
  assert.throws(() => parseRetentionDays(undefined), /invalid_retention_days/);
  await withSchema('rehearsal_prune', async ({ db, schema }) => {
    const ins = (o: string, c: string | null, ageDays: number) => db.query(
      "INSERT INTO intelligence_runs(outcome,failure_code,attempted,processed,duration_ms,finished_at) VALUES($1,$2,1,0,1,now()-($3::int*interval '1 day'))", [o, c, ageDays]);
    for (let i = 0; i < 5; i++) await ins('ok', null, 40 - i);       // old successes
    await ins('failed', 'worker_execution_failed', 35);               // old, before latest ok
    await ins('ok', null, 33);                                        // latest ok (old!)
    await ins('failed', 'job_lease_lost', 32);                        // streak after latest ok (old!)
    await ins('failed', 'job_lease_lost', 31);
    const snap = async () => (await db.query(`SELECT
      (SELECT max(finished_at) FROM intelligence_runs WHERE outcome='ok') AS last_ok,
      (SELECT count(*)::int FROM intelligence_runs WHERE outcome='failed' AND id > (SELECT max(id) FROM intelligence_runs WHERE outcome='ok')) AS streak`)).rows[0];
    const before = await snap();
    const out = JSON.parse(cli(schema, ['prune-runs', '30']).stdout);
    assert.equal(out.deleted, 6, 'only rows older than 30d AND before the latest ok are removed');
    const after = await snap();
    assert.deepEqual(after.last_ok, before.last_ok);
    assert.equal(after.streak, 2);
    assert.equal((await db.query('SELECT count(*)::int AS n FROM intelligence_runs')).rows[0].n, 3);
    assert.deepEqual(await pruneRunLedger(db, 30), { deleted: 0 }, 'idempotent');
    assert.notEqual(cli(schema, ['prune-runs', '30'], { INTELLIGENCE_WORKER_ENABLED: 'false' }).status, 0);
    assert.notEqual(cli(schema, ['prune-runs']).status, 0);
    await assert.rejects(pruneRunLedger(db, 0), /invalid_retention_days/);
  });
});

test('rehearsal: chained rollback refuses to destroy jobs, and backup + restore preserves data', async () => {
  await withSchema('rehearsal_rollback', async ({ db, schema }) => {
    const store = new JobStore(db);
    for (let i = 0; i < 3; i++) await store.enqueue(`rb-${i}`, brief(i));
    assert.equal(JSON.parse(cli(schema, ['work-batch', '5']).stdout).processed, 3);
    const down = (m: string) => db.query(readFileSync(`migrations/down/${m}.sql`, 'utf8'));

    // Reverse order. Operational ledger and empty editorial tables roll back cleanly.
    await down('029_intelligence_runs');
    await down('028_visual_review_decisions');
    await down('027_visual_review_journal');
    await down('026_editorial_review');
    await down('025_intelligence_artifacts');
    // Jobs hold real work: rollback must refuse and leave everything intact.
    await assert.rejects(down('024_intelligence_jobs'), /Archive and explicitly review/);
    assert.deepEqual(await status(db), { awaiting_review: 3 });

    // Operator archives to a backup schema, then removes the originals deliberately.
    const jobsBefore = (await db.query('SELECT id,dedupe_key,status,result FROM intelligence_jobs ORDER BY id')).rows;
    const eventsBefore = (await db.query('SELECT job_id,event FROM intelligence_events ORDER BY id')).rows;
    await db.query(`CREATE SCHEMA ${schema}_bak`);
    await db.query(`CREATE TABLE ${schema}_bak.jobs AS SELECT * FROM intelligence_jobs`);
    await db.query(`CREATE TABLE ${schema}_bak.events AS SELECT * FROM intelligence_events`);
    await db.query('DELETE FROM intelligence_events');
    await db.query('DELETE FROM intelligence_jobs');
    await down('024_intelligence_jobs');
    await assert.rejects(db.query('SELECT 1 FROM intelligence_jobs'), /intelligence_jobs/);

    // Re-apply forward and restore from the archive: identical data.
    for (const m of ALL) await db.query(readFileSync(`migrations/${m}`, 'utf8'));
    await db.query(`INSERT INTO intelligence_jobs SELECT * FROM ${schema}_bak.jobs`);
    await db.query(`INSERT INTO intelligence_events(id,job_id,event,details,created_at) SELECT id,job_id,event,details,created_at FROM ${schema}_bak.events`);
    const jobsAfter = (await db.query('SELECT id,dedupe_key,status,result FROM intelligence_jobs ORDER BY id')).rows;
    const eventsAfter = (await db.query('SELECT job_id,event FROM intelligence_events ORDER BY id')).rows;
    assert.deepEqual(jobsAfter, jobsBefore);
    assert.deepEqual(eventsAfter, eventsBefore);
    assert.equal(JSON.parse(cli(schema, ['work-batch', '2']).stdout).idle, true, 'restored system keeps working');
  });
});
