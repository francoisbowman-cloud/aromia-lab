export interface EditorialImage {
  src: string;
  alt: string;
}

const EDITORIAL_IMAGES: EditorialImage[] = [
  { src: "/editorial/bright-soft-focus.png", alt: "Escena editorial de perfumería en luz suave" },
  { src: "/editorial/cinematic-warm.png", alt: "Escena editorial de perfumería en tonos cálidos cinemáticos" },
  { src: "/editorial/golden-amber.png", alt: "Escena editorial de perfumería en ámbar dorado" },
  { src: "/editorial/luxurious-softlit.png", alt: "Escena editorial de perfumería con luz suave y lujosa" },
  { src: "/editorial/moody-closeup.png", alt: "Escena editorial de perfumería en primer plano, atmósfera moody" },
  { src: "/editorial/romantic-scene.png", alt: "Escena editorial de perfumería romántica" },
  { src: "/editorial/soft-romantic.png", alt: "Escena editorial de perfumería suave y romántica" },
  { src: "/editorial/sunlit-warm.png", alt: "Escena editorial de perfumería con luz solar cálida" },
];

/** Elige una imagen editorial genérica de forma determinística a partir de un
 * string (ej. el slug de un artículo del Magazine). Uso legítimo: portadas de
 * artículo no representan un producto puntual, así que no hay "frasco
 * incorrecto" posible — a diferencia de la ficha de producto (ver
 * `getEditorialImage` más abajo), donde el mismo criterio causaba el bug de
 * pareo OVL (ticket 23/07). */
export function pickEditorialImage(seed: string): EditorialImage {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return EDITORIAL_IMAGES[hash % EDITORIAL_IMAGES.length];
}

/**
 * Mockups narrativos (set OVL_Prompt_50) pareados 1:1 contra el perfume real
 * para el que fueron generados — verificado visualmente contra los ingredientes
 * descritos en cada prompt (fruta/flor de primer plano, notas de fondo), no
 * asignado por hash. Solo se listan los pares confirmados con alta confianza;
 * el resto de los perfumes no tiene mockup verificado todavía — mostrar un
 * frasco incorrecto es peor que no mostrar nada (ver ticket OVL, 23/07).
 */
const OVL_IMAGES: Record<string, EditorialImage> = {
  "bleu-de-chanel-edp": { src: "/ovl/bleu-de-chanel-edp.jpg", alt: "Atmósfera editorial de Bleu de Chanel EDP" },
  "nishane-hacivat": { src: "/ovl/nishane-hacivat.jpg", alt: "Atmósfera editorial de Nishane Hacivat" },
  "j-adore-edp": { src: "/ovl/j-adore-edp.jpg", alt: "Atmósfera editorial de J'adore EDP" },
  "la-vie-est-belle": { src: "/ovl/la-vie-est-belle.jpg", alt: "Atmósfera editorial de La Vie Est Belle" },
  "idole-edp": { src: "/ovl/idole-edp.jpg", alt: "Atmósfera editorial de Idole EDP" },
  "ck-one": { src: "/ovl/ck-one.jpg", alt: "Atmósfera editorial de CK One" },
  "y-edp": { src: "/ovl/y-edp.jpg", alt: "Atmósfera editorial de Y EDP" },
  "wood-sage-sea-salt": { src: "/ovl/wood-sage-sea-salt.jpg", alt: "Atmósfera editorial de Wood Sage & Sea Salt" },
};

/** Devuelve el mockup narrativo del perfume, o null si todavía no tiene uno
 * verificado — el caller debe mostrar un placeholder neutro en ese caso. */
export function getEditorialImage(slug: string): EditorialImage | null {
  return OVL_IMAGES[slug] ?? null;
}
