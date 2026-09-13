import type { Article } from "./types";

export type EditorialTerritory = "Historias" | "Materia" | "Personas" | "Reflexión" | "Guías" | "Análisis";
export type EditorialLevel = "n1" | "n2" | "n3" | "n4";

export interface EditorialIndexItem {
  slug: string;
  href: string;
  title: string;
  summary: string;
  territory: EditorialTerritory;
  source: "story" | "magazine";
  publishedAt?: string;
  relatedPerfumerSlug?: string;
  nivel?: EditorialLevel;
  imageUrl?: string;
  imageAlt?: string;
}

// Assignado a mano por Code para las 4 historias hardcodeadas: son las únicas
// piezas con foto propia de la escena hoy disponibles, así que el criterio de
// Design (foto real + reportaje propio + lectura larga = N1) solo lo cumple
// el sultán. Cuando los artículos del magazine empiecen a recibir `nivel`
// desde /admin/magazine, conviven con este mapa sin conflicto (slugs no se
// pisan entre `story` y `magazine`).
export const EDITORIAL_STORIES: EditorialIndexItem[] = [
  {
    slug: "el-coleccionista",
    href: "/historias/el-coleccionista",
    title: "El coleccionista",
    summary: "Hay un estante que ya no tiene espacio. Frente a un frasco nuevo, sin embargo, la primera pregunta todavía puede ser: ¿a qué huele?",
    territory: "Reflexión",
    source: "story",
    nivel: "n4",
  },
  {
    slug: "el-perfume-que-encargo-un-sultan",
    href: "/historias/el-perfume-que-encargo-un-sultan",
    title: "El perfume que encargó un sultán",
    summary: "En 1982, un perfumista francés viajó a Mascate para componer una fragancia por encargo directo de un sultán.",
    territory: "Historias",
    source: "story",
    nivel: "n1",
    imageUrl: "/editorial-v1/oman-place-documentary.jpg",
    imageAlt: "Paisaje de Jabal Akhdar, Omán, contexto de El perfume que encargó un sultán.",
  },
  {
    slug: "el-ambar-que-nunca-toco-una-ballena",
    href: "/historias/el-ambar-que-nunca-toco-una-ballena",
    title: "El ámbar que nunca tocó una ballena",
    summary: "Una molécula familiar cuya historia empieza con una rareza del mar y termina muy lejos de una ballena.",
    territory: "Materia",
    source: "story",
    nivel: "n3",
    imageUrl: "/editorial-v1/clary-sage-documentary.jpg",
    imageAlt: "Salvia sclarea, materia vegetal vinculada a la historia moderna del ambroxan.",
  },
  {
    slug: "el-perfumista-que-no-teme-exagerar",
    href: "/historias/el-perfumista-que-no-teme-exagerar",
    title: "El perfumista que no teme exagerar",
    summary: "Dominique Ropion y la disciplina que hace posible llevar una materia al límite sin perder precisión.",
    territory: "Personas",
    source: "story",
    relatedPerfumerSlug: "dominique-ropion",
    nivel: "n2",
    imageUrl: "/editorial-v1/red-rose-interpretive.jpg",
    imageAlt: "Rosa rojo profundo, imagen editorial asociada al trabajo floral de Dominique Ropion.",
  },
];

function territoryForArticle(article: Article): EditorialTerritory {
  if (article.categoria === "guia") return "Guías";
  if (article.categoria === "analisis" || article.categoria === "tendencias") return "Análisis";
  if (article.categoria === "academia") return "Materia";
  return "Historias";
}

export function magazineArticleToIndexItem(article: Article): EditorialIndexItem {
  return {
    slug: article.slug,
    href: `/magazine/${article.slug}`,
    title: article.titulo,
    summary: article.meta_description ?? "Una lectura editorial de Aromia.",
    territory: territoryForArticle(article),
    source: "magazine",
    publishedAt: article.publicado_en,
    // Sin `nivel` asignado desde /admin/magazine, la pieza cae en N3 (fila
    // corriente) — ver EditorialArchive.tsx.
    nivel: article.nivel ?? undefined,
    imageUrl: article.imagen_portada_url ?? undefined,
  };
}

export function buildEditorialIndex(articles: Article[]) {
  const seen = new Set<string>();
  const combined = [...EDITORIAL_STORIES, ...articles.filter((article) => article.categoria !== "academia").map(magazineArticleToIndexItem)];
  return combined.filter((item) => {
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });
}
