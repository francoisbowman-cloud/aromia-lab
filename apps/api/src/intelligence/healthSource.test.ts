import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { Pool } from 'pg';
import { JobStore } from './store';
import { collectHealthSnapshot, parseIntervalMinutes, readIntelligenceHealth, runLedgeredBatch } from './healthSource';

const connectionString = process.env.INTELLIGENCE_TEST_DATABASE_URL;
const INTERVAL = 5 * 60_000;
const brief = (n: number) => ({ title: `Fixture ${n}`, question: 'Salud operativa', sources: [{ url: 'https://example.org/fixture', excerpt: 'Test data only.' }] });

async function withSchema(prefix: string, migrations: string[], fn: (ctx: { db: Pool; options: object; schema: string }) => Promise<void>) {
  assert.ok(connectionString, 'Set INTELLIGENCE_TEST_DATABASE_URL to a local *_test database');
  const url = new URL(connectionString);
  assert.ok(['localhost', '127.0.0.1'].includes(url.hostname) && url.pathname.endsWith('_test'));
  const schema = `${prefix}_${randomUUID().replaceAll('-', '')}`;
  const admin = new Pool({ connectionString });
  await admin.query(`CREATE SCHEMA ${schema}`);
  const options = { connectionString, options: `-c search_path=${schema}` };
  const db = new Pool(options);
  try {
    for (const m of migrations) await db.query(readFileSync(`migrations/${m}`, 'utf8'));
    await fn({ db, options, schema });
  } finally {
    await db.end();
    await admin.query(`DROP SCHEMA ${schema} CASCADE`);
    await admin.end();
  }
}
const MIGRATIONS = ['024_intelligence_jobs.sql', '029_intelligence_runs.sql'];
const ago = (db: Pool, table: string, col: string, where: string, ms: number) =>
  db.query(`UPDATE ${table} SET ${col}=now()-($1::int * interval '1 millisecond') WHERE ${where}`, [ms]);

test('interval parsing has no default and rejects unsafe values', () => {
  assert.equal(parseIntervalMinutes('5'), 300_000);
  for (const bad of [undefined, '', '0', '-1', '1.5', '10000', 'abc', '5 ']) {
    assert.throws(() => parseIntervalMinutes(bad), /invalid_interval/);
  }
});

test('PostgreSQL: health signals come from real runs and queue state, with restart recovery', async () => {
  await withSchema('health_signals', MIGRATIONS, async ({ db, options }) => {
    let store = new JobStore(db);
    // No run has ever been recorded: honest "never succeeded", not a fabricated ok.
    let report = await readIntelligenceHealth(db, INTERVAL);
    assert.deepEqual(report.signals, ['scheduler_never_succeeded']);
    assert.equal(report.status, 'warning');

    // An idle invocation on an empty queue is a real heartbeat.
    const idle = await runLedgeredBatch(db, store, 3);
    assert.equal(idle.idle, true);
    assert.equal(idle.ledger, 'recorded');
    report = await readIntelligenceHealth(db, INTERVAL);
    assert.deepEqual(report, { status: 'ok', signals: [], publication: 'blocked', providers: 'disabled' });

    // Missed scheduler beats become critical.
    await ago(db, 'intelligence_runs', 'finished_at', 'true', INTERVAL * 2 + 60_000);
    assert.deepEqual((await readIntelligenceHealth(db, INTERVAL)).signals, ['scheduler_overdue']);
    assert.equal((await readIntelligenceHealth(db, INTERVAL)).status, 'critical');

    // Backlog and stale queue come from real queued rows (available now only).
    for (let i = 0; i < 25; i++) await store.enqueue(`b${i}`, brief(i));
    await db.query("UPDATE intelligence_jobs SET available_at=now()+interval '1 hour' WHERE dedupe_key='b0'");
    let snap = await collectHealthSnapshot(db, INTERVAL);
    assert.equal(snap.queuedJobs, 24, 'jobs not yet available are not backlog');
    await db.query("UPDATE intelligence_jobs SET available_at=now() WHERE dedupe_key='b0'");
    await ago(db, 'intelligence_jobs', 'available_at', "dedupe_key='b1'", INTERVAL * 3 + 60_000);
    const withQueue = await readIntelligenceHealth(db, INTERVAL);
    assert.ok(withQueue.signals.includes('queue_backlog') && withQueue.signals.includes('queue_stale'));

    // A job whose lease expired (crashed worker) is pending work, not invisible.
    await db.query("DELETE FROM intelligence_events");
    await db.query("DELETE FROM intelligence_jobs");
    await store.enqueue('lease', brief(99));
    const claimed = await store.claim();
    assert.ok(claimed);
    assert.equal((await collectHealthSnapshot(db, INTERVAL)).queuedJobs, 0, 'live lease is not pending');
    await db.query("UPDATE intelligence_jobs SET lease_until=now()-interval '1 second'");
    assert.equal((await collectHealthSnapshot(db, INTERVAL)).queuedJobs, 1);

    // Process restart: state survives a brand new pool and identical result.
    const before = await collectHealthSnapshot(db, INTERVAL);
    // Fresh pool simulates process restart; the helper closes the original.
    const db2 = new Pool(options);
    try {
      const after = await collectHealthSnapshot(db2, INTERVAL);
      assert.equal(after.queuedJobs, before.queuedJobs);
      assert.equal(after.lastSuccessfulRunMs, before.lastSuccessfulRunMs);
      store = new JobStore(db2);
      // Lease recovery then processes it; a fresh ok run clears overdue.
      const run = await runLedgeredBatch(db2, store, 2);
      assert.equal(run.processed, 1);
      assert.equal((await readIntelligenceHealth(db2, INTERVAL)).status, 'ok');
    } finally {
      await db2.end();
    }
  });
});

