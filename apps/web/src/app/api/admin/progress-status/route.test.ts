import { beforeEach, expect, it, vi } from "vitest";
const auth=vi.hoisted(()=>vi.fn());
const source=vi.hoisted(()=>vi.fn());
vi.mock("@/lib/adminApiProxy",()=>({adminAuthorizationError:auth}));
vi.mock("@/lib/githubProgress.server",()=>({fetchAromiaPrStatuses:source}));
import {GET} from "./route";
beforeEach(()=>{auth.mockReset().mockResolvedValue(null);source.mockReset();vi.unstubAllEnvs();});
it("requires admin authentication before querying GitHub",async()=>{
  auth.mockResolvedValue(new Response(null,{status:401}));
  expect((await GET()).status).toBe(401);
  expect(source).not.toHaveBeenCalled();
});
it("does not claim CI or milestone approval based on GitHub PR state",async()=>{
  source.mockResolvedValue([{number:195,title:"Progress",state:"draft",url:"https://github.com/francoisbowman-cloud/aromia-lab/pull/195",headSha:"a".repeat(40),updatedAt:"2026-11-17T12:00:00Z",ci:"not_checked"}]);
  const result=await GET();
  expect(result.status).toBe(200);
  expect(result.headers.get("Cache-Control")).toContain("no-store");
  const json=await result.json();
  expect(json.milestonesAutomaticallyApproved).toBe(false);
  expect(json.ciVerifiedByThisFeed).toBe(false);
  expect(json.pulls[0].state).toBe("draft");
});
it("does not alter the milestone snapshot when GitHub is down",async()=>{
  source.mockRejectedValue(new Error("GitHub offline"));
  const result=await GET();
  expect(result.status).toBe(503);
  expect((await result.json()).error).toBe("github_progress_unavailable");
});
it("exposes no PR or editorial mutation endpoints",async()=>{
  const handlers=await import("./route");
  expect("POST" in handlers).toBe(false);
  expect("PATCH" in handlers).toBe(false);
  expect("DELETE" in handlers).toBe(false);
});
