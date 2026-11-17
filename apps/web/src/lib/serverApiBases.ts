export function serverApiBases(): string[] {
  const explicit = process.env.API_URL?.trim();
  if (explicit) return [explicit.replace(/\/$/, "")];
  if (process.env.NODE_ENV === "production") {
    return ["http://api.railway.internal:4000", "https://api-production-fe2f.up.railway.app"];
  }
  return [(process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:4000").replace(/\/$/, "")];
}
