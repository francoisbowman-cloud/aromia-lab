// Los 9 slugs de SubBatch 01, ingestados a Postgres pero servidos por su
// propio render en /historias/{slug} (no /magazine/{slug}, que usa
// contenido_html en vez de contenido_markdown). Módulo aparte, sin más
// dependencias, para que tanto subBatch01Story.tsx (el render) como
// editorialIndex.ts (que los excluye del archivo/búsqueda a propósito)
// puedan importarlo sin arrastrar JSX ni CSS modules entre sí.
export const SUBBATCH_01_SLUGS = [
  "antes-del-perfume-ya-oliamos",
  "comprar-para-oler-o-comprar-para-tener",
  "cuando-ya-no-hueles-tu-perfume",
  "fougere-no-significa-viejo",
  "huele-sintetico-que-estamos-diciendo",
  "lavanda-limpia-medicinal-barata-elegante",
  "nos-perfumamos-para-nosotros-o-para-los-demas",
  "podemos-describir-un-olor-sin-compararlo",
  "por-que-una-lista-de-notas-no-te-dice-como-huele",
] as const;

export type SubBatch01Slug = (typeof SUBBATCH_01_SLUGS)[number];
