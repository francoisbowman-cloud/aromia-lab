import { afterEach, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../app/api/auth/login/route';
afterEach(() => vi.unstubAllEnvs());
function request(body: string) { return new NextRequest('http://localhost/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }); }
it('rejects malformed login JSON without a server error', async () => {
  expect((await POST(request('{'))).status).toBe(400);
});
it('fails closed with a useful response when admin setup is missing', async () => {
  vi.stubEnv('ADMIN_PASSWORD',''); vi.stubEnv('ADMIN_SESSION_SECRET','');
  expect((await POST(request('{"password":"fixture"}'))).status).toBe(503);
});
it('does not issue a session for the wrong password', async () => {
  vi.stubEnv('ADMIN_PASSWORD','fixture-password'); vi.stubEnv('ADMIN_SESSION_SECRET','fixture-secret');
  const res=await POST(request('{"password":"wrong"}'));
  expect(res.status).toBe(401); expect(res.cookies.get('admin_session')).toBeUndefined();
});
