import { notFound } from "next/navigation";
import { getPerfumeBySlug } from "@/lib/api";
import { HeroHeader } from "@/components/perfume/HeroHeader";
import { PriceTable } from "@/components/perfume/PriceTable";
import { OlfactiveRadar } from "@/components/perfume/OlfactiveRadar";
import { SkinEvolution } from "@/components/perfume/SkinEvolution";
import { CommunityReviews } from "@/components/perfume/CommunityReviews";

export default async function PerfumeDetailPage({
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
      <HeroHeader perfume={perfume} />
      <PriceTable retailers={perfume.retailers ?? []} />
      <OlfactiveRadar
        longevidad={perfume.longevidad}
        estela={perfume.estela}
        proyeccion={perfume.proyeccion}
      />
      <SkinEvolution
        notasSalida={perfume.notas_salida}
        notasCorazon={perfume.notas_corazon}
        notasFondo={perfume.notas_fondo}
      />
      <CommunityReviews
        ratingPromedio={perfume.rating_promedio}
        resenaSintetizada={perfume.resena_sintetizada}
      />
    </main>
  );
}
