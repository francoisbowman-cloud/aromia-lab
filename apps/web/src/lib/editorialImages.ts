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
 * Mockups narrativos (set OVL_Prompt_50 + 4 reemplazos entregados el 25/07)
 * pareados 1:1 contra el perfume real, no asignados por hash. **38/38
 * perfumes activos cubiertos** desde el 25/07 — los últimos 4 (Molecule 01,
 * Terre d'Hermès, Erba Pura, Flowerbomb) no tenían match confiable en el set
 * original de 50 prompts y se resolvieron aparte, con el mismo tratamiento
 * visual (fondo removido + degradé `--stone`→`--gold-300` + sombra) que los
 * otros 34. Ver ticket OVL, 23-25/07.
 */
const OVL_IMAGES: Record<string, EditorialImage> = {
  "bleu-de-chanel-edp": { src: "/ovl/bleu-de-chanel-edp.jpg", alt: "Atmósfera editorial de Bleu de Chanel EDP" },
  "sauvage-edp": { src: "/ovl/sauvage-edp.jpg", alt: "Atmósfera editorial de Sauvage EDT" },
  "aventus": { src: "/ovl/aventus.jpg", alt: "Atmósfera editorial de Aventus" },
  "black-opium-edp": { src: "/ovl/black-opium-edp.jpg", alt: "Atmósfera editorial de Black Opium EDP" },
  "good-girl": { src: "/ovl/good-girl.jpg", alt: "Atmósfera editorial de Good Girl" },
  "baccarat-rouge-540-edp": { src: "/ovl/baccarat-rouge-540-edp.jpg", alt: "Atmósfera editorial de Baccarat Rouge 540 EDP" },
  "light-blue": { src: "/ovl/light-blue.jpg", alt: "Atmósfera editorial de Light Blue" },
  "la-vie-est-belle": { src: "/ovl/la-vie-est-belle.jpg", alt: "Atmósfera editorial de La Vie Est Belle" },
  "acqua-di-gio-edt": { src: "/ovl/acqua-di-gio-edt.jpg", alt: "Atmósfera editorial de Acqua di Gio EDT" },
  "delina": { src: "/ovl/delina.jpg", alt: "Atmósfera editorial de Delina" },
  "oud-wood": { src: "/ovl/oud-wood.jpg", alt: "Atmósfera editorial de Oud Wood" },
  "j-adore-edp": { src: "/ovl/j-adore-edp.jpg", alt: "Atmósfera editorial de J'adore EDP" },
  "interlude-man": { src: "/ovl/interlude-man.jpg", alt: "Atmósfera editorial de Interlude Man" },
  "le-male": { src: "/ovl/le-male.jpg", alt: "Atmósfera editorial de Le Male" },
  "angel-edp": { src: "/ovl/angel-edp.jpg", alt: "Atmósfera editorial de Angel EDP" },
  "layton": { src: "/ovl/layton.jpg", alt: "Atmósfera editorial de Layton" },
  "ck-one": { src: "/ovl/ck-one.jpg", alt: "Atmósfera editorial de CK One" },
  "reflection-man": { src: "/ovl/reflection-man.jpg", alt: "Atmósfera editorial de Reflection Man" },
  "miss-dior-edp": { src: "/ovl/miss-dior-edp.jpg", alt: "Atmósfera editorial de Miss Dior EDP" },
  "fucking-fabulous": { src: "/ovl/fucking-fabulous.jpg", alt: "Atmósfera editorial de Fucking Fabulous" },
  "bombshell": { src: "/ovl/bombshell.jpg", alt: "Atmósfera editorial de Bombshell" },
  "herod": { src: "/ovl/herod.jpg", alt: "Atmósfera editorial de Herod" },
  "wood-sage-sea-salt": { src: "/ovl/wood-sage-sea-salt.jpg", alt: "Atmósfera editorial de Wood Sage & Sea Salt" },
  "idole-edp": { src: "/ovl/idole-edp.jpg", alt: "Atmósfera editorial de Idole EDP" },
  "1-million": { src: "/ovl/1-million.jpg", alt: "Atmósfera editorial de 1 Million" },
  "chance-eau-tendre": { src: "/ovl/chance-eau-tendre.jpg", alt: "Atmósfera editorial de Chance Eau Tendre" },
  "stronger-with-you": { src: "/ovl/stronger-with-you.jpg", alt: "Atmósfera editorial de Stronger With You" },
  "silver-mountain-water": { src: "/ovl/silver-mountain-water.jpg", alt: "Atmósfera editorial de Silver Mountain Water" },
  "libre-edp": { src: "/ovl/libre-edp.jpg", alt: "Atmósfera editorial de Libre EDP" },
  "y-edp": { src: "/ovl/y-edp.jpg", alt: "Atmósfera editorial de Y EDP" },
  "nishane-hacivat": { src: "/ovl/nishane-hacivat.jpg", alt: "Atmósfera editorial de Nishane Hacivat" },
  "eros": { src: "/ovl/eros.jpg", alt: "Atmósfera editorial de Eros" },
  "good-girl-gone-bad": { src: "/ovl/good-girl-gone-bad.jpg", alt: "Atmósfera editorial de Good Girl Gone Bad" },
  "versace-pour-homme": { src: "/ovl/versace-pour-homme.jpg", alt: "Atmósfera editorial de Versace Pour Homme" },
  "molecule-01": { src: "/ovl/molecule-01.jpg", alt: "Atmósfera editorial de Molecule 01" },
  "terre-d-hermes-edt": { src: "/ovl/terre-d-hermes-edt.jpg", alt: "Atmósfera editorial de Terre d'Hermes EDT" },
  "erba-pura": { src: "/ovl/erba-pura.jpg", alt: "Atmósfera editorial de Erba Pura" },
  "flowerbomb": { src: "/ovl/flowerbomb.jpg", alt: "Atmósfera editorial de Flowerbomb" },
};

/** Devuelve el mockup narrativo del perfume, o null si todavía no tiene uno
 * verificado — el caller debe mostrar un placeholder neutro en ese caso. */
export function getEditorialImage(slug: string): EditorialImage | null {
  return OVL_IMAGES[slug] ?? null;
}
