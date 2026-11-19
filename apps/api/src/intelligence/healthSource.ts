import type { Pool } from 'pg';
import { classifyBatchFailure, runObservedBatch, type BatchTelemetry } from './batch';
import { evaluateIntelligenceHealth, type IntelligenceHealthReport } from './health';
import type { JobStore } from './store';

// Read-only snapshot of real operational state. The database clock is used for
// every comparison so scheduler/host clock skew cannot fabricate signals.
type Db = Pick<Pool, 'query'>;

export async function collectHealthSnapshot(db: Db, expectedIntervalMs: number) {
  const r = await db.query(`
    SELECT (extract(epoch FROM now())*1000)::bigint AS now_ms,
      (SELECT (extract(epoch FROM max(finished_at))*1000)::bigint FROM intelligence_runs WHERE outcome='ok') AS last_ok_ms,
      (SELECT count(*)::int FROM intelligence_runs
        WHERE outcome='failed' AND id > COALESCE((SELECT max(id) FROM intelligence_runs WHERE outcome='ok'),0)) AS consecutive_failures,
      p.pending, (extract(epoch FROM p.oldest)*1000)::bigint AS oldest_ms
    FROM (SELECT count(*)::int AS pending,
            min(CASE WHEN status='queued' THEN available_at ELSE lease_until END) AS oldest
          FROM intelligence_jobs
          WHERE (status='queued' AND available_at<=now() AND attempts<max_attempts)
             OR (status='running' AND lease_until<=now())) p`);
  const row = r.rows[0];
  return {
    nowMs: Number(row.now_ms),
    lastSuccessfulRunMs: row.last_ok_ms === null ? null : Number(row.last_ok_ms),
    consecutiveFailures: Number(row.consecutive_failures),
    queuedJobs: Number(row.pending),
    oldestQueuedAtMs: row.oldest_ms === null ? null : Number(row.oldest_ms),
    expectedIntervalMs,
  };
}

export async function readIntelligenceHealth(db: Db, expectedIntervalMs: number): Promise<IntelligenceHealthReport> {
  return evaluateIntelligenceHealth(await collectHealthSnapshot(db, expectedIntervalMs));
}

export function parseIntervalMinutes(value: string | undefined): number {
  if (!value || !/^[1-9]\d{0,3}$/.test(value)) throw new Error('invalid_interval');
  return Number(value) * 60_000;
}

async function recordRun(db: Db, run: { outcome: 'ok' | 'failed'; code: string | null; attempted: number; processed: number; durationMs: number }) {
  try {
    await db.query(
      'INSERT INTO intelligence_runs(outcome,failure_code,attempted,processed,duration_ms) VALUES($1,$2,$3,$4,$5)',
      [run.outcome, run.code, run.attempted, run.processed, run.durationMs]);
    return true;
  } catch {
    // The ledger is optional (opt-in migration 029). Never alter job semantics or
    // leak driver text; health will honestly report the missing heartbeat.
    return false;
  }
}

// Runs one bounded batch and records its outcome. Job results and thrown errors
// are never changed by the ledger.
export async function runLedgeredBatch(
  db: Db, store: JobStore, size: number,
  options: Parameters<typeof runObservedBatch>[2] = {}
): Promise<BatchTelemetry & { ledger: 'recorded' | 'unavailable' }> {
  let failure: { attempted: number; processed: number; durationMs: number } | undefined;
  try {
    const telemetry = await runObservedBatch(store, size, {
      ...options,
      onFailure: f => { failure = f; options.onFailure?.(f); },
    });
    const ok = await recordRun(db, { outcome: 'ok', code: null, attempted: telemetry.attempted, processed: telemetry.processed, durationMs: telemetry.durationMs });
    return { ...telemetry, ledger: ok ? 'recorded' : 'unavailable' };
  } catch (error) {
    if (failure) await recordRun(db, { outcome: 'failed', code: classifyBatchFailure(error), ...failure });
    throw error;
  }
}

export function parseRetentionDays(value: string | undefined): number {
  if (!value || !/^[1-9]\d{0,3}$/.test(value)) throw new Error('invalid_retention_days');
  return Number(value);
}

// Bounded retention for the operational ledger. Rows at or after the latest
// successful run are always kept, so "last success" and the consecutive-failure
// streak computed by collectHealthSnapshot are never altered by pruning.
export async function pruneRunLedger(db: Db, keepDays: number): Promise<{ deleted: number }> {
  if (!Number.isInteger(keepDays) || keepDays < 1 || keepDays > 3650) throw new Error('invalid_retention_days');
  const r = await db.query(
    `DELETE FROM intelligence_runs
      WHERE finished_at < now() - ($1::int * interval '1 day')
        AND id < COALESCE((SELECT max(id) FROM intelligence_runs WHERE outcome='ok'),0)`, [keepDays]);
  return { deleted: r.rowCount ?? 0 };
}
