import { clean, fold } from "./expansion-engine.mjs";

function increment(map, key) {
  if (!key) return;
  map.set(key, (map.get(key) ?? 0) + 1);
}

function sortedCounts(map) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([key, count]) => ({ key, count }));
}

export function analyzeCatalogGaps(rows = []) {
  const brands = new Map();
  const genders = new Map();
  const families = new Map();
  const concentrations = new Map();
  let missingFamily = 0;
  let missingGender = 0;
  let missingConcentration = 0;

  for (const row of rows) {
    const brand = fold(row.brand ?? row.marca);
    const gender = fold(row.gender ?? row.genero);
    const family = fold(row.family ?? row.familia_olfativa);
    const concentration = fold(row.concentration);
    increment(brands, brand);
    increment(genders, gender);
    increment(families, family);
    increment(concentrations, concentration);
    if (!clean(row.family ?? row.familia_olfativa)) missingFamily += 1;
    if (!clean(row.gender ?? row.genero)) missingGender += 1;
    if (!clean(row.concentration)) missingConcentration += 1;
  }

  return {
    total_rows: rows.length,
    distinct_brands: brands.size,
    brands: sortedCounts(brands),
    genders: sortedCounts(genders),
    families: sortedCounts(families),
    concentrations: sortedCounts(concentrations),
    missing: { family: missingFamily, gender: missingGender, concentration: missingConcentration },
    brandCounts: brands,
  };
}

export function brandGapBonus(candidate, analysis) {
  const brand = fold(candidate.brand);
  const count = analysis?.brandCounts?.get(brand) ?? 0;
  if (count === 0) return 12;
  if (count === 1) return 6;
  if (count === 2) return 3;
  return 0;
}

export function serializableGapReport(analysis) {
  const { brandCounts, ...report } = analysis;
  return report;
}
