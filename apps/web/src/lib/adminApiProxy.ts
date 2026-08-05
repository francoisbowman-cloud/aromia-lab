import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSessionCookie } from "./adminAuth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function proxyToAdminApi(
  path: string,
  init: RequestInit = {},
): Promise<NextResponse> {
  const cookieStore = cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!(await isValidSessionCookie(session))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const res = await fetch(`${API_BASE_URL}/api/admin${path}`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${process.env.ADMIN_API_TOKEN}`,
    },
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await res.json() : null;

  return NextResponse.json(body, { status: res.status });
}
