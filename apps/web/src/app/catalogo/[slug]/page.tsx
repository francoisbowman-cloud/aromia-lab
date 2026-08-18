import type { Metadata } from "next";
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

  return (
    <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]" aria-live="polite">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(perfume)) }} />

      <div className="mx-auto max-w-[1360px] px-6 pt-8 lg:px-10 lg:pt-10">
        <div className="mb-6 flex items-center gap-3 font-plex text-[8px] uppercase tracking-[.16em] text-muted"><span>Inicio</span><span>／</span><span>Catálogo</span><span>／</span><span className="text-ink">{perfume.nombre}</span></div>
        <HeroHeader perfume={perfume}/>
      </div>

      <section className="mx-auto max-w-[1160px] px-6 py-16 lg:px-10 lg:py-24">
        <div className="mb-10">
          <p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">02 / Evolución</p>
          <h2 className="mt-3 max-w-[12ch] font-display text-[36px] font-medium leading-[1] tracking-[-.025em] text-ink sm:text-[42px]">Cómo cambia sobre la piel.</h2>
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[.95fr_1.05fr] lg:gap-16">
          <SkinEvolution notasSalida={perfume.notas_salida} notasCorazon={perfume.notas_corazon} notasFondo={perfume.notas_fondo}/>
          <PerformanceBars longevidad={perfume.longevidad} estela={perfume.estela} proyeccion={perfume.proyeccion}/>
        </div>
      </section>

      <section className="bg-[#f3eadc] dark:bg-[#15110d]">
        <div className="mx-auto max-w-[1160px] px-6 py-16 lg:px-10 lg:py-24">
          <div className="mb-10">
            <p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">03 / Contexto</p>
            <h2 className="mt-3 max-w-[14ch] font-display text-[36px] font-medium leading-[1] tracking-[-.025em] text-ink sm:text-[42px]">El carácter detrás de las notas.</h2>
          </div>
          <EditorialMood slug={perfume.slug} nombre={perfume.nombre}/>
        </div>
      </section>

      <section id="precios" className="mx-auto max-w-[1160px] scroll-mt-24 px-6 py-16 lg:px-10 lg:py-24">
        <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">04 / Compra informada</p>
        <div className="mb-10 mt-3 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_.72fr] lg:items-end">
          <h2 className="max-w-[12ch] font-display text-[38px] font-medium leading-[.98] tracking-[-.03em] text-ink sm:text-[44px] lg:text-[52px]">Dónde encontrarlo.</h2>
          <p className="max-w-[40ch] font-sans text-base leading-7 text-muted lg:justify-self-end">Compara disponibilidad y precio sin perder de vista la identidad real del perfume.</p>
        </div>
        <PriceTable retailers={perfume.retailers ?? []} directLink={catalogBuyUrl(perfume.slug)} perfumeSlug={perfume.slug} perfumeNombre={perfume.nombre}/>
      </section>

      <section className="bg-[#fffdf8] dark:bg-[#100d0a]">
        <div className="mx-auto max-w-[1160px] px-6 py-16 lg:px-10 lg:py-24">
          <div className="mb-10">
            <p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">05 / Comunidad</p>
            <h2 className="mt-3 max-w-[13ch] font-display text-[36px] font-medium leading-[1] tracking-[-.025em] text-ink sm:text-[42px]">Cómo lo viven otras personas.</h2>
          </div>
          <CommunityReviews ratingPromedio={perfume.rating_promedio} resenaSintetizada={perfume.resena_sintetizada}/>
        </div>
      </section>

      <SimilarPerfumes sourceSlug={perfume.slug} results={similares} />
      <RelatedEditorial perfumeSlug={perfume.slug} articles={relacionados} />
    </main>
  );
}
