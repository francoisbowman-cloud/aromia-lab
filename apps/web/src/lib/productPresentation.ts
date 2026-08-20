export type ProductGeometry = "tall" | "standard" | "wide" | "sculptural" | "compact";

export type ProductPresentation = {
  geometry: ProductGeometry;
  card: { maxHeight: number; maxWidth: number; x: number; y: number; scale: number };
  hero: { maxHeight: number; maxWidth: number; x: number; y: number; scale: number };
};

const geometryDefaults: Record<ProductGeometry, ProductPresentation> = {
  tall: {
    geometry: "tall",
    card: { maxHeight: 91, maxWidth: 72, x: 0, y: 1, scale: 1 },
    hero: { maxHeight: 94, maxWidth: 76, x: 0, y: 1, scale: 1 },
  },
  standard: {
    geometry: "standard",
    card: { maxHeight: 86, maxWidth: 82, x: 0, y: 1, scale: 1 },
    hero: { maxHeight: 91, maxWidth: 88, x: 0, y: 1, scale: 1 },
  },
  wide: {
    geometry: "wide",
    card: { maxHeight: 78, maxWidth: 91, x: 0, y: 2, scale: 1 },
    hero: { maxHeight: 84, maxWidth: 94, x: 0, y: 2, scale: 1 },
  },
  sculptural: {
    geometry: "sculptural",
    card: { maxHeight: 82, maxWidth: 91, x: 0, y: 1, scale: 1 },
    hero: { maxHeight: 88, maxWidth: 94, x: 0, y: 1, scale: 1 },
  },
  compact: {
    geometry: "compact",
    card: { maxHeight: 79, maxWidth: 84, x: 0, y: 4, scale: 1 },
    hero: { maxHeight: 85, maxWidth: 89, x: 0, y: 3, scale: 1 },
  },
};

const geometryBySlug: Record<string, ProductGeometry> = {
  "acqua-di-gio-edt": "tall",
  "baccarat-rouge-540-edp": "tall",
  "ck-one": "tall",
  "erba-pura": "tall",
  "fucking-fabulous": "tall",
  "herod": "tall",
  "sauvage-edt": "tall",
  "terre-dhermes": "tall",
  "1-million": "standard",
  "aventus": "standard",
  "bleu-de-chanel-edp": "standard",
  "black-opium-edp": "standard",
  "eros": "standard",
  "delina": "standard",
  "chance-eau-tendre": "compact",
  "flowerbomb": "wide",
  "angel-edp": "sculptural",
  "good-girl": "sculptural",
  "good-girl-gone-bad": "sculptural",
  "bombshell": "wide",
};

const overrides: Record<string, Partial<ProductPresentation>> = {
  "good-girl": {
    card: { maxHeight: 83, maxWidth: 94, x: 1, y: 2, scale: 1 },
    hero: { maxHeight: 89, maxWidth: 96, x: 1, y: 2, scale: 1 },
  },
  "angel-edp": {
    card: { maxHeight: 78, maxWidth: 94, x: 0, y: 3, scale: 1 },
    hero: { maxHeight: 84, maxWidth: 96, x: 0, y: 2, scale: 1 },
  },
  "flowerbomb": {
    card: { maxHeight: 76, maxWidth: 90, x: 0, y: 4, scale: 1 },
    hero: { maxHeight: 83, maxWidth: 94, x: 0, y: 3, scale: 1 },
  },
  "chance-eau-tendre": {
    card: { maxHeight: 77, maxWidth: 80, x: 0, y: 5, scale: 1 },
    hero: { maxHeight: 84, maxWidth: 86, x: 0, y: 4, scale: 1 },
  },
};

export function productPresentation(slug: string): ProductPresentation {
  const geometry = geometryBySlug[slug] ?? "standard";
  const base = geometryDefaults[geometry];
  const override = overrides[slug];
  return {
    geometry,
    card: override?.card ?? base.card,
    hero: override?.hero ?? base.hero,
  };
}
