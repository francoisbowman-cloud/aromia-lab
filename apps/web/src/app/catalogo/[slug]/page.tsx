import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPerfumeBySlug } from "@/lib/api";
import { HeroHeader } from "@/components/perfume/HeroHeader";
import { ProductAnatomy } from "@/components/perfume/ProductAnatomy";
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
  const retailerOffers = (perfume.retailers ?? []).filter((r) => Boolean(r.link_afiliado) && Boolean(r.moneda) && r.precio != null).map((r) => ({ "@type": "Offer", url: r.link_afiliado, priceCurrency: r.moneda, price: r.precio }));
  const referenceOffer = perfume.link_afiliado && perfume.moneda && perfume.precio_referencia != null ? [{ "@type": "Offer", url: perfume.link_afiliado, priceCurrency: perfume.moneda, price: perfume.precio_referencia }] : [];
  const offers = retailerOffers.length > 0 ? retailerOffers : referenceOffer;
  return { "@context": "https://schema.org", "@type": "Product", name: perfume.nombre, image: perfume.imagen_url ? [perfume.imagen_url] : undefined, description: perfume.descripcion_corta, brand: { "@type": "Brand", name: perfume.marca }, offers: offers.length === 0 ? undefined : offers.length === 1 ? offers[0] : offers };
}

const SECTION_META = "font-plex text-[9px] uppercase tracking-[.18em] text-muted";

export default async function CatalogoDetailPage({ params }: { params: { slug: string } }) {
  const perfume = await getPerfumeBySlug(params.slug);
  if (!perfume) notFound();

  const story = perfume.resena_sintetizada ?? perfume.descripcion_corta ?? `${perfume.nombre} se estudia aquí como objeto, composición y experiencia sobre piel.`;

  return (
    <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]" aria-live="polite">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(perfume)) }} />

      <div className="mx-auto max-w-[1440px] px-6 pt-7 lg:px-10 lg:pt-9">
        <nav aria-label="Migas de pan" className="mb-6 flex flex-wrap items-center gap-3 font-plex text-[8px] uppercase tracking-[.16em] text-muted">
          <Link href="/">Inicio</Link><span>／</span><Link href="/catalogo">Catálogo</Link><span>／</span><span className="text-ink">{perfume.nombre}</span>
        </nav>
        <HeroHeader perfume={perfume} />
      </div>

      <ProductAnatomy perfume={perfume} />

      <section className="border-y border-line bg-[#f2eadf] dark:bg-[#15110d]">
        <div className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-28">
          <div className="mb-12 flex items-center gap-4 border-b border-line pb-4"><span className={SECTION_META}>02 / Performance</span><span className="h-px flex-1 bg-line"/><span className={SECTION_META}>Skin study</span></div>
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
            <div>
              <p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Presencia</p>
              <h2 className="mt-4 max-w-[8ch] font-display text-[48px] font-medium leading-[.9] tracking-[-.035em] text-ink lg:text-[72px]">Cómo ocupa <em className="font-medium text-gold-contrast">el aire.</em></h2>
              <p className="mt-6 max-w-[34ch] font-sans text-sm leading-6 text-muted">Longevidad, estela y proyección se leen como señales distintas. No explican si un perfume es bueno; explican cómo se comporta.</p>
              <div className="mt-10"><PerformanceBars longevidad={perfume.longevidad} estela={perfume.estela} proyeccion={perfume.proyeccion} /></div>
            </div>
            <SkinEvolution notasSalida={perfume.notas_salida} notasCorazon={perfume.notas_corazon} notasFondo={perfume.notas_fondo} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mb-12 flex items-center gap-4 border-b border-line pb-4"><span className={SECTION_META}>03 / Story</span><span className="h-px flex-1 bg-line"/><span className={SECTION_META}>{perfume.marca}</span></div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
          <div>
            <p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Aromia reading</p>
            <h2 className="mt-4 max-w-[8ch] font-display text-[46px] font-medium leading-[.92] tracking-[-.03em] text-ink lg:text-[68px]">Más que una pirámide de notas.</h2>
          </div>
          <div className="border-l border-gold/40 pl-7 lg:pl-12">
            <p className="max-w-[23ch] font-display text-[34px] italic leading-[1.08] text-ink lg:text-[46px]">“{story}”</p>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-6 border-t border-line pt-6">
              {perfume.temporada_recomendada?.length ? <div><p className={SECTION_META}>Temporada</p><p className="mt-2 font-display text-xl italic text-ink">{perfume.temporada_recomendada.join(" · ")}</p></div> : null}
              {perfume.ocasion?.length ? <div><p className={SECTION_META}>Ocasión</p><p className="mt-2 font-display text-xl italic text-ink">{perfume.ocasion.join(" · ")}</p></div> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pb-20 lg:px-10 lg:pb-28">
        <div className="mb-7 flex items-center gap-4 border-b border-line pb-4"><span className={SECTION_META}>04 / Atmosphere</span><span className="h-px flex-1 bg-line"/><span className={SECTION_META}>Editorial scene</span></div>
        <EditorialMood slug={perfume.slug} nombre={perfume.nombre} />
      </section>

      <section id="precios" className="scroll-mt-24 border-y border-line bg-[#fffdf8] dark:bg-[#100d0a]">
        <div className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[.62fr_1.38fr] lg:gap-20">
            <div>
              <p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">05 / Commerce</p>
              <h2 className="mt-4 max-w-[8ch] font-display text-[48px] font-medium leading-[.9] tracking-[-.035em] text-ink lg:text-[72px]">Comprar con <em className="font-medium text-gold-contrast">contexto.</em></h2>
              <p className="mt-6 max-w-[34ch] font-sans text-sm leading-6 text-muted">Solo mostramos ofertas cuando existe información comercial disponible. El precio de referencia no sustituye la comprobación final en el retailer.</p>
            </div>
            <PriceTable retailers={perfume.retailers ?? []} perfumeSlug={perfume.slug} perfumeNombre={perfume.nombre} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mb-12 flex items-center gap-4 border-b border-line pb-4"><span className={SECTION_META}>06 / Community</span><span className="h-px flex-1 bg-line"/><span className={SECTION_META}>Closing signal</span></div>
        <CommunityReviews ratingPromedio={perfume.rating_promedio} resenaSintetizada={perfume.resena_sintetizada} />
        <div className="mt-14 flex flex-col gap-5 border-b border-line pb-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[28ch] font-display text-[30px] italic leading-tight text-ink">El siguiente perfume empieza donde termina tu curiosidad.</p>
          <Link href="/catalogo" className="group inline-flex w-fit items-center gap-3 border-b border-ink pb-2 font-plex text-[9px] uppercase tracking-[.15em] text-ink transition hover:border-gold hover:text-gold-contrast dark:border-[#f2ebdd]">Volver al catálogo <span className="transition-transform group-hover:translate-x-1">→</span></Link>
        </div>
      </section>
    </main>
  );
}
