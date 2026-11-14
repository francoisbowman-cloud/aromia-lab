import { afterEach, expect, it, vi } from 'vitest';
const auth = vi.hoisted(() => vi.fn());
vi.mock('next/headers', () => ({ cookies: () => ({ get: () => ({ value: 'fixture-session' }) }) }));
vi.mock('./adminAuth', () => ({ ADMIN_SESSION_COOKIE: 'admin_session', isValidSessionCookie: auth }));
import { proxyToAdminApi } from './adminApiProxy';
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); auth.mockReset(); });
it('rejects unauthenticated requests without contacting the backend', async () => {
  auth.mockResolvedValue(false); const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
  expect((await proxyToAdminApi('/articles')).status).toBe(401);
  expect(fetch).not.toHaveBeenCalled();
});
it('does not send an undefined admin token to the backend', async () => {
  auth.mockResolvedValue(true); vi.stubEnv('ADMIN_API_TOKEN', '');
  const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
  expect((await proxyToAdminApi('/articles')).status).toBe(503);
  expect(fetch).not.toHaveBeenCalled();
});
it('preserves HTTP conflict responses and Headers when using an isolated API', async () => {
  auth.mockResolvedValue(true); vi.stubEnv('ADMIN_API_TOKEN', 'fixture-token'); vi.stubEnv('API_URL', 'http://localhost:4100/');
  const fetch = vi.fn().mockResolvedValue(Response.json({ error: 'Duplicate slug' }, { status: 409 })); vi.stubGlobal('fetch', fetch);
  expect((await proxyToAdminApi('/articles', { method: 'POST', headers: new Headers({ 'Content-Type': 'application/json' }) })).status).toBe(409);
  const [url,init] = fetch.mock.calls[0];
  expect(url).toBe('http://localhost:4100/api/admin/articles');
  expect(init.headers.get('Content-Type')).toBe('application/json');
  expect(init.headers.get('Authorization')).toBe('Bearer fixture-token');
});
it('returns a recoverable gateway response on backend failure', async () => {
  auth.mockResolvedValue(true); vi.stubEnv('ADMIN_API_TOKEN', 'fixture-token');
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  const response = await proxyToAdminApi('/articles');
  expect(response.status).toBe(502); expect(await response.json()).toHaveProperty('error');
});
