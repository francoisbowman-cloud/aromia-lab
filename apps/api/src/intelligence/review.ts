import { createHash } from 'node:crypto';
import { artifactKinds } from './artifacts';
export type BundleArtifact={id:string|number;kind:string;version:number;content:string;source_urls:string[]};
export type SourceEvidence={id:string|number;url:string;sha256:string;excerpt_found:boolean};
export function bundleOf(jobId:string,artifacts:BundleArtifact[],sources:SourceEvidence[]) {
  const latest=new Map<string,BundleArtifact>();
  for(const a of artifacts) if(!latest.has(a.kind)||latest.get(a.kind)!.version<a.version)latest.set(a.kind,a);
  const selected=[...latest.values()].sort((a,b)=>a.kind.localeCompare(b.kind));
  const ordered=[...sources].sort((a,b)=>a.url.localeCompare(b.url)||a.sha256.localeCompare(b.sha256));
  const blockers=artifactKinds.filter(k=>!latest.has(k)).map(k=>`missing:${k}`);
  for(const url of new Set(selected.flatMap(a=>a.source_urls))) if(!ordered.some(s=>s.url===url&&s.excerpt_found)) blockers.push(`source_not_captured:${url}`);
  const manifest={version:1,jobId,artifacts:selected,sources:ordered};
  return {...manifest,hash:createHash('sha256').update(JSON.stringify(manifest)).digest('hex'),blockers,publication:'blocked',humanReviewRequired:true};
}
