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
 * deseado se sustituyen por una imagen generada por IA de alto detalle,
 * con la regla dura de no inventar ningún rasgo del frasco — y también
 * entran acá una vez producidas.
 *
 * Se llena a mano tras el piloto (ver `docs/images/CUTOUT-PILOT-PLAN.md`).
 */
export const PERFUME_CUTOUTS: ReadonlySet<string> = new Set<string>([
  // piloto pendiente de correr — vacío por ahora, comportamiento = fallback total
]);

export function hasCutout(slug: string): boolean {
  return PERFUME_CUTOUTS.has(slug);
}

export function cutoutSrc(slug: string): string {
  return `/perfumes/cutouts/${encodeURIComponent(slug)}.webp`;
}
