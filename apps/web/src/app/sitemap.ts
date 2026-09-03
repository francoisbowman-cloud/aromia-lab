import type { MetadataRoute } from "next";
import { getPerfumes, getArticulos } from "@/lib/api";
import { PERFUMERS } from "@/lib/perfumers";
import { EDITORIAL_STORIES } from "@/lib/editorialIndex";
import { OLFACTIVE_FAMILIES } from "@/lib/olfactiveFamilies";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const estaticas: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/magazine`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/academia`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/buscar`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/descubrir`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/descubrir/familias`, changeFrequency: "monthly", priority: 0.7 },
    ...OLFACTIVE_FAMILIES.map((family) => ({
      url: `${SITE_URL}/descubrir/familias/${family.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${SITE_URL}/perfumistas`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/quiz`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/club`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const historias: MetadataRoute.Sitemap = EDITORIAL_STORIES.map((story) => ({ url: `${SITE_URL}${story.href}`, changeFrequency: "monthly", priority: 0.8 }));

  const [perfumesResult, articulosResult] = await Promise.allSettled([getPerfumes(), getArticulos()]);
  const perfumes = perfumesResult.status === "fulfilled" ? perfumesResult.value : [];
  const articulos = articulosResult.status === "fulfilled" ? articulosResult.value : [];
  const published = new Set(perfumes.map((p) => p.slug));

  const paginasPerfumes: MetadataRoute.Sitemap = perfumes.map((p) => ({ url: `${SITE_URL}/catalogo/${p.slug}`, changeFrequency: "weekly", priority: 0.7 }));
  const paginasArticulos: MetadataRoute.Sitemap = articulos.filter((a) => a.categoria !== "academia").map((a) => ({ url: `${SITE_URL}/magazine/${a.slug}`, lastModified: a.publicado_en, changeFrequency: "monthly", priority: 0.6 }));
  const paginasPerfumistas: MetadataRoute.Sitemap = PERFUMERS.filter((profile) => profile.perfumeSlugs.some((slug) => published.has(slug))).map((profile) => ({ url: `${SITE_URL}/perfumistas/${profile.slug}`, changeFrequency: "monthly", priority: 0.6 }));

  return [...estaticas, ...historias, ...paginasPerfumes, ...paginasPerfumistas, ...paginasArticulos];
}
