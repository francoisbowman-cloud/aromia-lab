import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy, config } from "./proxy";
import { ADMIN_SESSION_COOKIE, createSessionCookieValue } from "@/lib/adminAuth";

const ORIGINAL_SECRET = process.env.ADMIN_SESSION_SECRET;

function req(path: string, cookie?: string) {
  return new NextRequest(`http://localhost:3000${path}`, {
    headers: cookie ? { cookie: `${ADMIN_SESSION_COOKIE}=${cookie}` } : {},
  });
}

describe("proxy (guardia del panel admin)", () => {
  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = "test-secret-for-proxy";
  });
  afterEach(() => {
    if (ORIGINAL_SECRET === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = ORIGINAL_SECRET;
  });

  it("redirige a /admin/login sin cookie", async () => {
    const res = await proxy(req("/admin"));
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/admin/login");
  });

  it("redirige con cookie falsificada", async () => {
    const res = await proxy(req("/admin/perfumes", "ok.deadbeef"));
    expect(res.status).toBe(307);
  });

  it("deja pasar con cookie firmada válida", async () => {
    const res = await proxy(req("/admin", await createSessionCookieValue()));
    expect(res.headers.get("x-middleware-next")).toBe("1");
  });

  it("rechaza si falta ADMIN_SESSION_SECRET aunque haya cookie", async () => {
    const cookie = await createSessionCookieValue();
    delete process.env.ADMIN_SESSION_SECRET;
    const res = await proxy(req("/admin", cookie));
    expect(res.status).toBe(307);
  });

  it("el matcher cubre /admin y subrutas pero no /admin/login", () => {
    const [a, b] = config.matcher;
    expect(a).toBe("/admin");
    const re = new RegExp(`^${b}$`);
    expect(re.test("/admin/magazine")).toBe(true);
    expect(re.test("/admin/login")).toBe(false);
  });
});
