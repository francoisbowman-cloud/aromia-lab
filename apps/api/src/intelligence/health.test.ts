import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateIntelligenceHealth, type IntelligenceHealthInput } from './health';
const nowMs = 1_000_000;
const base: IntelligenceHealthInput = { nowMs, lastSuccessfulRunMs: 970_000, consecutiveFailures: 0, queuedJobs: 0, oldestQueuedAtMs: null, expectedIntervalMs: 60_000 };
test('healthy snapshot has no alerts or side effects', () => {
  assert.deepEqual(evaluateIntelligenceHealth(base), {status:'ok', signals:[], publication:'blocked', providers:'disabled'});
});
test('first startup is warning rather than evidence of a broken scheduler', () => {
  assert.deepEqual(evaluateIntelligenceHealth({...base,lastSuccessfulRunMs:null}).signals,['scheduler_never_succeeded']);
});
test('three failures are critical; two are not', () => {
  assert.equal(evaluateIntelligenceHealth({...base,consecutiveFailures:2}).status,'ok');
  assert.deepEqual(evaluateIntelligenceHealth({...base,consecutiveFailures:3}).signals,['repeated_failures']);
});
test('scheduler overdue and stale queue are independently diagnosed', () => {
  assert.deepEqual(evaluateIntelligenceHealth({...base,lastSuccessfulRunMs:800_000,queuedJobs:1,oldestQueuedAtMs:800_000}).signals,['scheduler_overdue','queue_stale']);
});
test('backlog threshold is explicit and bounded', () => {
  assert.equal(evaluateIntelligenceHealth({...base,queuedJobs:24,oldestQueuedAtMs:970_000}).status,'ok');
  assert.deepEqual(evaluateIntelligenceHealth({...base,queuedJobs:25,oldestQueuedAtMs:970_000}).signals,['queue_backlog']);
});
test('rejects impossible, future and inconsistent snapshots', () => {
  for (const changes of [{nowMs:-1},{lastSuccessfulRunMs:1_000_001},{queuedJobs:-1},{queuedJobs:1},{queuedJobs:0,oldestQueuedAtMs:100},{expectedIntervalMs:0},{consecutiveFailures:1.5}]) {
    assert.throws(()=>evaluateIntelligenceHealth({...base,...changes}),/invalid_health_snapshot/);
  }
});
