import { afterEach, expect, it, vi } from 'vitest';
import { adminRequest } from './adminRequest';
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });
it('rejects an HTTP failure rather than using its error body as article data', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ error: 'Unauthorized' }, { status: 401 })));
  await expect(adminRequest('/api/admin/articles')).rejects.toThrow('401');
});
it('bounds a stalled save request so the caller can leave its saving state', async () => {
  vi.useFakeTimers();
  vi.stubGlobal('fetch', vi.fn((_url,init) => new Promise((_resolve,reject) => init.signal.addEventListener('abort', () => reject(new DOMException('Aborted','AbortError'))))));
  const result = expect(adminRequest('/api/admin/articles')).rejects.toThrow('Aborted');
  await vi.advanceTimersByTimeAsync(10000); await result; expect(vi.getTimerCount()).toBe(0);
});
