import type { Perfume } from "./types";
import type { DiscoveryProfile } from "./discoveryProfile";
import { perfumersForPerfume } from "./perfumers";
import { similarityScore } from "./discovery";

function norm(value: string | null | undefined) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export interface PersonalizedPerfumeResult {
  perfume: Perfume;
  score: number;
  reasons: string[];
}

export function personalizedPerfumeScore(perfume: Perfume, profile: DiscoveryProfile, source?: Perfume | null): PersonalizedPerfumeResult {
  let score = 0;
  const reasons: string[] = [];
  const family = norm(perfume.familia_olfativa);
  const familyWeight = profile.families[family] ?? 0;
  if (familyWeight > 0) {
    score += Math.min(36, familyWeight * 4);
    reasons.push(`afinidad con ${perfume.familia_olfativa}`);
  }

  const noteWeights = [...(perfume.notas_salida ?? []), ...(perfume.notas_corazon ?? []), ...(perfume.notas_fondo ?? [])]
    .map((note) => ({ note, weight: profile.notes[norm(note)] ?? 0 }))
    .filter((item) => item.weight > 0)
    .sort((a, b) => b.weight - a.weight);
  if (noteWeights.length) {
    score += Math.min(28, noteWeights.slice(0, 4).reduce((sum, item) => sum + item.weight * 2, 0));
    reasons.push(`notas afines: ${noteWeights.slice(0, 2).map((item) => item.note).join(" + ")}`);
  }

  const perfumerWeights = perfumersForPerfume(perfume.slug)
    .map((perfumer) => ({ perfumer, weight: profile.perfumers[perfumer.slug] ?? 0 }))
    .filter((item) => item.weight > 0)
    .sort((a, b) => b.weight - a.weight);
  if (perfumerWeights.length) {
    score += Math.min(18, perfumerWeights[0].weight * 3);
    reasons.push(`obra de ${perfumerWeights[0].perfumer.name}`);
  }

  const seenWeight = profile.perfumes[norm(perfume.slug)] ?? 0;
  if (seenWeight > 0) score -= Math.min(18, seenWeight * 2);

  if (source && source.slug !== perfume.slug) {
    const context = similarityScore(source, perfume);
    score += Math.round(context.score * 0.35);
    if (context.reasons[0]) reasons.push(context.reasons[0]);
  }

  if (perfume.rating_promedio != null) score += Math.min(5, perfume.rating_promedio);
  return { perfume, score, reasons: [...new Set(reasons)].slice(0, 3) };
}

export function rankPersonalizedPerfumes(perfumes: Perfume[], profile: DiscoveryProfile, options: { source?: Perfume | null; excludeSlugs?: string[]; limit?: number } = {}) {
  const exclude = new Set(options.excludeSlugs ?? []);
  if (options.source) exclude.add(options.source.slug);
  return perfumes
    .filter((perfume) => !exclude.has(perfume.slug))
    .map((perfume) => personalizedPerfumeScore(perfume, profile, options.source))
    .sort((a, b) => b.score - a.score || (b.perfume.rating_promedio ?? 0) - (a.perfume.rating_promedio ?? 0) || a.perfume.nombre.localeCompare(b.perfume.nombre))
    .slice(0, options.limit ?? 6);
}
