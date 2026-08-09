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
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(perfume)) }}
      />
      <div className="mx-auto max-w-[1360px] px-6 pt-8 lg:px-10 lg:pt-10">
        <div className="mb-6 flex items-center gap-3 font-plex text-[8px] uppercase tracking-[.16em] text-muted"><span>Inicio</span><span>／</span><span>Catálogo</span><span>／</span><span className="text-ink">{perfume.nombre}</span></div>
        <HeroHeader perfume={perfume} />
      </div>

      <section id="precios" className="mx-auto max-w-[1160px] scroll-mt-24 px-6 py-16 lg:px-10 lg:py-24">
        <div className="mb-8 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>Commerce</span><span className="h-px flex-1 bg-line"/><span>04 / Dónde comprar</span></div>
        <PriceTable retailers={perfume.retailers ?? []} perfumeSlug={perfume.slug} perfumeNombre={perfume.nombre} />
      </section>

      <section className="border-y border-line bg-[#f4ede2] dark:bg-[#15110d]">
        <div className="mx-auto grid max-w-[1160px] grid-cols-1 gap-8 px-6 py-16 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-24">
          <PerformanceBars longevidad={perfume.longevidad} estela={perfume.estela} proyeccion={perfume.proyeccion} />
          <SkinEvolution notasSalida={perfume.notas_salida} notasCorazon={perfume.notas_corazon} notasFondo={perfume.notas_fondo} />
        </div>
      </section>

      <section className="mx-auto max-w-[1160px] px-6 py-16 lg:px-10 lg:py-24">
        <div className="mb-10 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>Editorial study</span><span className="h-px flex-1 bg-line"/><span>05 / Contexto</span></div>
        <EditorialMood slug={perfume.slug} nombre={perfume.nombre} />
      </section>

      <section className="border-t border-line bg-[#fffdf8] dark:bg-[#100d0a]">
        <div className="mx-auto max-w-[1160px] px-6 py-16 lg:px-10 lg:py-24"><CommunityReviews ratingPromedio={perfume.rating_promedio} resenaSintetizada={perfume.resena_sintetizada} /></div>
      </section>
    </main>
  );
}
