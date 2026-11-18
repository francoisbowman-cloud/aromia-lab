import type { JobStore } from './store';
import { runOnce } from './worker';

// Event-driven, finite job execution. The caller owns scheduling and budget.
// No daemon, timers, network providers, auto-publish or production activation.
export function parseBatchSize(value: string | undefined): number {
  if (!value || !/^(?:[1-9]|1\d|2[0-5])$/.test(value)) {
    throw new Error('invalid_batch_size');
  }
  return Number(value);
}

export function requireBatchWorkerEnabled(flags: {
  INTELLIGENCE_ENABLED?: string;
  INTELLIGENCE_WORKER_ENABLED?: string;
  AROMIA_INTELLIGENCE_PRODUCTION_RUNTIME_APPROVED?: string;
  NODE_ENV?: string;
}): void {
  if (flags.INTELLIGENCE_ENABLED !== 'true' || flags.INTELLIGENCE_WORKER_ENABLED !== 'true') {
    throw new Error('worker_not_enabled');
  }
  // Extra guard against accidental production execution. A flag alone is not
  // Publisher authorization; the operator must obtain that separately.
  if (flags.NODE_ENV === 'production' &&
      flags.AROMIA_INTELLIGENCE_PRODUCTION_RUNTIME_APPROVED !== 'true') {
    throw new Error('production_worker_not_approved');
  }
}

export type BatchResult = {
  attempted: number;
  processed: number;
  idle: boolean;
  publication: 'blocked';
  providers: 'disabled';
};

export async function runBoundedBatch(
  store: JobStore,
  size: number,
  processJob: (store: JobStore) => Promise<boolean> = runOnce
): Promise<BatchResult> {
  if (!Number.isInteger(size) || size < 1 || size > 25) {
    throw new Error('invalid_batch_size');
  }

  let attempted = 0;
  let processed = 0;
  while (attempted < size) {
    attempted += 1;
    const didProcess = await processJob(store);
    if (!didProcess) break;
    processed += 1;
  }
  return {
    attempted,
    processed,
    idle: processed < attempted,
    publication: 'blocked',
    providers: 'disabled'
  };
}


// A bounded invocation can be observed without exposing job payloads or
// changing its processing semantics. Metrics do not grant runtime approval.
export type BatchTelemetry = {
  attempted: number;
  processed: number;
  idle: boolean;
  durationMs: number;
  publication: 'blocked';
  providers: 'disabled';
};

export async function runObservedBatch(
  store: JobStore,
  size: number,
  options: {
    processJob?: (store: JobStore) => Promise<boolean>;
    now?: () => number;
  } = {}
): Promise<BatchTelemetry> {
  // Validate before sampling or invoking a worker.
  if (!Number.isInteger(size) || size < 1 || size > 25) {
    throw new Error('invalid_batch_size');
  }
  const now = options.now ?? Date.now;
  const started = now();
  const result = await runBoundedBatch(store, size, options.processJob ?? runOnce);
  const elapsed = now() - started;
  return {
    ...result,
    durationMs: Number.isFinite(elapsed) ? Math.max(0, Math.round(elapsed)) : 0,
  };
}
