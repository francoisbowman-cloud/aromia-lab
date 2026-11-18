import { serverApiBases } from "@/lib/serverApiBases";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params: promisedparams }: { params: Promise<{ path: string[] }> }) {
  const params = await promisedparams;
  const [kind, file, ...extra] = params.path;
  if (extra.length || !["articles", "perfumes"].includes(kind) || !/^[a-z0-9][a-z0-9._-]*\.(?:png|jpe?g|webp)$/i.test(file ?? "")) {
    return new Response(null, { status: 404 });
  }
  for (const base of serverApiBases()) {
    try {
      const upstream = await fetch(`${base}/uploads/${kind}/${encodeURIComponent(file)}`, {
        method: req.method === "HEAD" ? "HEAD" : "GET",
        cache: "no-store", signal: AbortSignal.timeout(5000),
      });
      if (upstream.status === 404) return new Response(null, { status: 404 });
      if (!upstream.ok) continue;
      const type = upstream.headers.get("content-type") ?? "";
      if (!/^image\/(?:png|jpeg|webp)(?:;|$)/i.test(type)) return new Response(null, { status: 415 });
      return new Response(req.method === "HEAD" ? null : upstream.body, {
        headers: { "Content-Type": type, "Cache-Control": "public, max-age=86400", "X-Content-Type-Options": "nosniff" },
      });
    } catch { /* Try the next configured transport. */ }
  }
  return new Response(null, { status: 502 });
}

export const HEAD = GET;
