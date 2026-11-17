import { JobStore } from './store';
import { prepare, validateBrief } from './policy';
export async function runOnce(store: JobStore) {
  const job = await store.claim();
  if (!job) return false;
  try { await store.finish(job,prepare(validateBrief(job.payload))); }
  catch { await store.finish(job,null,'preparation_failed'); }
  return true;
}