test('PostgreSQL: failed runs are classified, never leak error text, and an ok run resets the streak', async () => {
  await withSchema('health_failures', MIGRATIONS, async ({ db }) => {
    const store = new JobStore(db);
    const secret = 'postgres://admin:hunter2@internal-host/db';
    const leaking = async () => { throw new Error(secret); };
    for (let i = 0; i < 3; i++) {
      await assert.rejects(runLedgeredBatch(db, store, 2, { processJob: leaking }), (e: Error) => e.message === secret);
    }
    const rows = (await db.query('SELECT * FROM intelligence_runs ORDER BY id')).rows;
    assert.equal(rows.length, 3);
    assert.ok(rows.every(r => r.outcome === 'failed' && r.failure_code === 'worker_execution_failed'));
    assert.ok(!JSON.stringify(rows).includes('hunter2'), 'ledger must not retain driver/error text');
    const bad = await readIntelligenceHealth(db, INTERVAL);
    assert.ok(bad.signals.includes('repeated_failures'));
    assert.equal(bad.status, 'critical');

    await assert.rejects(runLedgeredBatch(db, store, 1, { processJob: async () => { throw new Error('job_lease_lost'); } }), /job_lease_lost/);
    assert.equal((await db.query("SELECT failure_code FROM intelligence_runs ORDER BY id DESC LIMIT 1")).rows[0].failure_code, 'job_lease_lost');

    await runLedgeredBatch(db, store, 1);
    const ok = await readIntelligenceHealth(db, INTERVAL);
    assert.deepEqual(ok.signals, [], 'a successful run resets the consecutive-failure streak');

    // Refusals before any worker runs are not scheduler runs.
    const count = (await db.query('SELECT count(*)::int AS n FROM intelligence_runs')).rows[0].n;
    await assert.rejects(runLedgeredBatch(db, store, 99), /invalid_batch_size/);
    assert.equal((await db.query('SELECT count(*)::int AS n FROM intelligence_runs')).rows[0].n, count);
  });
});

