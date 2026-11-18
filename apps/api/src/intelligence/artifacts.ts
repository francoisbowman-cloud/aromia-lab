export const artifactKinds = ['research_note','draft','fact_check','edit','art_brief','qa_report'] as const;
export type ArtifactInput = {kind:typeof artifactKinds[number];content:string;sourceUrls:string[];expectedVersion:number};
export function validateArtifact(value:unknown): ArtifactInput {
  const a = value as ArtifactInput;
  if (!a || !artifactKinds.includes(a.kind) || typeof a.content !== 'string' || !a.content.trim() || a.content.length > 100000 || !Array.isArray(a.sourceUrls) || a.sourceUrls.length<1 || a.sourceUrls.length>20 || a.sourceUrls.some(s=>typeof s!=='string') || !Number.isInteger(a.expectedVersion) || a.expectedVersion<0) throw new Error('invalid_artifact');
  return {kind:a.kind,content:a.content,sourceUrls:[...new Set(a.sourceUrls)],expectedVersion:a.expectedVersion};
}
