import { afterEach, expect, it, vi } from 'vitest';
import { getPerfumes } from './api';

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

it('uses an explicit API_URL for a production-mode local release candidate', async () => {
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('API_URL', 'http://localhost:4000/');
  const fetch = vi.fn().mockResolvedValue(Response.json([]));
  vi.stubGlobal('fetch', fetch);
  await getPerfumes();
  expect(fetch).toHaveBeenCalledWith('http://localhost:4000/api/perfumes', expect.anything());
  expect(fetch).toHaveBeenCalledTimes(1);
});

it('preserves the private Railway default when production has no explicit override', async () => {
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('API_URL', '');
  const fetch = vi.fn().mockResolvedValue(Response.json([]));
  vi.stubGlobal('fetch', fetch);
  await getPerfumes();
  expect(fetch).toHaveBeenCalledWith('http://api.railway.internal:4000/api/perfumes', expect.anything());
});

it('uses the configured development API instead of production', async () => {
  vi.stubEnv('NODE_ENV', 'development');
  vi.stubEnv('API_URL', '');
  vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:4100/');
  const fetch = vi.fn().mockResolvedValue(Response.json([]));
  vi.stubGlobal('fetch', fetch);
  await getPerfumes();
  expect(fetch).toHaveBeenCalledWith('http://localhost:4100/api/perfumes', expect.anything());
});
