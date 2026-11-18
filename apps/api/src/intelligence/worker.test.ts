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
  const finished: Array<{ job: Job; result: any; errorCode?: string }> = [];
  const store = {
    claim: async () => validJob,
    finish: async (job: Job, result: unknown, errorCode?: string) => {
      finished.push({ job, result, errorCode });
      return true;
    },
  } as unknown as JobStore;

  assert.equal(await runOnce(store, validJob.id), true);
  assert.equal(finished.length, 1);
  assert.equal(finished[0].job.token, validJob.token);
  assert.equal(finished[0].errorCode, undefined);
  assert.equal(finished[0].result.publication, 'blocked');
  assert.equal(finished[0].result.checks.factual, 'pending_human');
  assert.equal(finished[0].result.checks.rights, 'pending_human');
  assert.equal(finished[0].result.providerCostMicros, 0);
  assert.equal(finished[0].result.sources[0].verified, false);
});

test('worker marks malformed briefs as failed without publishing or silently succeeding', async () => {
  const recorded: Array<{ result: unknown; errorCode?: string }> = [];
  const store = {
    claim: async () => ({ ...validJob, payload: { title: 'missing question', sources: [] } }),
    finish: async (_job: Job, result: unknown, errorCode?: string) => {
      recorded.push({ result, errorCode });
      return true;
    },
  } as unknown as JobStore;

  assert.equal(await runOnce(store), true);
  assert.deepEqual(recorded, [{ result: null, errorCode: 'preparation_failed' }]);
});

test('worker forwards the targeted job id to the claim operation', async () => {
  const claims: Array<string | undefined> = [];
  const store = {
    claim: async (id?: string) => { claims.push(id); return undefined; },
    finish: async () => { throw new Error('unexpected_finish'); },
  } as unknown as JobStore;

  assert.equal(await runOnce(store, validJob.id), false);
  assert.deepEqual(claims, [validJob.id]);
});

test('worker does not mislabel persistence errors as invalid briefs or finish twice', async () => {
  const calls: Array<{ result: unknown; errorCode?: string }> = [];
  const dbError = new Error('temporary_database_failure');
  const store = {
    claim: async () => validJob,
    finish: async (_job: Job, result: unknown, errorCode?: string) => {
      calls.push({ result, errorCode });
      throw dbError;
    },
  } as unknown as JobStore;

  await assert.rejects(runOnce(store), error => error === dbError);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].errorCode, undefined);
  assert.ok(calls[0].result);
});

test('worker propagates claim failures without trying to finish a job', async () => {
  const claimError = new Error('database_unavailable');
  let finishCalled = false;
  const store = {
    claim: async () => { throw claimError; },
    finish: async () => { finishCalled = true; },
  } as unknown as JobStore;

  await assert.rejects(runOnce(store), error => error === claimError);
  assert.equal(finishCalled, false);
});

test('worker fails closed when a stale lease prevents committing a prepared result', async () => {
  let finishes = 0;
  const store = {
    claim: async () => validJob,
    finish: async () => { finishes += 1; return false; },
  } as unknown as JobStore;
  await assert.rejects(runOnce(store), /job_lease_lost/);
  assert.equal(finishes, 1);
});

test('worker fails closed when a stale lease prevents recording invalid input', async () => {
  const errors: Array<string | undefined> = [];
  const store = {
    claim: async () => ({...validJob, payload: null}),
    finish: async (_job: Job, _result: unknown, error?: string) => {
      errors.push(error);
      return false;
    },
  } as unknown as JobStore;
  await assert.rejects(runOnce(store), /job_lease_lost/);
  assert.deepEqual(errors, ['preparation_failed']);
});
