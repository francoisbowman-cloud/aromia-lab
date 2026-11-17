import { afterEach, expect, it, vi } from 'vitest';
const mocks=vi.hoisted(()=>({authorize:vi.fn(),proxy:vi.fn()}));
vi.mock('./adminApiProxy',()=>({adminAuthorizationError:mocks.authorize,proxyToAdminApi:mocks.proxy}));
import { proxyAdminImage } from './adminImageProxy';
afterEach(()=>{vi.resetAllMocks();});
it('authorizes before parsing an upload body',async()=>{
  mocks.authorize.mockResolvedValue(new Response(null,{status:401}));
  const req=new Request('http://localhost/upload',{method:'POST',body:'untrusted'});const parse=vi.spyOn(req,'formData');
  expect((await proxyAdminImage(req,'/articles/1/image')).status).toBe(401);expect(parse).not.toHaveBeenCalled();
});
it('rejects an oversized declared request before buffering it',async()=>{
  mocks.authorize.mockResolvedValue(null);const req=new Request('http://localhost/upload',{method:'POST',headers:{'content-length':String(6*1024*1024)}});const parse=vi.spyOn(req,'formData');
  expect((await proxyAdminImage(req,'/articles/1/image')).status).toBe(413);expect(parse).not.toHaveBeenCalled();
});
it('forwards the image and chosen social-card field after authorization',async()=>{
  mocks.authorize.mockResolvedValue(null);mocks.proxy.mockResolvedValue(new Response('{}'));
  const body=new FormData();body.append('image',new Blob(['fixture'],{type:'image/png'}),'fixture.png');body.append('field','og');
  await proxyAdminImage(new Request('http://localhost/upload',{method:'POST',body}),'/articles/1/image');
  expect(mocks.proxy.mock.calls[0][1].body.get('field')).toBe('og');expect(mocks.proxy.mock.calls[0][1].body.get('image').type).toBe('image/png');
});
