// Pure, read-only operational diagnostics. No scheduler, I/O or alert delivery.
export type IntelligenceHealthInput = {
  nowMs: number;
  lastSuccessfulRunMs: number | null;
  consecutiveFailures: number;
  queuedJobs: number;
  oldestQueuedAtMs: number | null;
  expectedIntervalMs: number;
};

export type IntelligenceHealthSignal =
  | 'scheduler_never_succeeded'
  | 'scheduler_overdue'
  | 'repeated_failures'
  | 'queue_backlog'
  | 'queue_stale';

export type IntelligenceHealthReport = {
  status: 'ok' | 'warning' | 'critical';
  signals: IntelligenceHealthSignal[];
  publication: 'blocked';
  providers: 'disabled';
};

export function evaluateIntelligenceHealth(input: IntelligenceHealthInput): IntelligenceHealthReport {
  const { nowMs, lastSuccessfulRunMs, consecutiveFailures, queuedJobs, oldestQueuedAtMs, expectedIntervalMs } = input;
  const validTime = (value: number) => Number.isSafeInteger(value) && value >= 0 && value <= nowMs;
  if (!validTime(nowMs) || !Number.isSafeInteger(expectedIntervalMs) || expectedIntervalMs < 60_000 ||
      !Number.isSafeInteger(consecutiveFailures) || consecutiveFailures < 0 ||
      !Number.isSafeInteger(queuedJobs) || queuedJobs < 0 ||
      (lastSuccessfulRunMs !== null && !validTime(lastSuccessfulRunMs)) ||
      (oldestQueuedAtMs !== null && !validTime(oldestQueuedAtMs)) ||
      (queuedJobs === 0 && oldestQueuedAtMs !== null) ||
      (queuedJobs > 0 && oldestQueuedAtMs === null)) {
    throw new Error('invalid_health_snapshot');
  }
  const signals: IntelligenceHealthSignal[] = [];
  if (lastSuccessfulRunMs === null) signals.push('scheduler_never_succeeded');
  else if (nowMs - lastSuccessfulRunMs > expectedIntervalMs * 2) signals.push('scheduler_overdue');
  if (consecutiveFailures >= 3) signals.push('repeated_failures');
  if (queuedJobs >= 25) signals.push('queue_backlog');
  if (oldestQueuedAtMs !== null && nowMs - oldestQueuedAtMs > expectedIntervalMs * 3) signals.push('queue_stale');
  const critical = signals.includes('repeated_failures') || signals.includes('scheduler_overdue') || signals.includes('queue_stale');
  return { status: critical ? 'critical' : signals.length ? 'warning' : 'ok', signals, publication: 'blocked', providers: 'disabled' };
}
