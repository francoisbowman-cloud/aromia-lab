import type { MetadataRoute } from "next";
import { getPerfumes, getArticulos } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const estaticas: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/catalogo`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/buscar`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/magazine`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/quiz`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/club`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const [perfumesResult, articulosResult] = await Promise.allSettled([getPerfumes(), getArticulos()]);
  const perfumes = perfumesResult.status === "fulfilled" ? perfumesResult.value : [];
  const articulos = articulosResult.status === "fulfilled" ? articulosResult.value : [];

  const paginasPerfumes: MetadataRoute.Sitemap = perfumes.map((p) => ({ url: `${SITE_URL}/catalogo/${p.slug}`, changeFrequency: "weekly", priority: 0.7 }));
  const paginasArticulos: MetadataRoute.Sitemap = articulos.map((a) => ({ url: `${SITE_URL}/magazine/${a.slug}`, lastModified: a.publicado_en, changeFrequency: "monthly", priority: 0.6 }));

  return [...estaticas, ...paginasPerfumes, ...paginasArticulos];
}
