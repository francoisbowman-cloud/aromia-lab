import type { Article } from "./types";

export const CATEGORIA_LABEL: Record<Article["categoria"], string> = {
  resena: "Reseña",
  guia: "Guía",
  analisis: "Análisis",
  academia: "Academia",
  tendencias: "Tendencias",
};

export interface MagazineTab {
  key: string;
  label: string;
  categorias: Article["categoria"][] | null;
}

export const MAGAZINE_TABS: MagazineTab[] = [
  { key: "todos", label: "Todos", categorias: null },
  { key: "resena", label: "Reseñas", categorias: ["resena"] },
  { key: "guia", label: "Guías", categorias: ["guia"] },
  { key: "academia", label: "Academia", categorias: ["academia"] },
  { key: "analisis-tendencias", label: "Análisis y tendencias", categorias: ["analisis", "tendencias"] },
];
