import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const auth = vi.hoisted(() => vi.fn());
const inspect = vi.hoisted(() => vi.fn());
vi.mock("@/lib/adminApiProxy", () => ({ adminAuthorizationError: auth }));
vi.mock("@/lib/visualEvidence", () => ({ inspectLocalVisualAsset: inspect }));
import { GET } from "./route";

beforeEach(() => {
  auth.mockReset();
  inspect.mockReset();
  vi.unstubAllEnvs();
  auth.mockResolvedValue(null);
});

it("does not reveal asset metadata without admin session", async () => {
  auth.mockResolvedValue(new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 }));
  vi.stubEnv("VISUAL_EVIDENCE_INSPECTION_ENABLED", "true");
  const response = await GET(new NextRequest("http://localhost/api/admin/intelligence/visual-evidence?asset=%2Fa.png"));
  expect(response.status).toBe(401);
  expect(inspect).not.toHaveBeenCalled();
});

it("requires explicit opt-in even with an authorized session", async () => {
  vi.stubEnv("VISUAL_EVIDENCE_INSPECTION_ENABLED", "");
  const response = await GET(new NextRequest("http://localhost/api/admin/intelligence/visual-evidence?asset=%2Fa.png"));
  expect(response.status).toBe(503);
  expect(inspect).not.toHaveBeenCalled();
});

it("returns read-only inspection metadata with private no-store headers", async () => {
  vi.stubEnv("VISUAL_EVIDENCE_INSPECTION_ENABLED", "true");
  inspect.mockResolvedValue({
    url: "/a.png", bytesSha256: "a".repeat(64), bytes: 200,
    width: 10, height: 10, format: "png",
    publication: "blocked", identityVerified: false,
    rightsVerified: false, visualQualityVerified: false
  });
  const response = await GET(new NextRequest("http://localhost/api/admin/intelligence/visual-evidence?asset=%2Fa.png"));
  expect(response.status).toBe(200);
  expect(response.headers.get("Cache-Control")).toContain("no-store");
  expect((await response.json()).publication).toBe("blocked");
});

it("rejects invalid files without granting publication", async () => {
  vi.stubEnv("VISUAL_EVIDENCE_INSPECTION_ENABLED", "true");
  inspect.mockRejectedValue(new Error("invalid_visual_asset_path"));
  const response = await GET(new NextRequest("http://localhost/api/admin/intelligence/visual-evidence?asset=..%2Fsecret"));
  expect(response.status).toBe(400);
  const body = await response.json();
  expect(body.error).toBe("invalid_visual_asset_path");
});

it("exposes no mutation handler", async () => {
  const routeHandlers = await import("./route");
  expect("POST" in routeHandlers).toBe(false);
  expect("PUT" in routeHandlers).toBe(false);
  expect("DELETE" in routeHandlers).toBe(false);
});
