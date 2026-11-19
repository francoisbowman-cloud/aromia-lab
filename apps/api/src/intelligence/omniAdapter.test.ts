import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { OmniAdapter, OMNI_CONTRACT_VERSION, omniConfigFromEnv, type OmniAuditEvent, type OmniConfig } from './omniAdapter';

// The "OMNI" here is a loopback test double. These tests prove the adapter's safety
// behaviour against a hypothetical contract, NOT that a real OMNI deployment exists.
const TOKEN = 'test-token-0123456789-abcdef';
const REQ = { operation: 'audit_image' as const, subject: { kind: 'image' as const, ref: 'perfumes/santal-33.webp' } };
type Handler = (req: IncomingMessage, res: ServerResponse, body: string) => void;

async function omni(handler: Handler) {
  const seen: { headers: IncomingMessage['headers']; body: string }[] = [];
  const server = createServer((req, res) => {
    let body = ''; req.on('data', c => (body += c));
    req.on('end', () => { seen.push({ headers: req.headers, body }); handler(req, res, body); });
  });
  await new Promise<void>(r => server.listen(0, '127.0.0.1', r));
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/v1/evaluate`;
  return { url, seen, close: () => new Promise<void>(r => { server.closeAllConnections(); server.close(() => r()); }) };
}
const json = (res: ServerResponse, status: number, obj: unknown) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj)); };
const okBody = (extra: object = {}) => ({ contract: OMNI_CONTRACT_VERSION, verdict: 'PASS', evidenceRef: 'ev-1', ...extra });
const cfg = (url: string, extra: Partial<OmniConfig> = {}): OmniConfig =>
  ({ enabled: true, baseUrl: url, token: TOKEN, allowLoopback: true, timeoutMs: 400, nodeEnv: 'test', ...extra });

test('disabled, unconfigured, insecure or unapproved-production adapters never touch the network', async () => {
  const srv = await omni((_q, res) => json(res, 200, okBody()));
  try {
    const cases: OmniConfig[] = [
      { enabled: false, baseUrl: srv.url, token: TOKEN, allowLoopback: true },
      { enabled: true, token: TOKEN },
      { enabled: true, baseUrl: srv.url, token: TOKEN }, // http without allowLoopback
      { enabled: true, baseUrl: 'http://example.org/x', token: TOKEN, allowLoopback: true }, // non-loopback http
      { enabled: true, baseUrl: 'https://user:pw@omni.example.org/x', token: TOKEN },
      { enabled: true, baseUrl: 'https://omni.example.org/x?k=v', token: TOKEN },
      { enabled: true, baseUrl: 'https://omni.example.org/x', token: 'short' },
      { ...cfg(srv.url), nodeEnv: 'production' }, // production without explicit approval
    ];
    for (const c of cases) {
      const r = await new OmniAdapter(c).call(REQ);
      assert.equal(r.ok, false);
      assert.equal(r.approval, 'not_granted');
      assert.equal(r.publication, 'blocked');
    }
    assert.equal(srv.seen.length, 0);
    assert.equal(omniConfigFromEnv({}).enabled, false, 'off by default');
    assert.equal(omniConfigFromEnv({ OMNI_ENABLED: '1' }).enabled, false);
    assert.equal((await new OmniAdapter({ ...cfg(srv.url), nodeEnv: 'production', productionApproved: true }).call(REQ)).ok, true);
  } finally { await srv.close(); }
});

test('verdicts are evidence only: PASS, REVIEW and FAIL never grant approval or publication', async () => {
  let verdict = 'PASS';
  const srv = await omni((_q, res) => json(res, 200, okBody({ verdict })));
  const events: OmniAuditEvent[] = [];
  try {
    const adapter = new OmniAdapter(cfg(srv.url, { audit: e => events.push(e) }));
    for (verdict of ['PASS', 'REVIEW', 'FAIL']) {
      const r = await adapter.call(REQ);
      assert.ok(r.ok && r.verdict === verdict);
      assert.equal(r.approval, 'not_granted');
      assert.equal(r.publication, 'blocked');
    }
    const h = srv.seen[0].headers;
    assert.equal(h.authorization, `Bearer ${TOKEN}`);
    assert.equal(h['x-aromia-contract'], OMNI_CONTRACT_VERSION);
    assert.equal(h['x-aromia-max-cost-micros'], '0');
    assert.match(String(h['x-aromia-trace-id']), /^[0-9a-f-]{36}$/);
    assert.equal(srv.seen[0].headers['idempotency-key'], srv.seen[1].headers['idempotency-key'], 'same request, same idempotency key');
    assert.equal(events.length, 3);
    assert.ok(events.every(e => e.outcome === 'ok' && e.attempts === 1));
    assert.ok(!JSON.stringify(events).includes(TOKEN), 'token never reaches the audit trail');
  } finally { await srv.close(); }
});

test('malformed, mismatched, oversized and costly responses are rejected, never treated as PASS', async () => {
  const bodies: Array<[string, (res: ServerResponse) => void, string]> = [
    ['contract mismatch', res => json(res, 200, { ...okBody(), contract: 'aromia-omni/9' }), 'contract_mismatch'],
    ['unknown verdict', res => json(res, 200, okBody({ verdict: 'APPROVED' })), 'bad_response'],
    ['not json', res => { res.writeHead(200); res.end('<html>'); }, 'bad_response'],
    ['array', res => json(res, 200, [okBody()]), 'bad_response'],
    ['negative cost', res => json(res, 200, okBody({ costMicros: -1 })), 'bad_response'],
    ['fractional cost', res => json(res, 200, okBody({ costMicros: 1.5 })), 'bad_response'],
    ['evidenceRef wrong type', res => json(res, 200, okBody({ evidenceRef: { a: 1 } })), 'bad_response'],
    ['oversized stream', res => { res.writeHead(200); res.write('x'.repeat(40_000)); res.end('y'.repeat(40_000)); }, 'response_too_large'],
    ['paid work with zero budget', res => json(res, 200, okBody({ costMicros: 5 })), 'budget_exceeded'],
  ];
  for (const [name, respond, reason] of bodies) {
    const srv = await omni((_q, res) => respond(res));
    try {
      const r = await new OmniAdapter(cfg(srv.url, { maxResponseBytes: 32_768 })).call(REQ);
      assert.ok(!r.ok && r.reason === reason, `${name}: got ${JSON.stringify(r)}`);
    } finally { await srv.close(); }
  }
  const srv = await omni((_q, res) => json(res, 200, okBody({ costMicros: 5 })));
  try {
    const r = await new OmniAdapter(cfg(srv.url, { maxCostMicros: 10 })).call(REQ);
    assert.ok(r.ok && r.costMicros === 5, 'explicit budget allows bounded cost');
  } finally { await srv.close(); }
});

test('timeouts and 5xx retry once with the same idempotency key; 4xx does not retry', async () => {
  let n = 0;
  const flaky = await omni((_q, res) => { n += 1; if (n === 1) json(res, 503, {}); else json(res, 200, okBody()); });
  try {
    const events: OmniAuditEvent[] = [];
    const r = await new OmniAdapter(cfg(flaky.url, { audit: e => events.push(e) })).call(REQ);
    assert.ok(r.ok);
    assert.equal(events[0].attempts, 2);
    assert.equal(flaky.seen[0].headers['idempotency-key'], flaky.seen[1].headers['idempotency-key']);
  } finally { await flaky.close(); }

  const slow = await omni(() => { /* never answers */ });
  try {
    const events: OmniAuditEvent[] = [];
    const r = await new OmniAdapter(cfg(slow.url, { timeoutMs: 250, audit: e => events.push(e) })).call(REQ);
    assert.ok(!r.ok && r.reason === 'timeout');
    assert.equal(events[0].attempts, 2);
  } finally { await slow.close(); }

  const bad = await omni((_q, res) => json(res, 400, { error: 'secret detail' }));
  try {
    const events: OmniAuditEvent[] = [];
    const r = await new OmniAdapter(cfg(bad.url, { audit: e => events.push(e) })).call(REQ);
    assert.ok(!r.ok && r.reason === 'http_error');
    assert.equal(events[0].attempts, 1);
    assert.ok(!JSON.stringify(r).includes('secret detail'), 'upstream error text is never surfaced');
  } finally { await bad.close(); }
});

test('circuit breaker opens after repeated faults, skips the network, and recovers after cooldown', async () => {
  let healthy = false;
  const srv = await omni((_q, res) => (healthy ? json(res, 200, okBody()) : json(res, 500, {})));
  let t = 1_000_000;
  try {
    const adapter = new OmniAdapter(cfg(srv.url, { failureThreshold: 2, cooldownMs: 5_000, maxRetries: 0, now: () => t }));
    assert.ok(!(await adapter.call(REQ)).ok);
    assert.equal(adapter.circuit, 'closed');
    assert.ok(!(await adapter.call(REQ)).ok);
    assert.equal(adapter.circuit, 'open');
    const hits = srv.seen.length;
    const blocked = await adapter.call(REQ);
    assert.ok(!blocked.ok && blocked.reason === 'circuit_open');
    assert.equal(srv.seen.length, hits, 'open circuit does not call OMNI');

    t += 5_001; // cooldown elapsed: one trial. It fails -> re-opens immediately.
    assert.ok(!(await adapter.call(REQ)).ok);
    assert.equal(adapter.circuit, 'open');
    assert.equal((await adapter.call(REQ)).ok, false);

    t += 5_001; healthy = true;
    assert.ok((await adapter.call(REQ)).ok);
    assert.equal(adapter.circuit, 'closed');
  } finally { await srv.close(); }

  // Client/contract errors must not trip the breaker.
  const bad = await omni((_q, res) => json(res, 404, {}));
  try {
    const adapter = new OmniAdapter(cfg(bad.url, { failureThreshold: 1, maxRetries: 0 }));
    for (let i = 0; i < 3; i++) await adapter.call(REQ);
    assert.equal(adapter.circuit, 'closed');
  } finally { await bad.close(); }
});

test('redirects are not followed, invalid requests are refused locally, and fetch errors degrade without throwing', async () => {
  const target = await omni((_q, res) => json(res, 200, okBody()));
  const redirector = await omni((_q, res) => { res.writeHead(302, { location: target.url }); res.end(); });
  try {
    const r = await new OmniAdapter(cfg(redirector.url, { maxRetries: 0 })).call(REQ);
    assert.ok(!r.ok && r.reason === 'network_error');
    assert.equal(target.seen.length, 0, 'redirect target was never contacted');

    const adapter = new OmniAdapter(cfg(target.url));
    for (const bad of [
      { ...REQ, operation: 'apply_changes' },
      { ...REQ, subject: { kind: 'image', ref: 'https://user:pw@host/x.png' } },
      { ...REQ, subject: { kind: 'image', ref: '../../etc/passwd; rm' } },
      { ...REQ, subject: { kind: 'user', ref: 'a' } },
      { ...REQ, context: { 'Bad Key': 'x' } },
      { ...REQ, context: { ok: 'x'.repeat(201) } },
    ]) {
      const res = await adapter.call(bad as never);
      assert.ok(!res.ok && res.reason === 'invalid_request');
    }
    assert.equal(target.seen.length, 0, 'invalid requests never leave the process');

    const exploding = new OmniAdapter(cfg(target.url, { fetchImpl: (async () => { throw new Error(`boom ${TOKEN}`); }) as never, maxRetries: 0 }));
    const r2 = await exploding.call(REQ);
    assert.ok(!r2.ok && r2.reason === 'network_error');
    assert.ok(!JSON.stringify(r2).includes(TOKEN));
  } finally { await redirector.close(); await target.close(); }
});
