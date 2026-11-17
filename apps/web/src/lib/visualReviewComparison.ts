// Pure comparison of file bytes with *unverified journal assertions*.
// Matching hashes only confirms equal bytes to an operator-entered claim;
// it does not establish that the image depicts the searched product or has usable rights.
export type VisualClaim = {
  product_slug:string;
  image_sha256:string;
  review_id:string;
};
export type VisualEvidenceComparison = {
  state:"no_history"|"match_claimed_digest"|"no_matching_claimed_digest";
  comparedClaims:number;
  matchingReviewIds:string[];
  mismatchingReviewIds:string[];
  identityVerified:false;
  rightsVerified:false;
  publication:"blocked";
};
const sha=/^[a-f0-9]{64}$/;
const slug=/^[a-z0-9][a-z0-9._-]{0,159}$/;
export function compareVisualClaims(productSlug:string, imageBytesSha256:string,
  history:readonly VisualClaim[]):VisualEvidenceComparison {
  if(!slug.test(productSlug) || !sha.test(imageBytesSha256) || !Array.isArray(history))
    throw new Error("invalid_visual_comparison_input");
  const considered=history.filter(r=>r?.product_slug===productSlug && sha.test(r.image_sha256)
    && typeof r.review_id==="string" && r.review_id.length>0);
  const matching=considered.filter(r=>r.image_sha256===imageBytesSha256).map(r=>r.review_id);
  const mismatching=considered.filter(r=>r.image_sha256!==imageBytesSha256).map(r=>r.review_id);
  return {
    state:considered.length===0?"no_history":matching.length?"match_claimed_digest":"no_matching_claimed_digest",
    comparedClaims:considered.length, matchingReviewIds:matching, mismatchingReviewIds:mismatching,
    identityVerified:false, rightsVerified:false, publication:"blocked",
  };
}
