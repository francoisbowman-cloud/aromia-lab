export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_VALUE = "ok";

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toHex(signature);
}

export async function createSessionCookieValue(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET no está configurado");
  return `${SESSION_VALUE}.${await sign(SESSION_VALUE, secret)}`;
}

export async function isValidSessionCookie(
  cookieValue: string | undefined,
): Promise<boolean> {
  if (!cookieValue) return false;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const [value, signature] = cookieValue.split(".");
  if (!value || !signature || value !== SESSION_VALUE) return false;

  const expected = await sign(value, secret);
  return expected === signature;
}
