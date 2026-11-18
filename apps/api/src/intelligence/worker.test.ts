import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runOnce } from './worker';
import type { Job, JobStore } from './store';

const validJob: Job = {
  id: 'test-job',
  token: 'test-lease',
  status: 'running',
  attempts: 1,
  payload: {
    title: 'An editorial question',
    question: 'What is documented about bergamot in perfumery?',
    sources: [{ url: 'https://example.org/source', excerpt: 'A documented source excerpt.' }],
  },
};

test('worker remains idle when no job can be claimed', async () => {
  let finishCalled = false;
  const store = {
    claim: async () => undefined,
    finish: async () => { finishCalled = true; return true; },
  } as unknown as JobStore;

  assert.equal(await runOnce(store), false);
  assert.equal(finishCalled, false);
});

test('worker prepares a claimed brief without granting editorial approval or spending', async () => {
  let finished: { job: Job; result: any; errorCode?: string } | undefined;
  const store = {
    claim: async () => validJob,
    finish: async (job: Job, result: unknown, errorCode?: string) => {
      finished = { job, result, errorCode };
      return true;
    },
  } as unknown as JobStore;

  assert.equal(await runOnce(store, validJob.id), true);
  assert.ok(finished);
  assert.equal(finished.job.token, validJob.token);
  assert.equal(finished.errorCode, undefined);
  assert.equal(finished.result.publication, 'blocked');
  assert.equal(finished.result.checks.factual, 'pending_human');
  assert.equal(finished.result.checks.rights, 'pending_human');
  assert.equal(finished.result.providerCostMicros, 0);
  assert.equal(finished.result.sources[0].verified, false);
});

test('worker marks malformed briefs as failed without publishing or silently succeeding', async () => {
  let recorded: { result: unknown; errorCode?: string } | undefined;
  const store = {
    claim: async () => ({ ...validJob, payload: { title: 'missing question', sources: [] } }),
    finish: async (_job: Job, result: unknown, errorCode?: string) => {
      recorded = { result, errorCode };
      return true;
    },
  } as unknown as JobStore;

  assert.equal(await runOnce(store), true);
  assert.deepEqual(recorded, { result: null, errorCode: 'preparation_failed' });
});
