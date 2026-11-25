import { createHash, randomUUID } from 'node:crypto';

// Decoupled, fail-safe client port for the independent OMNI project. This module
// defines AROMIA's expectation of a versioned contract; it does NOT prove that any
// OMNI deployment implements it. OMNI is never required for Aromia to work: every
// failure degrades to a typed "unavailable" result, never an exception and never a
// PASS. A verdict from OMNI is evidence only: it grants no approval or publication.
export const OMNI_CONTRACT_VERSION = 'aromia-omni/1';

export type OmniOperation = 'observe_product' | 'audit_image' | 'creative_cycle';
export type OmniVerdict = 'PASS' | 'REVIEW' | 'FAIL';
export type OmniFailure =
  | 'disabled' | 'not_approved_for_production' | 'invalid_request' | 'circuit_open'
  | 'timeout' | 'network_error' | 'http_error' | 'bad_response'
  | 'response_too_large' | 'contract_mismatch' | 'budget_exceeded';

export type OmniRequest = {
  operation: OmniOperation;
  subject: { kind: 'image' | 'product'; ref: string };
  context?: Record<string, string>;
};

type Governance = { approval: 'not_granted'; publication: 'blocked'; traceId: string };
export type OmniResult =
  | ({ ok: true; verdict: OmniVerdict; operation: OmniOperation; evidenceRef: string | null; costMicros: number } & Governance)
  | ({ ok: false; reason: OmniFailure } & Governance);

export type OmniAuditEvent = {
  traceId: string; operation: string; outcome: 'ok' | OmniFailure;
  verdict?: OmniVerdict; costMicros?: number; attempts: number; durationMs: number;
};

export type OmniConfig = {
  enabled: boolean;
  baseUrl?: string;
  token?: string;
  timeoutMs?: number;
  maxRetries?: number;
  maxResponseBytes?: number;
  maxCostMicros?: number;
  failureThreshold?: number;
  cooldownMs?: number;
  allowLoopback?: boolean; // tests only; production requires https
  productionApproved?: boolean;
  nodeEnv?: string;
  audit?: (event: OmniAuditEvent) => void;
  now?: () => number;
  fetchImpl?: typeof fetch;
};

export function omniConfigFromEnv(env: NodeJS.ProcessEnv): OmniConfig {
  return {
    enabled: env.OMNI_ENABLED === 'true',
    baseUrl: env.OMNI_BASE_URL,
    token: env.OMNI_API_TOKEN,
    nodeEnv: env.NODE_ENV,
    productionApproved: env.AROMIA_OMNI_PRODUCTION_APPROVED === 'true',
  };
}

type Fault = { reason: OmniFailure; retryable: boolean; fault: boolean };
const VERDICTS = new Set<string>(['PASS', 'REVIEW', 'FAIL']);
const OPERATIONS = new Set<string>(['observe_product', 'audit_image', 'creative_cycle']);
const clamp = (v: number | undefined, min: number, max: number, d: number) =>
  Number.isInteger(v) ? Math.min(max, Math.max(min, v as number)) : d;

function validRequest(r: OmniRequest): boolean {
  if (!r || !OPERATIONS.has(r.operation) || !r.subject) return false;
  if (!['image', 'product'].includes(r.subject.kind)) return false;
  if (typeof r.subject.ref !== 'string' || !/^[\w./:-]{1,200}$/.test(r.subject.ref)) return false;
  if (/:\/\/[^/\s]*@/.test(r.subject.ref)) return false; // no credentials embedded in a reference
  if (r.context) {
    const entries = Object.entries(r.context);
    if (entries.length > 10 || entries.some(([k, v]) => !/^[a-z_]{1,40}$/.test(k) || typeof v !== 'string' || v.length > 200)) return false;
  }
  return true;
}

export class OmniAdapter {
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  private readonly maxBytes: number;
  private readonly maxCost: number;
  private readonly threshold: number;
  private readonly cooldownMs: number;
  private readonly now: () => number;
  private readonly doFetch: typeof fetch;
  private url: URL | null = null;
  private disabledReason: OmniFailure | null = null;
  private failures = 0;
  private openedAt: number | null = null;

  constructor(private readonly cfg: OmniConfig) {
    this.timeoutMs = clamp(cfg.timeoutMs, 200, 30_000, 8_000);
    this.maxRetries = clamp(cfg.maxRetries, 0, 1, 1);
    this.maxBytes = clamp(cfg.maxResponseBytes, 1_024, 262_144, 65_536);
    this.maxCost = clamp(cfg.maxCostMicros, 0, 10_000_000, 0); // default: paid work refused
    this.threshold = clamp(cfg.failureThreshold, 1, 20, 3);
    this.cooldownMs = clamp(cfg.cooldownMs, 1_000, 600_000, 30_000);
    this.now = cfg.now ?? (() => Date.now());
    this.doFetch = cfg.fetchImpl ?? fetch;
    if (!cfg.enabled) { this.disabledReason = 'disabled'; return; }
    if (cfg.nodeEnv === 'production' && !cfg.productionApproved) { this.disabledReason = 'not_approved_for_production'; return; }
    try {
      const u = new URL(cfg.baseUrl ?? '');
      const loopback = ['127.0.0.1', 'localhost', '[::1]'].includes(u.hostname);
      const schemeOk = u.protocol === 'https:' || (cfg.allowLoopback === true && u.protocol === 'http:' && loopback);
      if (!schemeOk || u.username || u.password || u.search || u.hash || typeof cfg.token !== 'string' || cfg.token.length < 16) throw new Error('invalid');
      this.url = u;
    } catch {
      this.disabledReason = 'disabled'; // misconfiguration fails closed, no network call, no detail leaked
    }
  }