test('PostgreSQL: ledger constraints reject inconsistent rows and rollback is reversible', async () => {
  await withSchema('health_ledger', MIGRATIONS, async ({ db }) => {
    await db.query(readFileSync('migrations/029_intelligence_runs.sql', 'utf8')); // idempotent DDL
    const insert = (o: string, c: string | null, a: number, p: number) =>
      db.query('INSERT INTO intelligence_runs(outcome,failure_code,attempted,processed,duration_ms) VALUES($1,$2,$3,$4,1)', [o, c, a, p]);
    await assert.rejects(insert('ok', 'x_y', 1, 1));
    await assert.rejects(insert('failed', null, 1, 1));
    await assert.rejects(insert('failed', 'Bad Code!', 1, 0));
    await assert.rejects(insert('ok', null, 1, 2));
    await insert('ok', null, 2, 1);
    await db.query(readFileSync('migrations/down/029_intelligence_runs.sql', 'utf8'));
    await assert.rejects(db.query('SELECT 1 FROM intelligence_runs'), /intelligence_runs/);
    await db.query(readFileSync('migrations/029_intelligence_runs.sql', 'utf8'));
    assert.equal((await db.query('SELECT count(*)::int AS n FROM intelligence_runs')).rows[0].n, 0);
  });
});

test('PostgreSQL: work-batch still succeeds without the optional ledger and reports it unavailable', async () => {
  await withSchema('health_noledger', ['024_intelligence_jobs.sql'], async ({ db }) => {
    const result = await runLedgeredBatch(db, new JobStore(db), 1);
    assert.equal(result.ledger, 'unavailable');
    assert.equal(result.publication, 'blocked');
    await assert.rejects(readIntelligenceHealth(db, INTERVAL)); // health cannot invent data without a source
  });
});

test('PostgreSQL: CLI health and work-batch across separate processes, with exit codes for alerting', async () => {
  await withSchema('health_cli', MIGRATIONS, async ({ db, schema }) => {
    const cliUrl = new URL(connectionString!);
    cliUrl.searchParams.set('options', `-c search_path=${schema}`);
    const env = { ...process.env, DATABASE_URL: cliUrl.toString(), INTELLIGENCE_ENABLED: 'true', INTELLIGENCE_WORKER_ENABLED: 'true', NODE_ENV: 'test' };
    const run = (args: string[], e: NodeJS.ProcessEnv = env) =>
      spawnSync(process.execPath, ['--import', 'tsx', 'src/intelligence/cli.ts', ...args], { cwd: process.cwd(), env: e, encoding: 'utf8', timeout: 30000 });

    // Critical before any heartbeat once a stale job exists -> exit code 2.
    const store = new JobStore(db);
    await store.enqueue('cli-stale', brief(1));
    await ago(db, 'intelligence_jobs', 'available_at', 'true', INTERVAL * 4);
    const critical = run(['health', '5']);
    assert.equal(critical.status, 2);
    const parsed = JSON.parse(critical.stdout);
    assert.equal(parsed.status, 'critical');
    assert.ok(parsed.signals.includes('queue_stale') && parsed.signals.includes('scheduler_never_succeeded'));
    assert.equal(parsed.publication, 'blocked');

    // A real invocation drains it, records a heartbeat, and health recovers.
    const batch = JSON.parse(execFileSync(process.execPath, ['--import', 'tsx', 'src/intelligence/cli.ts', 'work-batch', '5'], { cwd: process.cwd(), env, encoding: 'utf8', timeout: 30000 }));
    assert.equal(batch.processed, 1);
    assert.equal(batch.ledger, 'recorded');
    const healthy = run(['health', '5']);
    assert.equal(healthy.status, 0);
    assert.equal(JSON.parse(healthy.stdout).status, 'ok');

    // Fail-closed gates: no interval default, flag required, production needs approval.
    assert.notEqual(run(['health']).status, 0);
    assert.notEqual(run(['health', '5'], { ...env, INTELLIGENCE_ENABLED: 'false' }).status, 0);
    assert.notEqual(run(['health', '5'], { ...env, NODE_ENV: 'production' }).status, 0);
    const refused = run(['work-batch', '2'], { ...env, INTELLIGENCE_WORKER_ENABLED: 'false' });
    assert.notEqual(refused.status, 0);
    assert.equal((await db.query('SELECT count(*)::int AS n FROM intelligence_runs')).rows[0].n, 1, 'refusals record no run');
  });
});
