import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPerfumeBySlug } from "@/lib/api";
import { HeroHeader } from "@/components/perfume/HeroHeader";
import { PriceTable } from "@/components/perfume/PriceTable";
import { PerformanceBars } from "@/components/perfume/PerformanceBars";
import { SkinEvolution } from "@/components/perfume/SkinEvolution";
import { CommunityReviews } from "@/components/perfume/CommunityReviews";
import { EditorialMood } from "@/components/perfume/EditorialMood";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const perfume = await getPerfumeBySlug(params.slug);
  if (!perfume) return {};

  const titulo = `${perfume.nombre} — ${perfume.marca} | Aromia`;
  const descripcion =
    perfume.descripcion_corta ??
    `${perfume.nombre} de ${perfume.marca}: notas, precio de referencia y dónde comprarlo en Aromia.`;

  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: `/catalogo/${perfume.slug}` },
    openGraph: {
      title: titulo,
      description: descripcion,
      images: perfume.imagen_url ? [perfume.imagen_url] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      images: perfume.imagen_url ? [perfume.imagen_url] : undefined,
    },
  };
}

/** Solo los campos verificables (nombre/marca/imagen/oferta) — sin
 * aggregateRating: rating_promedio hoy no tiene un conteo real de reseñas
 * detrás (ver CommunityReviews, "Aún no hay reseñas disponibles"), y
 * Google penaliza structured data de rating no verificable. Se suma
 * aggregateRating el día que haya reseñas reales con conteo. */
function buildProductJsonLd(perfume: NonNullable<Awaited<ReturnType<typeof getPerfumeBySlug>>>) {
  const offers =
    perfume.retailers && perfume.retailers.length > 0
      ? perfume.retailers.map((r) => ({
          "@type": "Offer",
          url: r.link_afiliado,
          priceCurrency: r.moneda,
          price: r.precio,
        }))
      : [
          {
            "@type": "Offer",
            url: perfume.link_afiliado,
            priceCurrency: perfume.moneda,
            price: perfume.precio_referencia,
          },
        ];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: perfume.nombre,
    image: perfume.imagen_url ? [perfume.imagen_url] : undefined,
    description: perfume.descripcion_corta,
    brand: { "@type": "Brand", name: perfume.marca },
    offers: offers.length === 1 ? offers[0] : offers,
  };
}

export default async function CatalogoDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const perfume = await getPerfumeBySlug(params.slug);

  if (!perfume) notFound();

  return (
    <main
      className="mx-auto flex max-w-5xl flex-col gap-8 p-6 lg:p-10"
      aria-live="polite"
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildProductJsonLd(perfume)) }}
      />
      <HeroHeader perfume={perfume} />
      <PriceTable retailers={perfume.retailers ?? []} />
      <PerformanceBars
        longevidad={perfume.longevidad}
        estela={perfume.estela}
        proyeccion={perfume.proyeccion}
      />
      <SkinEvolution
        notasSalida={perfume.notas_salida}
        notasCorazon={perfume.notas_corazon}
        notasFondo={perfume.notas_fondo}
      />
      <EditorialMood slug={perfume.slug} nombre={perfume.nombre} />
      <CommunityReviews
        ratingPromedio={perfume.rating_promedio}
        resenaSintetizada={perfume.resena_sintetizada}
      />
    </main>
  );
}
