import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticuloBySlug, getPerfumes } from "@/lib/api";
import type { Perfume } from "@/lib/types";
import { ArticleHero } from "@/components/magazine/ArticleHero";
import { ArticleReadingView } from "@/components/magazine/ArticleReadingView";
import { RelatedPerfumes } from "@/components/magazine/RelatedPerfumes";
import { PersonalizedDiscoveryRail } from "@/components/discovery/PersonalizedDiscoveryRail";

export const dynamic = "force-dynamic";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const articulo = await getArticuloBySlug(params.slug);
  if (!articulo) return {};
  const title = articulo.meta_title ?? articulo.titulo;
  const description = articulo.meta_description ?? undefined;
  return { title, description, alternates: { canonical: `/magazine/${articulo.slug}` }, openGraph: { type: "article", title, description, publishedTime: articulo.publicado_en, authors: articulo.autor ? [articulo.autor] : undefined, images: articulo.imagen_portada_url ? [articulo.imagen_portada_url] : undefined }, twitter: { card: "summary_large_image", title, description, images: articulo.imagen_portada_url ? [articulo.imagen_portada_url] : undefined } };
}

export default async function MagazineArticlePage({ params }: { params: { slug: string } }) {
  const articulo = await getArticuloBySlug(params.slug);
  if (!articulo) notFound();
  let perfumes: Perfume[] = [];
  try { perfumes = await getPerfumes(); } catch { perfumes = []; }
  const ids = new Set(articulo.perfumes_relacionados ?? []);
  const relatedPerfumes = perfumes.filter((perfume) => ids.has(perfume.id));
  const canonicalUrl = `${SITE_URL}/magazine/${articulo.slug}`;
  const articleJsonLd = { "@context": "https://schema.org", "@type": "Article", headline: articulo.titulo, description: articulo.meta_description ?? undefined, image: articulo.imagen_portada_url ? [articulo.imagen_portada_url] : undefined, datePublished: articulo.publicado_en, author: articulo.autor ? { "@type": "Person", name: articulo.autor } : { "@type": "Organization", name: "Aromia" }, publisher: { "@type": "Organization", name: "Aromia" }, mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl } };
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} /><div className="border-b border-line"><div className="mx-auto flex h-[66px] max-w-[1440px] items-center justify-between px-6 lg:px-10"><Link href="/magazine" className="font-sans text-[12px] uppercase tracking-[.12em]">← Volver al Magazine</Link></div></div><ArticleHero article={articulo} /><section className="mx-auto max-w-[1180px] px-6 py-10 lg:px-10 lg:py-14"><div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(220px,.55fr)_minmax(0,1.45fr)] lg:gap-20"><ArticleReadingView article={articulo} />{articulo.contenido_html ? <article className="prose prose-neutral max-w-[760px] font-display text-[19px] leading-[1.75] text-ink prose-headings:font-display prose-headings:text-ink prose-p:text-ink prose-blockquote:border-gold prose-blockquote:text-ink md:text-[22px]" dangerouslySetInnerHTML={{ __html: articulo.contenido_html }} /> : null}</div></section><RelatedPerfumes perfumes={relatedPerfumes} articleSlug={articulo.slug} /><PersonalizedDiscoveryRail perfumes={perfumes} title="Continúa desde esta lectura" /></main>;
}
