import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSessionCookie } from "./adminAuth";

export async function proxyToAdminApi(
  path: string,
  init: RequestInit = {},
): Promise<NextResponse> {
  const cookieStore = cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!(await isValidSessionCookie(session))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!process.env.ADMIN_API_TOKEN) {
    return NextResponse.json({ error: "Administración no disponible" }, { status: 503 });
  }

  const base = (process.env.API_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:4000").replace(/\/$/, "");
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${process.env.ADMIN_API_TOKEN}`);
  try {
    const res = await fetch(`${base}/api/admin${path}`, {
      ...init,
      headers,
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const body = await res.json();
    return NextResponse.json(body, { status: res.status });
  } catch {
    return NextResponse.json({ error: "No se pudo conectar con el servicio de administración. Reintentá." }, { status: 502 });
  }
}
