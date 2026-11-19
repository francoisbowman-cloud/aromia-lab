// End-to-end in-process smoke of signed Next admin session → real proxy
// → read-only visual routes → fake isolated API response. No external network/DB.
import {afterEach,beforeEach,expect,it,vi} from "vitest";
import {NextRequest} from "next/server";
const sessionState=vi.hoisted(()=>({value:undefined as string|undefined}));
vi.mock("next/headers",()=>({
  cookies:()=>({get:(key:string)=>key==="admin_session" && sessionState.value
    ? {value:sessionState.value}:undefined})
}));
import {createSessionCookieValue} from "./adminAuth";
import {GET as reviewGET} from "@/app/api/admin/intelligence/visual-reviews/route";
import {GET as decisionsGET} from "@/app/api/admin/intelligence/visual-decisions/[observationId]/route";

const reviews=()=>new NextRequest("http://localhost:3000/api/admin/intelligence/visual-reviews?slug=chance-eau-tendre");
const decisions=()=>new NextRequest("http://localhost:3000/api/admin/intelligence/visual-decisions/51");
const decisionParams={params:Promise.resolve({observationId:"51"})};
beforeEach(()=>{
  sessionState.value=undefined;
  vi.stubEnv("ADMIN_SESSION_SECRET","independent-test-session-signing-key-long");
  vi.stubEnv("ADMIN_API_TOKEN","test-only-admin-api-token");
  vi.stubEnv("API_URL","http://127.0.0.1:4400");
  vi.stubEnv("EDITORIAL_REVIEW_TOKEN","not-for-browser-only-server");
});
afterEach(()=>{
  vi.unstubAllEnvs();vi.unstubAllGlobals();sessionState.value=undefined;
});
it("rejects a missing or tampered session before any API call",async()=>{
  const backend=vi.fn();vi.stubGlobal("fetch",backend);
  expect((await reviewGET(reviews())).status).toBe(401);
  expect((await decisionsGET(decisions(),decisionParams)).status).toBe(401);
  sessionState.value="ok.forged";
  expect((await reviewGET(reviews())).status).toBe(401);
  expect(backend).not.toHaveBeenCalled();
});
it("fails closed if a valid session has no configured server API token",async()=>{
  sessionState.value=await createSessionCookieValue();
  vi.stubEnv("ADMIN_API_TOKEN","");
  const backend=vi.fn();vi.stubGlobal("fetch",backend);
  expect((await reviewGET(reviews())).status).toBe(503);
  expect(backend).not.toHaveBeenCalled();
});
it("reads per-perfume observations and per-observation decisions through signed proxy, without granting approval",async()=>{
  sessionState.value=await createSessionCookieValue();
  const backend=vi.fn(async(url:string)=>{
    if(url.endsWith("/intelligence/visual-reviews?slug=chance-eau-tendre"))
      return Response.json({reviews:[{
        id:51,review_id:"review-test-51",product_slug:"chance-eau-tendre",
        image_sha256:"a".repeat(64),product_fingerprint:"b".repeat(64),
        status:"recorded_pending_independent_verification",actor:"publisher_credential",
        operator_note:"Identity, license and image crop are not verified",
        evidence:{identity:"pending",rights:"pending",visual:"pending"},
        recorded_at:"2026-11-17T20:00:00Z"
      }],publication:"blocked",identityVerified:false,rightsVerified:false});
    if(url.endsWith("/intelligence/visual-decisions/51"))
      return Response.json({decisions:[{
        id:7,observation_id:51,decision_key:"test-reject-51",
        decision:"rejected",reason:"Wrong concentration on label",
        actor:"publisher_credential",recorded_at:"2026-11-17T20:10:00Z"
      }],approval:false,publication:"blocked",applied:false});
    return Response.json({error:"unexpected test path"},{status:404});
  });
  vi.stubGlobal("fetch",backend);
  const history=await reviewGET(reviews());
  const decisionsResult=await decisionsGET(decisions(),decisionParams);
  expect(history.status).toBe(200);expect(decisionsResult.status).toBe(200);
  const h=await history.json(),d=await decisionsResult.json();
  expect(h.reviews[0].product_slug).toBe("chance-eau-tendre");
  expect(h.rightsVerified).toBe(false);
  expect(h.identityVerified).toBe(false);
  expect(d.decisions[0].decision).toBe("rejected");
  expect(d.approval).toBe(false);expect(d.applied).toBe(false);
  expect(h.publication).toBe("blocked");
  expect(d.publication).toBe("blocked");
  const calls=backend.mock.calls as unknown as Array<[string,RequestInit]>;
  expect(calls).toHaveLength(2);
  for(const [url,options] of calls){
    expect(url).toMatch(/^http:\/\/127\.0\.0\.1:4400\/api\/admin\/intelligence\/visual-/);
    expect(options.method??"GET").toBe("GET");
    const headers=new Headers(options.headers);
    expect(headers.get("Authorization")).toBe("Bearer test-only-admin-api-token");
    expect(headers.get("x-editorial-review-token")).toBeNull();
    expect(JSON.stringify(options)).not.toContain("not-for-browser-only-server");
  }
});
it("does not proxy malicious identifiers or leak backend on network error",async()=>{
  sessionState.value=await createSessionCookieValue();
  const backend=vi.fn().mockRejectedValue(new Error("backend offline"));
  vi.stubGlobal("fetch",backend);
  const bad=await reviewGET(new NextRequest("http://localhost:3000/api/admin/intelligence/visual-reviews?slug=..%2Fsecret"));
  const badDecision=await decisionsGET(decisions(),{params:Promise.resolve({observationId:"-3"})});
  expect(bad.status).toBe(400);expect(badDecision.status).toBe(400);
  expect(backend).not.toHaveBeenCalled();
  const unavailable=await reviewGET(reviews());
  expect(unavailable.status).toBe(502);
  expect((await unavailable.json()).error).toBeTruthy();
});
