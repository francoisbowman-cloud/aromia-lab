import {describe,it,expect} from "vitest";
import {planVisualReplacement} from "./visualReplacementPlan";
const old={url:"/assets/old.webp",bytesSha256:"a".repeat(64),width:1200,height:900,bytes:12000,format:"webp"};
const next={url:"/assets/new.webp",bytesSha256:"b".repeat(64),width:1400,height:1000,bytes:20000,format:"webp"};
const input={productSlug:"sample-edt",current:old,candidate:next,reason:"Replace incorrect concentration packshot after human verification"};
describe("reversible replacement planning only",()=>{
  it("is deterministic and never modifies or approves an image",()=>{
    const a=planVisualReplacement(input),b=planVisualReplacement(input);
    expect(a.proposalId).toBe(b.proposalId);
    expect(a.proposalId).toMatch(/^[a-f0-9]{64}$/);
    expect(a.applied).toBe(false);expect(a.approved).toBe(false);expect(a.publication).toBe("blocked");
    expect(a.preconditions.currentFileSha256).toBe(old.bytesSha256);
    expect(a.preconditions.candidateFileSha256).toBe(next.bytesSha256);
    expect(a.rollbackProposal.restoreUrl).toBe(old.url);
    expect(a.rollbackProposal.requiresOriginalBytesPreserved).toBe(true);
  });
  it("rejects missing identity, malicious paths and unverifiable resources",()=>{
    for(const values of [
      {productSlug:"../../oops"},
      {current:{...old,bytesSha256:"url-hash"}},
      {candidate:{...next,url:"https://example.org/bottle.webp"}},
      {candidate:{...next,url:"/../escape.webp"}},
      {reason:"short"},
      {candidate:{...next,height:-1}}
    ])expect(()=>planVisualReplacement({...input,...values})).toThrow("invalid_visual_replacement_proposal");
  });
  it("rejects same path or same actual bytes",()=>{
    expect(()=>planVisualReplacement({...input,candidate:{...next,url:old.url}})).toThrow("distinct_candidate");
    expect(()=>planVisualReplacement({...input,candidate:{...next,bytesSha256:old.bytesSha256}})).toThrow("identical_bytes");
  });
  it("changes the proposal id when either image changes",()=>{
    const a=planVisualReplacement(input);
    const b=planVisualReplacement({...input,current:{...old,bytesSha256:"c".repeat(64)}});
    expect(a.proposalId).not.toBe(b.proposalId);
  });
});
