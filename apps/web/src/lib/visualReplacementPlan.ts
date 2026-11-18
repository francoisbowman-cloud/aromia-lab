// Read-only replacement simulation. No asset write, CMS change or release authorization.
// The inverse step is a *proposal*: actual rollback needs immutable source preservation.
import { createHash } from "node:crypto";
type Asset={url:string;bytesSha256:string;width:number;height:number;format:string;bytes:number};
type ReplacementInput={productSlug:string;current:Asset;candidate:Asset;reason:string};
const SLUG=/^[a-z0-9][a-z0-9._-]{0,159}$/;
const HEX=/^[0-9a-f]{64}$/;
const PATH=/^\/[A-Za-z0-9_./-]+\.(?:webp|png|jpe?g|avif|gif)$/i;
function valid(a:Asset):boolean {
  return !!a && typeof a.url==="string" && PATH.test(a.url) &&
    !a.url.includes("//") && !a.url.split("/").some(x=>x===".."||x===".") &&
    typeof a.bytesSha256==="string"&&HEX.test(a.bytesSha256) &&
    Number.isSafeInteger(a.width)&&a.width>0 &&
    Number.isSafeInteger(a.height)&&a.height>0 &&
    Number.isSafeInteger(a.bytes)&&a.bytes>0 &&
    ["png","jpeg","webp","avif","gif"].includes(a.format);
}
export function planVisualReplacement(input:ReplacementInput) {
  if(!input||!SLUG.test(input.productSlug)||!valid(input.current)||!valid(input.candidate)||
     typeof input.reason!=="string"||input.reason.trim().length<10||input.reason.length>3000)
    throw new Error("invalid_visual_replacement_proposal");
  if(input.current.url===input.candidate.url)
    throw new Error("replacement_requires_distinct_candidate_file");
  if(input.current.bytesSha256===input.candidate.bytesSha256)
    throw new Error("replacement_identical_bytes");
  const planned={
    schemaVersion:1,
    productSlug:input.productSlug,
    oldAsset:{...input.current},
    proposedAsset:{...input.candidate},
    editorialReason:input.reason.trim(),
    preconditions:{
      currentFileSha256:input.current.bytesSha256,
      candidateFileSha256:input.candidate.bytesSha256,
      identityAndConcentration:"independent_review_required",
      usageRights:"independent_review_required",
      visualQA:"independent_review_required",
      deploymentApproval:"explicit_authorization_required",
    },
    rollbackProposal:{
      restoreUrl:input.current.url,
      restoreSha256:input.current.bytesSha256,
      requiresOriginalBytesPreserved:true,
      requiresNewReviewAndAuthorization:true,
    },
    outcome:"dry_run_only",
    applied:false,
    approved:false,
    publication:"blocked",
  } as const;
  const proposalId=createHash("sha256").update(JSON.stringify(planned)).digest("hex");
  return {proposalId,...planned};
}
