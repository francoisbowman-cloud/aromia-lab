export interface EditorialImage {
  src: string;
  alt: string;
}

export const EDITORIAL_IMAGES: EditorialImage[] = [
  { src: "/editorial/bright-soft-focus.png", alt: "Escena editorial de perfumería en luz suave" },
  { src: "/editorial/cinematic-warm.png", alt: "Escena editorial de perfumería en tonos cálidos cinemáticos" },
  { src: "/editorial/golden-amber.png", alt: "Escena editorial de perfumería en ámbar dorado" },
  { src: "/editorial/luxurious-softlit.png", alt: "Escena editorial de perfumería con luz suave y lujosa" },
  { src: "/editorial/moody-closeup.png", alt: "Escena editorial de perfumería en primer plano, atmósfera moody" },
  { src: "/editorial/romantic-scene.png", alt: "Escena editorial de perfumería romántica" },
  { src: "/editorial/soft-romantic.png", alt: "Escena editorial de perfumería suave y romántica" },
  { src: "/editorial/sunlit-warm.png", alt: "Escena editorial de perfumería con luz solar cálida" },
];

/** Elige una imagen editorial de forma determinística a partir de un string (ej. el slug). */
export function pickEditorialImage(seed: string): EditorialImage {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return EDITORIAL_IMAGES[hash % EDITORIAL_IMAGES.length];
}
