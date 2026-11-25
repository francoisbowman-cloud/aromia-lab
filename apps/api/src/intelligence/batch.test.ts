import test from 'node:test';
import assert from 'node:assert/strict';
import type { JobStore } from './store';
import { parseBatchSize, requireBatchWorkerEnabled, runBoundedBatch, runObservedBatch, classifyBatchFailure } from './batch';

const stub = {} as JobStore;

test('batch size parser fails closed for absent, malformed or unbounded values', () => {
  for (const value of [undefined, '', '0', '-1', '1.5', '01', '26', '500', 'Infinity', ' 3 ', '3jobs']) {
    assert.throws(() => parseBatchSize(value), /invalid_batch_size/);
  }
  assert.equal(parseBatchSize('1'), 1);
  assert.equal(parseBatchSize('25'), 25);
});

test('finite batch stops at first idle claim instead of polling continuously', async () => {
  let calls = 0;
  const result = await runBoundedBatch(stub, 10, async () => {
    calls += 1;
    return calls <= 3;
  });
  assert.deepEqual(result, {
    attempted: 4, processed: 3, idle: true, publication: 'blocked', providers: 'disabled',
  });
  assert.equal(calls, 4);
});

test('finite batch stops exactly at max jobs and does not imply publication', async () => {
  let calls = 0;
  const result = await runBoundedBatch(stub, 25, async () => {
    calls += 1;
    return true;
  });
  assert.equal(calls, 25);
  assert.deepEqual(result, {
    attempted: 25, processed: 25, idle: false, publication: 'blocked', providers: 'disabled',
  });
});

test('failed persistence propagates instead of continuing through jobs', async () => {
  const failure = new Error('storage_failure');
  let calls = 0;
  await assert.rejects(runBoundedBatch(stub, 10, async () => {
    calls += 1;
    if (calls === 2) throw failure;
    return true;
  }), error => error === failure);
  assert.equal(calls, 2);
});

test('invalid direct batch sizes never invoke a worker', async () => {
  for (const size of [0, -1, 26, 1.1, Number.NaN, Number.POSITIVE_INFINITY]) {
    let called = false;
    await assert.rejects(runBoundedBatch(stub, size, async () => {
      called = true;
      return true;
    }), /invalid_batch_size/);
    assert.equal(called, false);
  }
});

test('worker batch requires separate explicit system and worker enablement', () => {
  for (const flags of [
    {},
    { INTELLIGENCE_ENABLED: 'true' },
    { INTELLIGENCE_WORKER_ENABLED: 'true' },
    { INTELLIGENCE_ENABLED: '1', INTELLIGENCE_WORKER_ENABLED: 'true' },
    { INTELLIGENCE_ENABLED: 'true', INTELLIGENCE_WORKER_ENABLED: '1' },
  ]) {
    assert.throws(() => requireBatchWorkerEnabled(flags), /worker_not_enabled/);
  }
  assert.doesNotThrow(() => requireBatchWorkerEnabled({
    INTELLIGENCE_ENABLED: 'true',
    INTELLIGENCE_WORKER_ENABLED: 'true',
  }));
});

test('production batch is blocked without a separate runtime approval flag', () => {
  const flags = { NODE_ENV: 'production', INTELLIGENCE_ENABLED: 'true', INTELLIGENCE_WORKER_ENABLED: 'true' };
  assert.throws(() => requireBatchWorkerEnabled(flags), /production_worker_not_approved/);
  assert.throws(() => requireBatchWorkerEnabled({
    ...flags, AROMIA_INTELLIGENCE_PRODUCTION_RUNTIME_APPROVED: 'false',
  }), /production_worker_not_approved/);
  assert.doesNotThrow(() => requireBatchWorkerEnabled({
    ...flags, AROMIA_INTELLIGENCE_PRODUCTION_RUNTIME_APPROVED: 'true',
  }));
  assert.doesNotThrow(() => requireBatchWorkerEnabled({
    ...flags, NODE_ENV: 'test',
  }));
});


test('observed batch emits aggregate counts and deterministic duration without payloads', async () => {
  let time = 1_000;
  const result = await runObservedBatch(stub, 3, {
    now: () => time,
    processJob: async () => {
      time += 12;
      return time < 1_036;
    },
  });
  assert.deepEqual(result, {
    attempted: 3, processed: 2, idle: true, durationMs: 36,
    publication: 'blocked', providers: 'disabled',
  });
  assert.deepEqual(Object.keys(result).sort(), [
    'attempted', 'durationMs', 'idle', 'processed', 'providers', 'publication',
  ]);
});

test('observed batch never invokes worker for invalid sizes', async () => {
  let called = false;
  await assert.rejects(runObservedBatch(stub, 26, {
    processJob: async () => { called = true; return true; },
  }), /invalid_batch_size/);
  assert.equal(called, false);
});

test('observed batch propagates worker errors without fabricating completion metrics', async () => {
  const failure = new Error('database_failure');
  await assert.rejects(runObservedBatch(stub, 2, {
    processJob: async () => { throw failure; },
  }), error => error === failure);
});

test('failure classification reveals only allowlisted operational codes', () => {
  for (const code of ['invalid_batch_size', 'worker_not_enabled', 'production_worker_not_approved', 'job_lease_lost']) {
    assert.equal(classifyBatchFailure(new Error(code)), code);
  }
  assert.equal(classifyBatchFailure(new Error('password=secret database failure')), 'worker_execution_failed');
  assert.equal(classifyBatchFailure({ message: 'job_lease_lost' }), 'worker_execution_failed');
  assert.equal(classifyBatchFailure(null), 'worker_execution_failed');
});

test('failed observed batch reports safe partial counters and rethrows original failure', async () => {
  const original = new Error('password=SECRET in DB error');
  let tick = 100;
  let called = 0;
  const failures: unknown[] = [];
  await assert.rejects(runObservedBatch(stub, 5, {
    now: () => tick,
    processJob: async () => {
      called += 1;
      tick += 8;
      if (called === 3) throw original;
      return true;
    },
    onFailure: failure => failures.push(failure),
  }), error => error === original);
  assert.deepEqual(failures, [{
    attempted: 3, processed: 2, durationMs: 24,
    code: 'worker_execution_failed', publication: 'blocked', providers: 'disabled',
  }]);
  assert.equal(JSON.stringify(failures).includes('SECRET'), false);
});

test('idle and successful batches never report failure', async () => {
  let called = false;
  await runObservedBatch(stub, 2, {
    processJob: async () => false,
    onFailure: () => { called = true; },
  });
  assert.equal(called, false);
});
