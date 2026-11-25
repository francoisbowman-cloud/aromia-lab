import {beforeEach,expect,it,vi} from "vitest";
import {NextRequest} from "next/server";
const auth=vi.hoisted(()=>vi.fn());
const inspect=vi.hoisted(()=>vi.fn());
vi.mock("@/lib/adminApiProxy",()=>({adminAuthorizationError:auth}));
vi.mock("@/lib/visualEvidence",()=>({inspectLocalVisualAsset:inspect}));
import {GET} from "./route";
beforeEach(()=>{auth.mockReset().mockResolvedValue(null);inspect.mockReset();vi.unstubAllEnvs();});
const req=()=>new NextRequest("http://localhost/api/admin/intelligence/visual-replacement-plan?slug=sample-edt&current=%2Fold.webp&candidate=%2Fnew.webp&reason=Correct+EDT+variant");
it("rejects unauthenticated requests before reading bytes",async()=>{
  auth.mockResolvedValue(new Response(null,{status:401}));
  expect((await GET(req())).status).toBe(401);expect(inspect).not.toHaveBeenCalled();
});
it("requires explicit opt-in for evidence inspection",async()=>{
  vi.stubEnv("VISUAL_EVIDENCE_INSPECTION_ENABLED","");
  expect((await GET(req())).status).toBe(503);expect(inspect).not.toHaveBeenCalled();
});
it("returns a version-locked dry run and never approval",async()=>{
  vi.stubEnv("VISUAL_EVIDENCE_INSPECTION_ENABLED","true");
  inspect.mockImplementation(async(_root:string,url:string)=>({
    url,bytesSha256:url==="/old.webp"?"a".repeat(64):"b".repeat(64),
    width:800,height:600,bytes:12000,format:"webp",
    publication:"blocked",identityVerified:false,rightsVerified:false,visualQualityVerified:false
  }));
  const result=await GET(req());
  expect(result.status).toBe(200);expect(result.headers.get("Cache-Control")).toContain("no-store");
  const data=await result.json();
  expect(data.applied).toBe(false);expect(data.approved).toBe(false);
  expect(data.rollbackProposal.restoreUrl).toBe("/old.webp");
});
it("never exposes mutation handlers",async()=>{
  const handlers=await import("./route");
  expect("POST" in handlers).toBe(false);
  expect("PUT" in handlers).toBe(false);
  expect("DELETE" in handlers).toBe(false);
});
