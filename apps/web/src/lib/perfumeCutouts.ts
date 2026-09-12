/**
 * Registro de perfumes con recorte sin fondo (canal alfa) disponible en
 * `public/perfumes/cutouts/<slug>.webp`. Decisión #105 (revista editorial):
 * el recorte se genera OFFLINE con `remove_background` de OMNI sobre la
 * `imagen_url` real, y se usa como el asset principal del perfume — sin
 * máscara CSS ni `mix-blend`. Los slugs que NO estén acá caen al tratamiento
 * de fallback (Opción A: hotlink + máscara radial) en `ProductImage.tsx`.
 *
 * Los frascos que el recorte automático no resuelve (vidrio transparente,
 * líquidos de color, tapas cromadas) o cuyas fotos traen packaging no
 * deseado se sustituyen por una imagen IA de alto detalle **generada por
 * ChatGPT** (no por Code), con la regla dura de no inventar ningún rasgo
 * del frasco. Code integra el archivo y registra el slug acá.
 *
 * Piloto de 10 perfumes corrido 2026-09-12 (ver
 * `docs/images/OMNI-PILOT-RESULTADOS-2026-09-12.md`) — 7 clasificados A
 * (AUTO_CLEAN) y registrados acá. Quedan fuera a propósito: `oud-wood`
 * (clasificación B, artefacto de borde sin limpiar) y los 2 casos C con caja
 * en la foto (`baccarat-rouge-540-edp`, `1-million`) — Brey decidió dejarlos
 * con su caja, sin cutout, hasta que haya foto solo-frasco o imagen IA.
 */
export const PERFUME_CUTOUTS: ReadonlySet<string> = new Set<string>([
  "bleu-de-chanel-edp",
  "chanel-no5-edp",
  "santal-33-edp",
  "aventus",
  "molecule-01",
  "acqua-di-gio-edt",
  "nishane-hacivat",
]);

export function hasCutout(slug: string): boolean {
  return PERFUME_CUTOUTS.has(slug);
}

export function cutoutSrc(slug: string): string {
  return `/perfumes/cutouts/${encodeURIComponent(slug)}.webp`;
}
