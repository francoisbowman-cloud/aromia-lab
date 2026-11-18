import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const proxy=vi.hoisted(()=>vi.fn());
vi.mock("@/lib/adminApiProxy",()=>({proxyToAdminApi:proxy}));
import {GET} from "./route";
beforeEach(()=>proxy.mockReset());
it("rejects invalid, unsafe and floating observation ids before contacting the server",async()=>{
  for(const id of ["0","-1","1/../2","1.2","NaN","9999999999999999999999"]){
    const result=await GET(new NextRequest("http://localhost/"),{params: Promise.resolve({observationId:id})});
    expect(result.status).toBe(400);
  }
  expect(proxy).not.toHaveBeenCalled();
});
it("routes valid id only through authenticated admin proxy",async()=>{
  proxy.mockResolvedValue(new Response(JSON.stringify({decisions:[],approval:false,publication:"blocked",applied:false}),{status:200}));
  const result=await GET(new NextRequest("http://localhost/"),{params: Promise.resolve({observationId:"123"})});
  expect(result.status).toBe(200);
  expect(proxy).toHaveBeenCalledExactlyOnceWith("/intelligence/visual-decisions/123");
});
it("does not provide publisher credential or mutation endpoints",async()=>{
  const handlers=await import("./route");
  expect("POST" in handlers).toBe(false);
  expect("PATCH" in handlers).toBe(false);
  expect("DELETE" in handlers).toBe(false);
});