  get circuit(): 'closed' | 'open' { return this.openedAt === null ? 'closed' : 'open'; }

  async call(request: OmniRequest): Promise<OmniResult> {
    const traceId = randomUUID();
    const started = this.now();
    let attempts = 0;
    const done = (r: OmniResult): OmniResult => {
      try {
        this.cfg.audit?.({
          traceId, operation: String(request?.operation), outcome: r.ok ? 'ok' : r.reason,
          verdict: r.ok ? r.verdict : undefined, costMicros: r.ok ? r.costMicros : undefined,
          attempts, durationMs: Math.max(0, this.now() - started),
        });
      } catch { /* audit sink failures never change behaviour */ }
      return r;
    };
    const fail = (reason: OmniFailure) => done({ ok: false, reason, approval: 'not_granted', publication: 'blocked', traceId });

    if (this.disabledReason || !this.url) return fail(this.disabledReason ?? 'disabled');
    if (!validRequest(request)) return fail('invalid_request');
    if (this.openedAt !== null && this.now() - this.openedAt < this.cooldownMs) return fail('circuit_open');

    const body = JSON.stringify({ contract: OMNI_CONTRACT_VERSION, ...request });
    const idempotencyKey = createHash('sha256').update(body).digest('hex');
    let last: OmniFailure = 'network_error';
    let fault = false;
    for (let i = 0; i <= this.maxRetries; i++) {
      attempts += 1;
      const outcome = await this.once(body, idempotencyKey, traceId);
      if ('result' in outcome) {
        const parsed = outcome.result;
        if (parsed.costMicros > this.maxCost) return fail('budget_exceeded');
        this.failures = 0; this.openedAt = null; // success closes the circuit
        return done({ ok: true, verdict: parsed.verdict, operation: request.operation, evidenceRef: parsed.evidenceRef, costMicros: parsed.costMicros, approval: 'not_granted', publication: 'blocked', traceId });
      }
      last = outcome.reason; fault = outcome.fault;
      if (!outcome.retryable) break;
    }
    // Only transport/server faults trip the breaker; client/contract faults do not.
    if (fault) this.recordFault();
    return fail(last);
  }

  private recordFault() {
    this.failures += 1;
    if (this.failures >= this.threshold || this.openedAt !== null) this.openedAt = this.now();
  }

  private async once(body: string, key: string, traceId: string):
    Promise<{ result: { verdict: OmniVerdict; evidenceRef: string | null; costMicros: number } } | Fault> {
    let res: Response;
    try {
      res = await this.doFetch(this.url!.toString(), {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(this.timeoutMs),
        headers: {
          'content-type': 'application/json', accept: 'application/json',
          authorization: `Bearer ${this.cfg.token}`,
          'x-aromia-trace-id': traceId, 'x-aromia-contract': OMNI_CONTRACT_VERSION,
          'x-aromia-max-cost-micros': String(this.maxCost), 'idempotency-key': key,
        },
        body,
      });
    } catch (e) {
      const name = (e as { name?: string })?.name;
      return { reason: name === 'TimeoutError' || name === 'AbortError' ? 'timeout' : 'network_error', retryable: true, fault: true };
    }
    if (res.status >= 500 || res.status === 429) { await res.body?.cancel().catch(() => undefined); return { reason: 'http_error', retryable: true, fault: res.status >= 500 }; }
    if (!res.ok) { await res.body?.cancel().catch(() => undefined); return { reason: 'http_error', retryable: false, fault: false }; }

    let text: string;
    try {
      const declared = Number(res.headers.get('content-length') ?? 0);
      if (declared > this.maxBytes) { await res.body?.cancel().catch(() => undefined); return { reason: 'response_too_large', retryable: false, fault: false }; }
      const reader = res.body?.getReader();
      if (!reader) return { reason: 'bad_response', retryable: false, fault: false };
      const chunks: Uint8Array[] = []; let total = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > this.maxBytes) { await reader.cancel().catch(() => undefined); return { reason: 'response_too_large', retryable: false, fault: false }; }
        chunks.push(value);
      }
      text = Buffer.concat(chunks).toString('utf8');
    } catch {
      return { reason: 'network_error', retryable: true, fault: true };
    }
    let json: unknown;
    try { json = JSON.parse(text); } catch { return { reason: 'bad_response', retryable: false, fault: false }; }
    const o = json as Record<string, unknown>;
    if (!o || typeof o !== 'object' || Array.isArray(o)) return { reason: 'bad_response', retryable: false, fault: false };
    if (o.contract !== OMNI_CONTRACT_VERSION) return { reason: 'contract_mismatch', retryable: false, fault: false };
    if (typeof o.verdict !== 'string' || !VERDICTS.has(o.verdict)) return { reason: 'bad_response', retryable: false, fault: false };
    const cost = o.costMicros === undefined ? 0 : o.costMicros;
    if (!Number.isSafeInteger(cost) || (cost as number) < 0) return { reason: 'bad_response', retryable: false, fault: false };
    const ref = o.evidenceRef;
    if (ref !== undefined && ref !== null && (typeof ref !== 'string' || ref.length > 300)) return { reason: 'bad_response', retryable: false, fault: false };
    return { result: { verdict: o.verdict as OmniVerdict, evidenceRef: (ref as string | null | undefined) ?? null, costMicros: cost as number } };
  }
}
