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
  processJob: (store: JobStore) => Promise<boolean> = runOnce,
  onProgress?: (attempted: number, processed: number) => void
): Promise<BatchResult> {
  if (!Number.isInteger(size) || size < 1 || size > 25) {
    throw new Error('invalid_batch_size');
  }

  let attempted = 0;
  let processed = 0;
  while (attempted < size) {
    attempted += 1;
    try {
      const didProcess = await processJob(store);
      if (!didProcess) {
        onProgress?.(attempted, processed);
        break;
      }
      processed += 1;
      onProgress?.(attempted, processed);
    } catch (error) {
      onProgress?.(attempted, processed);
      throw error;
    }
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
    onFailure?: (failure: BatchFailureTelemetry) => void;
  } = {}
): Promise<BatchTelemetry> {
  // Validate before sampling or invoking a worker.
  if (!Number.isInteger(size) || size < 1 || size > 25) {
    throw new Error('invalid_batch_size');
  }
  const now = options.now ?? (() => performance.now());
  const started = now();
  let attempted = 0;
  let processed = 0;
  let result: BatchResult;
  try {
    result = await runBoundedBatch(store, size, options.processJob ?? runOnce, (a, p) => {
      attempted = a;
      processed = p;
    });
  } catch (error) {
    const elapsed = now() - started;
    options.onFailure?.({
      attempted, processed,
      durationMs: Number.isFinite(elapsed) ? Math.max(0, Math.round(elapsed)) : 0,
      code: classifyBatchFailure(error),
      publication: 'blocked', providers: 'disabled',
    });
    throw error;
  }
  const elapsed = now() - started;
  return {
    ...result,
    durationMs: Number.isFinite(elapsed) ? Math.max(0, Math.round(elapsed)) : 0,
  };
}

// Stable, non-sensitive failure categories for scheduler logs and alerts.
// Never log arbitrary Error.message: database/provider errors may contain secrets.
export function classifyBatchFailure(error: unknown): string {
  const known = new Set([
    'invalid_batch_size', 'worker_not_enabled', 'production_worker_not_approved',
    'job_lease_lost',
  ]);
  return error instanceof Error && known.has(error.message) ? error.message : 'worker_execution_failed';
}

export type BatchFailureTelemetry = {
  attempted: number;
  processed: number;
  durationMs: number;
  code: string;
  publication: 'blocked';
  providers: 'disabled';
};
