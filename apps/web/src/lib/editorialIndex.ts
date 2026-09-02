import type { Article } from "./types";

export type EditorialTerritory = "Historias" | "Materia" | "Personas" | "Reflexión" | "Guías" | "Análisis";

export interface EditorialIndexItem {
  slug: string;
  href: string;
  title: string;
  summary: string;
  territory: EditorialTerritory;
  source: "story" | "magazine";
  publishedAt?: string;
}

export const EDITORIAL_STORIES: EditorialIndexItem[] = [
  {
    slug: "el-coleccionista",
    href: "/historias/el-coleccionista",
    title: "El coleccionista",
    summary: "Hay un estante que ya no tiene espacio. Frente a un frasco nuevo, sin embargo, la primera pregunta todavía puede ser: ¿a qué huele?",
    territory: "Reflexión",
    source: "story",
  },
  {
    slug: "el-perfume-que-encargo-un-sultan",
    href: "/historias/el-perfume-que-encargo-un-sultan",
    title: "El perfume que encargó un sultán",
    summary: "En 1982, un perfumista francés viajó a Mascate para componer una fragancia por encargo directo de un sultán.",
    territory: "Historias",
    source: "story",
  },
  {
    slug: "el-ambar-que-nunca-toco-una-ballena",
    href: "/historias/el-ambar-que-nunca-toco-una-ballena",
    title: "El ámbar que nunca tocó una ballena",
    summary: "Una molécula familiar cuya historia empieza con una rareza del mar y termina muy lejos de una ballena.",
    territory: "Materia",
    source: "story",
  },
  {
    slug: "el-perfumista-que-no-teme-exagerar",
    href: "/historias/el-perfumista-que-no-teme-exagerar",
    title: "El perfumista que no teme exagerar",
    summary: "Dominique Ropion y la disciplina que hace posible llevar una materia al límite sin perder precisión.",
    territory: "Personas",
    source: "story",
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
  };
}

export function buildEditorialIndex(articles: Article[]) {
  const seen = new Set<string>();
  const combined = [...EDITORIAL_STORIES, ...articles.filter((article) => article.categoria !== "academia").map(magazineArticleToIndexItem)];
  return combined.filter((item) => {
    const key = item.href;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
