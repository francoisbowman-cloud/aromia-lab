import { afterEach, expect, it, vi } from 'vitest';
import { GET } from '../app/uploads/[...path]/route';
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
it('serves API-uploaded images through the same-origin web URL', async () => {
  vi.stubEnv('API_URL','http://localhost:4000');
  const fetch = vi.fn().mockResolvedValue(new Response(new Uint8Array([1,2,3]),{headers:{'content-type':'image/png'}}));vi.stubGlobal('fetch',fetch);
  const response=await GET(new Request('http://localhost/uploads/articles/file.png'),{params:{path:['articles','file.png']}});
  expect(fetch.mock.calls[0][0]).toBe('http://localhost:4000/uploads/articles/file.png');
  expect(response.status).toBe(200);expect(response.headers.get('x-content-type-options')).toBe('nosniff');
  expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array([1,2,3]));
});
it('does not turn the image transport into an arbitrary path proxy',async()=>{
  const fetch=vi.fn();vi.stubGlobal('fetch',fetch);
  expect((await GET(new Request('http://localhost/uploads'),{params:{path:['articles','..','private.png']}})).status).toBe(404);
  expect(fetch).not.toHaveBeenCalled();
});
it('rejects active content even if the URL has an image extension',async()=>{
  vi.stubEnv('API_URL','http://localhost:4000');vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('<script/>',{headers:{'content-type':'text/html'}})));
  expect((await GET(new Request('http://localhost/uploads/articles/file.png'),{params:{path:['articles','file.png']}})).status).toBe(415);
});
it('keeps absent media distinct from an unavailable transport',async()=>{
  vi.stubEnv('API_URL','http://localhost:4000');const fetch=vi.fn().mockResolvedValueOnce(new Response(null,{status:404})).mockRejectedValueOnce(new Error('offline'));vi.stubGlobal('fetch',fetch);
  const req=new Request('http://localhost/uploads/articles/file.png');const ctx={params:{path:['articles','file.png']}};
  expect((await GET(req,ctx)).status).toBe(404);expect((await GET(req,ctx)).status).toBe(502);
});
