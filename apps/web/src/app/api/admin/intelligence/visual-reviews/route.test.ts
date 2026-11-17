import { expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const proxy = vi.hoisted(() => vi.fn());
vi.mock("@/lib/adminApiProxy", () => ({ proxyToAdminApi: proxy }));
import { GET } from "./route";

beforeEach(() => proxy.mockReset());

it("rejects invalid slugs without contacting the administrator backend", async () => {
  const result = await GET(new NextRequest("http://localhost/api/admin/intelligence/visual-reviews?slug=..%2Fsecret"));
  expect(result.status).toBe(400);
  expect(proxy).not.toHaveBeenCalled();
});

it("forwards only a validated, encoded slug to the authenticated read-only proxy", async () => {
  proxy.mockResolvedValue(new Response(JSON.stringify({ reviews: [], publication: "blocked" }), { status: 200 }));
  const request = new NextRequest("http://localhost/api/admin/intelligence/visual-reviews?slug=chance-eau-tendre");
  const result = await GET(request);
  expect(result.status).toBe(200);
  expect(proxy).toHaveBeenCalledExactlyOnceWith("/intelligence/visual-reviews?slug=chance-eau-tendre");
});

it("does not expose a write handler", async () => {
  const route = await import("./route");
  expect("POST" in route).toBe(false);
  expect("PUT" in route).toBe(false);
  expect("DELETE" in route).toBe(false);
});
