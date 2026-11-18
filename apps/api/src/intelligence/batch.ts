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
}): void {
  if (flags.INTELLIGENCE_ENABLED !== 'true' || flags.INTELLIGENCE_WORKER_ENABLED !== 'true') {
    throw new Error('worker_not_enabled');
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
