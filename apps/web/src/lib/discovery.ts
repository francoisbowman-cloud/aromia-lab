import type { Perfume } from "./types";

function norm(value: string | null | undefined) {
  return (value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function values(items?: string[]) {
  return new Set((items ?? []).map(norm).filter(Boolean));
}

function overlap(a?: string[], b?: string[]) {
  const left = values(a);
  const right = values(b);
  let count = 0;
  Array.from(left).forEach((item) => { if (right.has(item)) count += 1; });
  return count;
}

export interface SimilarityResult {
  perfume: Perfume;
  score: number;
  reasons: string[];
}

export function similarityScore(source: Perfume, candidate: Perfume): SimilarityResult {
  let score = 0;
  const reasons: string[] = [];
  const familyA = norm(source.familia_olfativa);
  const familyB = norm(candidate.familia_olfativa);

  if (familyA && familyA === familyB) { score += 32; reasons.push("misma familia olfativa"); }
  else if (familyA && familyB && (familyA.includes(familyB) || familyB.includes(familyA))) { score += 18; reasons.push("familia olfativa cercana"); }

  const top = overlap(source.notas_salida, candidate.notas_salida);
  const heart = overlap(source.notas_corazon, candidate.notas_corazon);
  const base = overlap(source.notas_fondo, candidate.notas_fondo);
  const noteScore = Math.min(30, top * 4 + heart * 5 + base * 6);
  if (noteScore > 0) { score += noteScore; reasons.push(`${top + heart + base} notas compartidas`); }

  const occasions = overlap(source.ocasion, candidate.ocasion);
  if (occasions) { score += Math.min(12, occasions * 4); reasons.push("ocasiones compatibles"); }
  const seasons = overlap(source.temporada_recomendada, candidate.temporada_recomendada);
  if (seasons) score += Math.min(8, seasons * 2);
  if (source.genero === candidate.genero) score += 5;
  if (source.nicho_o_comercial && source.nicho_o_comercial === candidate.nicho_o_comercial) score += 5;
  if (source.categoria_precio && source.categoria_precio === candidate.categoria_precio) score += 4;
  if (source.concentracion && norm(source.concentracion) === norm(candidate.concentracion)) score += 4;

  return { perfume: candidate, score, reasons: reasons.slice(0, 3) };
}

export function getSimilarPerfumes(source: Perfume, perfumes: Perfume[], limit = 6): SimilarityResult[] {
  return perfumes
    .filter((candidate) => candidate.slug !== source.slug)
    .map((candidate) => similarityScore(source, candidate))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.perfume.nombre.localeCompare(b.perfume.nombre))
    .slice(0, limit);
}

export type DiscoverySort = "relevancia" | "rating" | "precio-asc" | "precio-desc" | "nombre";

export function discoveryTextScore(perfume: Perfume, query: string) {
  const q = norm(query);
  if (!q) return 0;
  const name = norm(perfume.nombre);
  const brand = norm(perfume.marca);
  const family = norm(perfume.familia_olfativa);
  const notes = [...(perfume.notas_salida ?? []), ...(perfume.notas_corazon ?? []), ...(perfume.notas_fondo ?? [])].map(norm);
  let score = 0;
  if (name === q) score += 100;
  else if (name.startsWith(q)) score += 70;
  else if (name.includes(q)) score += 50;
  if (brand === q) score += 60;
  else if (brand.includes(q)) score += 35;
  if (family.includes(q)) score += 25;
  if (notes.some((note) => note.includes(q))) score += 20;
  return score;
}
