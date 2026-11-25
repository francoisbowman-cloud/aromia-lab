import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { AROMIA_TRACKED_PRS, fetchAromiaPrStatuses } from "./githubProgress.server";
afterEach(()=>{ vi.unstubAllGlobals(); });
beforeEach(()=>vi.restoreAllMocks());

it("fetches only fixed repository PRs and never treats open drafts as merged",async()=>{
  const fetchMock=vi.fn(async (url:string)=> {
    const number=Number(url.split("/").at(-1));
    return Response.json({
      number, state:number===186?"closed":"open", draft:number!==186,
      merged_at:number===186?"2026-11-17T12:00:00Z":null,
      html_url:`https://github.com/francoisbowman-cloud/aromia-lab/pull/${number}`,
      title:"Test pull request",updated_at:"2026-11-17T12:00:00Z",
      head:{sha:"a".repeat(40)}
    });
  });
  vi.stubGlobal("fetch",fetchMock);
  const result=await fetchAromiaPrStatuses();
  expect(result.length).toBe(AROMIA_TRACKED_PRS.length);
  expect(result.find(p=>p.number===186)?.state).toBe("merged");
  expect(result.find(p=>p.number===195)?.state).toBe("draft");
  expect(result.every(p=>p.ci==="not_checked")).toBe(true);
  expect(fetchMock.mock.calls.every(c=>String(c[0]).startsWith("https://api.github.com/repos/francoisbowman-cloud/aromia-lab/pulls/"))).toBe(true);
});
it("rejects mismatched URLs and cannot accept unrelated repo metadata",async()=>{
  vi.stubGlobal("fetch",vi.fn().mockImplementation(async () => Response.json({
    number:186,state:"open",draft:false,merged_at:null,
    html_url:"https://github.com/evil/example/pull/186",
    title:"Malicious",updated_at:"2026-11-17T12:00:00Z",head:{sha:"a".repeat(40)}
  })));
  await expect(fetchAromiaPrStatuses()).rejects.toThrow("github_progress_invalid_response");
});
it("fails closed on GitHub errors rather than synthesizing a green milestone",async()=>{
  vi.stubGlobal("fetch",vi.fn().mockResolvedValue(new Response(null,{status:403})));
  await expect(fetchAromiaPrStatuses()).rejects.toThrow("github_progress_unavailable");
});
