#!/usr/bin/env node
// Local HTTP runtime smoke for built Next.js admin. No external services, credentials
// or production data. This checks actual Next middleware and API routes over HTTP.
import { createHmac } from "node:crypto";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";
import assert from "node:assert/strict";

const WEB = fileURLToPath(new URL("../../apps/web/", import.meta.url));
const NEXT = fileURLToPath(new URL("../../apps/web/node_modules/next/dist/bin/next", import.meta.url));
const secret = "aromia-runtime-smoke-session-key-no-production-data";
const adminToken = "aromia-runtime-smoke-backend-token";
const cookie = "ok." + createHmac("sha256",secret).update("ok").digest("hex");
const responses = [];
function bindEphemeral(server) {
  return new Promise((resolve,reject)=>{
    server.once("error",reject);
    server.listen(0,"127.0.0.1",()=>{
      server.off("error",reject);
      resolve(server.address().port);
    });
  });
}
async function allocateEphemeralPort() {
  const server = createServer((_req,res)=>res.end("not ready"));
  const port = await bindEphemeral(server);
  await new Promise(resolve=>server.close(resolve));
  return port;
}
const mock = createServer((req,res)=>{
  const authorization = req.headers.authorization === `Bearer ${adminToken}`;
  const safe = req.method === "GET" && !("x-editorial-review-token" in req.headers);
  responses.push({url:req.url,authorized:authorization,method:req.method,safe});
  res.setHeader("Content-Type","application/json");
  res.setHeader("Cache-Control","no-store");
  if(!authorization || !safe) {res.statusCode=403;res.end(JSON.stringify({error:"unauthorized smoke request"}));return;}
  if(req.url === "/api/admin/intelligence/visual-reviews?slug=chance-eau-tendre"){
    res.end(JSON.stringify({reviews:[{
      id:51,product_slug:"chance-eau-tendre",review_id:"smoke-test-review",
      product_fingerprint:"a".repeat(64),image_sha256:"b".repeat(64),
      operator_note:"Wrong EDT label — image not authorized",
      evidence:{identity:"not verified",rights:"not verified",visual:"mismatch"},
      status:"recorded_pending_independent_verification",actor:"publisher_credential",
      recorded_at:"2026-11-17T20:00:00Z"
    }],publication:"blocked",identityVerified:false,rightsVerified:false}));return;
  }
  if(req.url === "/api/admin/intelligence/visual-decisions/51"){
    res.end(JSON.stringify({decisions:[{
      id:9,observation_id:51,decision_key:"smoke-rejection",
      decision:"rejected",reason:"Concentration and label differ from actual product",
      actor:"publisher_credential",recorded_at:"2026-11-17T20:00:00Z"
    }],approval:false,publication:"blocked",applied:false}));return;
  }
  res.statusCode=404;res.end(JSON.stringify({error:"fixture route missing"}));
});
let child;
let captured="";
async function request(base,path,session,method="GET") {
  const headers = session ? {Cookie:`admin_session=${session}`} : {};
  return fetch(`${base}${path}`,{headers,method,redirect:"manual",signal:AbortSignal.timeout(7000)});
}
try {
  const apiPort=await bindEphemeral(mock);
  const webPort=await allocateEphemeralPort();
  const env={...process.env,PORT:String(webPort),HOSTNAME:"127.0.0.1",
    API_URL:`http://127.0.0.1:${apiPort}`,
    ADMIN_SESSION_SECRET:secret,ADMIN_API_TOKEN:adminToken,
    INTELLIGENCE_ENABLED:"true",VISUAL_REVIEW_JOURNAL_ENABLED:"true",
    VISUAL_EVIDENCE_INSPECTION_ENABLED:"false",
    GITHUB_PROGRESS_TOKEN:"",EDITORIAL_REVIEW_TOKEN:"",
    NODE_ENV:"production",NEXT_TELEMETRY_DISABLED:"1"};
  child=spawn(process.execPath,[NEXT,"start","-H","127.0.0.1","-p",String(webPort)],
    {cwd:WEB,env,stdio:["ignore","pipe","pipe"]});
  for(const stream of [child.stdout,child.stderr]){
    stream.setEncoding("utf8");
    stream.on("data",chunk=>{captured=(captured+chunk).slice(-1600);});
  }
  const base=`http://127.0.0.1:${webPort}`;
  let ready=false;
  for(let i=0;i<60;i++){
    if(child.exitCode!==null)break;
    try{
      const r=await request(base,"/admin/login");
      if(r.status===200){ready=true;break;}
    }catch{}
    await sleep(500);
  }
  assert.ok(ready,`next_runtime_not_ready: ${captured.replaceAll(secret,"[secret]").replaceAll(adminToken,"[token]")}`);
  const history="/api/admin/intelligence/visual-reviews?slug=chance-eau-tendre";
  const decisions="/api/admin/intelligence/visual-decisions/51";
  assert.equal((await request(base,history)).status,401,"no_session_must_fail");
  assert.equal((await request(base,history,"ok.invalid")).status,401,"forged_session_must_fail");
  assert.equal((await request(base,"/admin/revision-visual")).status,307,"admin_page_requires_session");
  assert.equal((await request(base,"/admin/progreso")).status,307,"progress_page_requires_session");
  assert.equal((await request(base,"/admin/operaciones")).status,307,"operations_page_requires_session");
  for(const page of ["/admin/revision-visual","/admin/progreso","/admin/operaciones"]){
    const r=await request(base,page,cookie);
    assert.equal(r.status,200,`authorized_page_${page}`);
  }
  assert.equal((await request(base,history,cookie,"POST")).status,405,"browser_cannot_create_review");
  assert.equal((await request(base,"/api/admin/intelligence/visual-decisions/51",cookie,"POST")).status,405,"browser_cannot_post_decision");
  assert.equal((await request(base,"/api/admin/intelligence/visual-reviews?slug=..%2Fsecret",cookie)).status,400,"invalid_slug");
  assert.equal((await request(base,"/api/admin/intelligence/visual-decisions/0",cookie)).status,400,"invalid_observation_id");
  const a=await request(base,history,cookie);
  assert.equal(a.status,200,"journal_proxy_connected");
  const j=await a.json();
  assert.equal(j.publication,"blocked");
  assert.equal(j.identityVerified,false);
  assert.equal(j.rightsVerified,false);
  assert.equal(j.reviews[0].product_slug,"chance-eau-tendre");
  const b=await request(base,decisions,cookie);
  assert.equal(b.status,200,"decision_proxy_connected");
  const d=await b.json();
  assert.equal(d.publication,"blocked");
  assert.equal(d.approval,false);
  assert.equal(d.applied,false);
  assert.equal(d.decisions[0].decision,"rejected");
  assert.equal((await request(base,"/api/admin/intelligence/visual-evidence?asset=%2Fa.png",cookie)).status,503,"inspector_default_disabled");
  assert.equal((await request(base,"/api/admin/intelligence/visual-replacement-plan?slug=chance-eau-tendre",cookie)).status,503,"swap_default_disabled");
  assert.equal(responses.length,2,"only_two_authorized_read_only_backend_queries");
  assert.ok(responses.every(x=>x.authorized&&x.safe&&x.method==="GET"),"publisher_credentials_never_sent");
  console.log("PASS: real Next.js runtime, admin middleware, signed session, read-only proxy, blocked review/decision, disabled image actions.");
}finally{
  if(child && child.exitCode===null){
    child.kill("SIGTERM");
    await Promise.race([once(child,"exit").catch(()=>{}),sleep(3000)]);
    if(child.exitCode===null)child.kill("SIGKILL");
  }
  await new Promise(resolve=>mock.close(resolve));
}
