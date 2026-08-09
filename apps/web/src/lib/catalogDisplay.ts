import type { Perfume } from "./types";

const INTERNAL_PLACEHOLDERS = [
  "pending",
  "por verificar",
  "no verificar",
  "no verificado",
  "no-applicable",
  "not-audited",
  "n/a",
];

export function publicText(value: string | null | undefined): string | null {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const normalized = text.toLowerCase();
  if (INTERNAL_PLACEHOLDERS.some((token) => normalized === token || normalized.includes(`${token} -`) || normalized.includes(`${token}:`))) return null;
  if (/\bpending\b|\bpor verificar\b|\bno verificado\b/i.test(text)) return null;
  return text;
}

export function publicNotes(values: string[] | null | undefined): string[] {
  return (values ?? []).map((value) => String(value).trim()).filter((value) => Boolean(publicText(value)) && !/^no verificado/i.test(value));
}

export function formattedReferencePrice(perfume: Perfume): string | null {
  if (perfume.precio_referencia == null || !publicText(perfume.moneda)) return null;
  try {
    return Number(perfume.precio_referencia).toLocaleString("es-AR", {
      style: "currency",
      currency: perfume.moneda ?? "USD",
    });
  } catch {
    return null;
  }
}
