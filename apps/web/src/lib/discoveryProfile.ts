import type { Perfume } from "./types";

export const DISCOVERY_PROFILE_KEY = "aromia.discovery.profile.v2";
export const DISCOVERY_PROFILE_EVENT = "aromia:discovery-profile";

export interface DiscoveryProfile {
  version: 2;
  families: Record<string, number>;
  notes: Record<string, number>;
  perfumers: Record<string, number>;
  perfumes: Record<string, number>;
  quizProfiles: Record<string, number>;
  updatedAt: string;
}

function clean(value: string | null | undefined) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export function emptyDiscoveryProfile(): DiscoveryProfile {
  return { version: 2, families: {}, notes: {}, perfumers: {}, perfumes: {}, quizProfiles: {}, updatedAt: new Date(0).toISOString() };
}

function safeMap(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const output: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const n = Number(raw);
    if (key && Number.isFinite(n) && n > 0) output[key] = Math.min(50, n);
  }
  return output;
}

export function parseDiscoveryProfile(raw: string | null): DiscoveryProfile {
  if (!raw) return emptyDiscoveryProfile();
  try {
    const value = JSON.parse(raw) as Partial<DiscoveryProfile>;
    return {
      version: 2,
      families: safeMap(value.families),
      notes: safeMap(value.notes),
      perfumers: safeMap(value.perfumers),
      perfumes: safeMap(value.perfumes),
      quizProfiles: safeMap(value.quizProfiles),
      updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : new Date(0).toISOString(),
    };
  } catch {
    return emptyDiscoveryProfile();
  }
}

export function loadDiscoveryProfile(): DiscoveryProfile {
  if (typeof window === "undefined") return emptyDiscoveryProfile();
  return parseDiscoveryProfile(window.localStorage.getItem(DISCOVERY_PROFILE_KEY));
}

export function saveDiscoveryProfile(profile: DiscoveryProfile) {
  if (typeof window === "undefined") return;
  const next = { ...profile, version: 2 as const, updatedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(DISCOVERY_PROFILE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(DISCOVERY_PROFILE_EVENT));
  } catch {
    // Discovery is progressive enhancement; storage failure never blocks navigation.
  }
}

function bump(map: Record<string, number>, value: string | null | undefined, amount: number) {
  const key = clean(value);
  if (!key) return;
  map[key] = Math.min(50, (map[key] ?? 0) + amount);
}

export function recordPerfumeInterest(perfume: Perfume, amount = 1) {
  const profile = loadDiscoveryProfile();
  bump(profile.perfumes, perfume.slug, amount * 2);
  bump(profile.families, perfume.familia_olfativa, amount * 2);
  for (const note of [...(perfume.notas_salida ?? []), ...(perfume.notas_corazon ?? []), ...(perfume.notas_fondo ?? [])]) bump(profile.notes, note, amount);
  saveDiscoveryProfile(profile);
}

export function recordPerfumerInterest(slug: string, amount = 2) {
  const profile = loadDiscoveryProfile();
  bump(profile.perfumers, slug, amount);
  saveDiscoveryProfile(profile);
}

export function recordQuizProfile(slug: string, families: string[] = []) {
  const profile = loadDiscoveryProfile();
  bump(profile.quizProfiles, slug, 5);
  for (const family of families) bump(profile.families, family, 4);
  saveDiscoveryProfile(profile);
}

export function clearDiscoveryProfile() {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem(DISCOVERY_PROFILE_KEY); } catch {}
  window.dispatchEvent(new CustomEvent(DISCOVERY_PROFILE_EVENT));
}

export function topSignals(map: Record<string, number>, limit = 5) {
  return Object.entries(map).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit);
}
