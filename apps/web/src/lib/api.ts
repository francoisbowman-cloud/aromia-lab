import type { Article, Perfume } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function getPerfumes(): Promise<Perfume[]> {
  const res = await fetch(`${API_BASE_URL}/api/perfumes`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Error al obtener perfumes: ${res.status}`);
  }

  return res.json();
}

export async function getArticulos(): Promise<Article[]> {
  const res = await fetch(`${API_BASE_URL}/api/articulos`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Error al obtener artículos: ${res.status}`);
  }

  return res.json();
}

export async function getArticuloBySlug(slug: string): Promise<Article | null> {
  const res = await fetch(`${API_BASE_URL}/api/articulos/${slug}`, {
    next: { revalidate: 60 },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Error al obtener artículo ${slug}: ${res.status}`);
  }

  return res.json();
}

export async function getPerfumeBySlug(slug: string): Promise<Perfume | null> {
  const res = await fetch(`${API_BASE_URL}/api/perfumes/${slug}`, {
    next: { revalidate: 60 },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Error al obtener perfume ${slug}: ${res.status}`);
  }

  return res.json();
}
