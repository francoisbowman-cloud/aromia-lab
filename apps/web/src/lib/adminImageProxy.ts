import { NextResponse } from "next/server";
import { adminAuthorizationError, proxyToAdminApi } from "./adminApiProxy";

export async function proxyAdminImage(req: Request, path: string) {
  const denied = await adminAuthorizationError();
  if (denied) return denied;
  const max = 5 * 1024 * 1024;
  if (Number(req.headers.get("content-length")) > max + 65536) {
    return NextResponse.json({ error: "La imagen supera 5MB" }, { status: 413 });
  }
  let incoming: FormData;
  try { incoming = await req.formData(); }
  catch { return NextResponse.json({ error: "Imagen no válida" }, { status: 400 }); }
  const file = incoming.get("image");
  if (!file || typeof file === "string") return NextResponse.json({ error: "Falta la imagen" }, { status: 400 });
  if (file.size > max) return NextResponse.json({ error: "La imagen supera 5MB" }, { status: 413 });
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    return NextResponse.json({ error: "Formato no admitido" }, { status: 415 });
  }
  const body = new FormData();
  body.append("image", file);
  const field = incoming.get("field");
  if (field === "og" || field === "inline") body.append("field", field);
  return proxyToAdminApi(path, { method: "POST", body });
}
