import { createHash } from 'node:crypto';
const hosts = new Set(['raw.githubusercontent.com','en.wikipedia.org','pmc.ncbi.nlm.nih.gov']);
export function sourceUrl(value:string) {
  const url=new URL(value);
  if(url.protocol!=='https:' || !hosts.has(url.hostname) || url.username || url.password || url.port || url.hash) throw new Error('source_not_allowed');
  if(url.hostname==='raw.githubusercontent.com' && !/^\/francoisbowman-cloud\/aromia-lab\/[a-f0-9]{40}\//.test(url.pathname)) throw new Error('source_requires_pinned_repository');
  return url;
}
export async function retrieveSource(url:string, excerpt:string, transport:typeof fetch=fetch) {
  sourceUrl(url);
  const response=await transport(url,{redirect:'error',signal:AbortSignal.timeout(15000),headers:{Accept:'text/plain,text/html,text/markdown'}});
  if(!response.ok || !response.body) throw new Error('source_unavailable');
  const type=response.headers.get('content-type')??'';
  if(!/^text\/(plain|html|markdown)(;|$)/i.test(type)) {await response.body.cancel();throw new Error('source_content_type');}
  const reader=response.body.getReader();const chunks:Uint8Array[]=[];let size=0;
  try {while(true) {const r=await reader.read();if(r.done)break;size+=r.value.length;if(size>1048576)throw new Error('source_too_large');chunks.push(r.value);}}
  finally {await reader.cancel();}
  const bytes=Buffer.concat(chunks),content=bytes.toString('utf8');
  return {url,content,sha256:createHash('sha256').update(bytes).digest('hex'),excerptFound:content.replace(/\s+/g,' ').includes(excerpt.replace(/\s+/g,' '))};
}
