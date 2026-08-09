import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPerfumeBySlug } from "@/lib/api";
import { HeroHeader } from "@/components/perfume/HeroHeader";
import { PriceTable } from "@/components/perfume/PriceTable";
import { PerformanceBars } from "@/components/perfume/PerformanceBars";
import { SkinEvolution } from "@/components/perfume/SkinEvolution";
import { CommunityReviews } from "@/components/perfume/CommunityReviews";
import { EditorialMood } from "@/components/perfume/EditorialMood";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const perfume = await getPerfumeBySlug(params.slug);
  if (!perfume) return {};
  const titulo = `${perfume.nombre} — ${perfume.marca} | Aromia`;
  const descripcion = perfume.descripcion_corta ?? `${perfume.nombre} de ${perfume.marca}: notas y análisis de la fragancia en Aromia.`;
  return { title: titulo, description: descripcion, alternates: { canonical: `/catalogo/${perfume.slug}` }, openGraph: { title: titulo, description: descripcion, images: perfume.imagen_url ? [perfume.imagen_url] : undefined, type: "website" }, twitter: { card: "summary_large_image", title: titulo, description: descripcion, images: perfume.imagen_url ? [perfume.imagen_url] : undefined } };
}

function buildProductJsonLd(perfume: NonNullable<Awaited<ReturnType<typeof getPerfumeBySlug>>>) {
  const retailerOffers = (perfume.retailers ?? [])
    .filter((r) => Boolean(r.link_afiliado) && Boolean(r.moneda) && r.precio != null)
    .map((r) => ({ "@type": "Offer", url: r.link_afiliado, priceCurrency: r.moneda, price: r.precio }));
  const referenceOffer = perfume.link_afiliado && perfume.moneda && perfume.precio_referencia != null
    ? [{ "@type": "Offer", url: perfume.link_afiliado, priceCurrency: perfume.moneda, price: perfume.precio_referencia }]
    : [];
  const offers = retailerOffers.length > 0 ? retailerOffers : referenceOffer;
  return { "@context": "https://schema.org", "@type": "Product", name: perfume.nombre, image: perfume.imagen_url ? [perfume.imagen_url] : undefined, description: perfume.descripcion_corta, brand: { "@type": "Brand", name: perfume.marca }, offers: offers.length === 0 ? undefined : offers.length === 1 ? offers[0] : offers };
}

export default async function CatalogoDetailPage({ params }: { params: { slug: string } }) {
  const perfume = await getPerfumeBySlug(params.slug);
  if (!perfume) notFound();

  return (
    <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]" aria-live="polite">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(perfume)) }} />

      <div className="mx-auto max-w-[1360px] px-6 pt-8 lg:px-10 lg:pt-10">
        <div className="mb-6 flex items-center gap-3 font-plex text-[8px] uppercase tracking-[.16em] text-muted"><span>Inicio</span><span>／</span><span>Catálogo</span><span>／</span><span className="text-ink">{perfume.nombre}</span></div>
        <HeroHeader perfume={perfume} />
      </div>

      <section className="mx-auto max-w-[1160px] px-6 py-16 lg:px-10 lg:py-24">
        <div className="mb-10 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>Anatomía sensorial</span><span className="h-px flex-1 bg-line"/><span>02 / Evolución</span></div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[.95fr_1.05fr] lg:gap-14">
          <SkinEvolution notasSalida={perfume.notas_salida} notasCorazon={perfume.notas_corazon} notasFondo={perfume.notas_fondo} />
          <PerformanceBars longevidad={perfume.longevidad} estela={perfume.estela} proyeccion={perfume.proyeccion} />
        </div>
      </section>

      <section className="border-y border-line bg-[#f3eadc] dark:bg-[#15110d]">
        <div className="mx-auto max-w-[1160px] px-6 py-16 lg:px-10 lg:py-24">
          <div className="mb-10 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>Editorial study</span><span className="h-px flex-1 bg-line"/><span>03 / Contexto</span></div>
          <EditorialMood slug={perfume.slug} nombre={perfume.nombre} />
        </div>
      </section>

      <section id="precios" className="mx-auto max-w-[1160px] scroll-mt-24 px-6 py-16 lg:px-10 lg:py-24">
        <div className="mb-3 font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Compra informada</div>
        <div className="mb-10 grid grid-cols-1 gap-5 border-b border-line pb-8 lg:grid-cols-[1fr_.72fr] lg:items-end">
          <h2 className="max-w-[12ch] font-display text-[42px] font-medium leading-[.95] tracking-[-.03em] text-ink lg:text-[58px]">Dónde encontrarlo, sin romper la historia.</h2>
          <p className="max-w-[44ch] font-sans text-sm leading-6 text-muted lg:justify-self-end">Precios y enlaces se muestran como una capa de decisión, después de entender el objeto, su evolución y su carácter.</p>
        </div>
        <PriceTable retailers={perfume.retailers ?? []} perfumeSlug={perfume.slug} perfumeNombre={perfume.nombre} />
      </section>

      <section className="border-t border-line bg-[#fffdf8] dark:bg-[#100d0a]">
        <div className="mx-auto max-w-[1160px] px-6 py-16 lg:px-10 lg:py-24">
          <div className="mb-10 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>Comunidad</span><span className="h-px flex-1 bg-line"/><span>05 / Lectura colectiva</span></div>
          <CommunityReviews ratingPromedio={perfume.rating_promedio} resenaSintetizada={perfume.resena_sintetizada} />
        </div>
      </section>
    </main>
  );
}
