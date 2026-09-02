import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticulos, getPerfumeBySlug, getPerfumes } from "@/lib/api";
import { getSimilarPerfumes } from "@/lib/discovery";
import { HeroHeader } from "@/components/perfume/HeroHeader";
import { PriceTable } from "@/components/perfume/PriceTable";
import { PerformanceBars } from "@/components/perfume/PerformanceBars";
import { SkinEvolution } from "@/components/perfume/SkinEvolution";
import { CommunityReviews } from "@/components/perfume/CommunityReviews";
import { EditorialMood } from "@/components/perfume/EditorialMood";
import { SimilarPerfumes } from "@/components/perfume/SimilarPerfumes";
import { RelatedEditorial } from "@/components/perfume/RelatedEditorial";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aromialab.com").replace(/\/$/, "");
function catalogImageUrl(slug: string) { return `${SITE_URL}/api/catalog-image/${encodeURIComponent(slug)}`; }
function catalogBuyUrl(slug: string) { return `${SITE_URL}/api/catalog-buy/${encodeURIComponent(slug)}`; }

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const perfume = await getPerfumeBySlug(params.slug); if (!perfume) return {};
  const titulo = `${perfume.nombre} — ${perfume.marca}`;
  const descripcion = perfume.descripcion_corta ?? `${perfume.nombre} de ${perfume.marca}: notas, evolución, rendimiento y dónde encontrar esta fragancia.`;
  const image = catalogImageUrl(perfume.slug);
  return { title: titulo, description: descripcion, alternates: { canonical: `/catalogo/${perfume.slug}` }, openGraph: { title: titulo, description: descripcion, images: [image], type: "website" }, twitter: { card: "summary_large_image", title: titulo, description: descripcion, images: [image] } };
}

function buildProductJsonLd(perfume: NonNullable<Awaited<ReturnType<typeof getPerfumeBySlug>>>) {
  const offer = perfume.link_afiliado && perfume.moneda && perfume.precio_referencia != null ? { "@type": "Offer", url: catalogBuyUrl(perfume.slug), priceCurrency: perfume.moneda, price: perfume.precio_referencia } : undefined;
  return { "@context": "https://schema.org", "@type": "Product", name: perfume.nombre, image: [catalogImageUrl(perfume.slug)], description: perfume.descripcion_corta, brand: { "@type": "Brand", name: perfume.marca }, offers: offer };
}

export default async function CatalogoDetailPage({ params }: { params: { slug: string } }) {
  const perfume = await getPerfumeBySlug(params.slug); if (!perfume) notFound();
  const [perfumes, articulos] = await Promise.all([getPerfumes(), getArticulos()]);
  const similares = getSimilarPerfumes(perfume, perfumes, 6);
  const relacionados = articulos.filter((article) => article.perfumes_relacionados?.includes(perfume.id));
  const verifiedNotes = [...(perfume.notas_salida ?? []), ...(perfume.notas_corazon ?? []), ...(perfume.notas_fondo ?? [])];

  return (
    <main className="bg-paper text-ink" aria-live="polite">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(perfume)) }} />

      <div className="mx-auto max-w-[1520px] px-5 pt-8 sm:px-8 lg:px-12 lg:pt-10">
        <nav aria-label="Ruta de navegación" className="mb-6 flex flex-wrap items-center gap-3 font-plex text-xs uppercase tracking-[.12em] text-muted">
          <Link href="/" className="transition hover:text-ink">Aromia</Link><span>／</span><Link href="/descubrir" className="transition hover:text-ink">Discovery</Link><span>／</span><span className="text-ink">{perfume.nombre}</span>
        </nav>
        <HeroHeader perfume={perfume}/>
      </div>

      <section className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mb-10 grid gap-6 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">02 / Anatomía</p><h2 className="mt-3 max-w-[11ch] font-display text-[38px] font-medium leading-[.96] tracking-[-.035em] text-ink sm:text-[48px]">Cómo cambia sobre la piel.</h2></div>
          <p className="max-w-[42ch] font-sans text-base leading-7 text-muted lg:justify-self-end">Salida, corazón y fondo solo aparecen cuando los datos están verificados. El rendimiento permanece separado de la descripción olfativa.</p>
        </div>
        <div className="grid grid-cols-1 gap-10 border-t border-line pt-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <SkinEvolution notasSalida={perfume.notas_salida} notasCorazon={perfume.notas_corazon} notasFondo={perfume.notas_fondo}/>
          <PerformanceBars longevidad={perfume.longevidad} estela={perfume.estela} proyeccion={perfume.proyeccion}/>
        </div>
      </section>

      <section className="border-y border-line bg-soft/40">
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="mb-10"><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">03 / Contexto</p><h2 className="mt-3 max-w-[14ch] font-display text-[38px] font-medium leading-[.96] tracking-[-.035em] text-ink sm:text-[48px]">El carácter detrás de las notas.</h2></div>
          <EditorialMood nombre={perfume.nombre} familia={perfume.familia_olfativa} notas={verifiedNotes} descripcion={perfume.descripcion_corta ?? perfume.resena_sintetizada}/>
        </div>
      </section>

      <section id="precios" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">04 / Compra informada</p>
        <div className="mb-10 mt-3 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_.72fr] lg:items-end">
          <h2 className="max-w-[12ch] font-display text-[40px] font-medium leading-[.96] tracking-[-.035em] text-ink sm:text-[50px]">Dónde encontrarlo.</h2>
          <p className="max-w-[40ch] font-sans text-base leading-7 text-muted lg:justify-self-end">Compara disponibilidad y precio sin perder de vista la identidad real del perfume.</p>
        </div>
        <PriceTable retailers={perfume.retailers ?? []} directLink={catalogBuyUrl(perfume.slug)} perfumeSlug={perfume.slug} perfumeNombre={perfume.nombre}/>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="mb-10"><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">05 / Comunidad</p><h2 className="mt-3 max-w-[13ch] font-display text-[38px] font-medium leading-[.96] tracking-[-.035em] text-ink sm:text-[48px]">Cómo lo viven otras personas.</h2></div>
          <CommunityReviews ratingPromedio={perfume.rating_promedio} resenaSintetizada={perfume.resena_sintetizada}/>
        </div>
      </section>

      <SimilarPerfumes sourceSlug={perfume.slug} results={similares} />
      <RelatedEditorial perfumeSlug={perfume.slug} articles={relacionados} />
      <section className="mx-auto max-w-[1240px] px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        <div className="flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[42ch] font-sans text-sm leading-6 text-muted">Esta ficha es una referencia dentro de Aromia. Puedes volver al mapa o seguir leyendo para recuperar contexto.</p>
          <div className="flex gap-6"><Link href="/descubrir" className="nav-link text-sm text-ink">Volver a Discovery</Link><Link href="/magazine" className="nav-link text-sm text-ink">Seguir leyendo</Link></div>
        </div>
      </section>
    </main>
  );
}
