import type { Perfume } from "./types";
import type { QuizProfile } from "./quizData";

function norm(value: string | null | undefined) {
  return (value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export interface RankedQuizPerfume { perfume: Perfume; score: number; reasons: string[] }

export function rankPerfumesForProfile(profile: QuizProfile, perfumes: Perfume[], limit = 8): RankedQuizPerfume[] {
  const families = profile.familias.map(norm);
  return perfumes.map((perfume) => {
    let score = 0;
    const reasons: string[] = [];
    const family = norm(perfume.familia_olfativa);
    if (families.length && families.some((target) => family === target || family.includes(target) || target.includes(family))) { score += 55; reasons.push("familia alineada con tu perfil"); }
    if (profile.nichoFiltro && perfume.nicho_o_comercial === profile.nichoFiltro) { score += 45; reasons.push(`${profile.nichoFiltro} según tu preferencia`); }
    if (!profile.nichoFiltro && families.length === 0) score += 5;
    if (perfume.rating_promedio != null) score += Math.min(10, perfume.rating_promedio * 2);
    if (perfume.data_confidence === "high") score += 5;
    return { perfume, score, reasons };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || (b.perfume.rating_promedio ?? 0) - (a.perfume.rating_promedio ?? 0) || a.perfume.nombre.localeCompare(b.perfume.nombre)).slice(0, limit);
}
