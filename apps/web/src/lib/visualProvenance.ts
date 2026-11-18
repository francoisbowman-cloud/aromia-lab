// Human-supplied provenance dossier. Validation is not independent verification.
// Immutable identity fields link the draft to the inspected LOCAL asset and catalogue claim.
export type ProvenanceDossier = {
  schemaVersion: 1;
  productSlug: string;
  imageUrl: string;
  imageSha256: string;
  brandClaim: string;
  fragranceClaim: string;
  concentrationClaim: string;
  flankerClaim: string;
  packagingClaim: string;
  sourceUrl: string;
  sourceKind: "manufacturer" | "authorized_retailer" | "original_editorial" | "other";
  rightsBasis: "unknown" | "permission_documented" | "restricted";
  rightsReference: string;
  identityNotes: string;
  visualNotes: string;
};
const DIGEST=/^[a-f0-9]{64}$/;
const SLUG=/^[a-z0-9][a-z0-9._-]{0,159}$/;
const LOCAL=/^\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g|avif|gif)$/i;
const bounded=(s:unknown,max=1600):s is string=>typeof s==="string" && s.trim().length>0 && s.length<=max;
export function validateProvenanceDossier(input:unknown):ProvenanceDossier {
  if(!input || typeof input!=="object")throw new Error("invalid_provenance_dossier");
  const v=input as Partial<ProvenanceDossier>;
  if(v.schemaVersion!==1 || typeof v.productSlug!=="string" || !SLUG.test(v.productSlug) ||
     typeof v.imageUrl!=="string" || !LOCAL.test(v.imageUrl) ||
     v.imageUrl.includes("//") || v.imageUrl.split("/").some(p=>p===".."||p===".") ||
     typeof v.imageSha256!=="string" || !DIGEST.test(v.imageSha256) ||
     !bounded(v.brandClaim,200)||!bounded(v.fragranceClaim,200)||
     !bounded(v.concentrationClaim,120)||!bounded(v.flankerClaim,120)||
     !bounded(v.packagingClaim,300)||!bounded(v.sourceUrl,1500)||
     !bounded(v.rightsReference,1500)||!bounded(v.identityNotes,4000)||
     !bounded(v.visualNotes,4000)||
     !["manufacturer","authorized_retailer","original_editorial","other"].includes(v.sourceKind??"")||
     !["unknown","permission_documented","restricted"].includes(v.rightsBasis??""))
    throw new Error("invalid_provenance_dossier");
  let source:URL;
  try {source=new URL(v.sourceUrl);} catch{throw new Error("invalid_provenance_source");}
  if(source.protocol!=="https:" || source.username || source.password ||
     source.hostname==="localhost" || source.hostname.endsWith(".localhost") ||
     /^\d+\.\d+\.\d+\.\d+$/.test(source.hostname))
    throw new Error("invalid_provenance_source");
  return {
    schemaVersion:1,productSlug:v.productSlug,imageUrl:v.imageUrl,imageSha256:v.imageSha256,
    brandClaim:v.brandClaim.trim(),fragranceClaim:v.fragranceClaim.trim(),
    concentrationClaim:v.concentrationClaim.trim(),flankerClaim:v.flankerClaim.trim(),
    packagingClaim:v.packagingClaim.trim(),sourceUrl:source.href,sourceKind:v.sourceKind!,
    rightsBasis:v.rightsBasis!,rightsReference:v.rightsReference.trim(),
    identityNotes:v.identityNotes.trim(),visualNotes:v.visualNotes.trim()
  };
}
export function assessProvenanceDossier(dossier:ProvenanceDossier) {
  const reasons:string[]=[];
  if(dossier.rightsBasis!=="permission_documented")reasons.push("rights_not_documented_as_permission");
  // Even a documented claim is not verified: separate source/terms validation is mandatory.
  reasons.push("external_rights_validation_pending");
  reasons.push("manufacturer_identity_validation_pending");
  reasons.push("human_visual_review_pending");
  return {reasons,reviewState:"draft_requires_independent_verification" as const,
    identityVerified:false as const,rightsVerified:false as const,
    publication:"blocked" as const};
}
