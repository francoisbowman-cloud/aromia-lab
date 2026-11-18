import { JobStore } from './store';
import { prepare, validateBrief } from './policy';

export async function runOnce(store: JobStore, id?: string) {
  const job = await store.claim(id);
  if (!job) return false;

  // Do not classify persistence/lease failures as an invalid editorial brief:
  // only validation/preparation errors should become preparation_failed.
  let result: ReturnType<typeof prepare>;
  try {
    result = prepare(validateBrief(job.payload));
  } catch {
    await store.finish(job, null, 'preparation_failed');
    return true;
  }

  // Let DB errors propagate for the caller to observe and retry after the lease
  // expires. Never attempt a second finish() with a misleading error code.
  await store.finish(job, result);
  return true;
}
