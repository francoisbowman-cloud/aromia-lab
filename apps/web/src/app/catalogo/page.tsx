import type { Metadata } from "next";
import { getPerfumes } from "@/lib/api";
import { PerfumesCatalog } from "@/components/perfume/PerfumesCatalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo — Aromia",
  description: "Comparador de perfumes: precios, notas y dónde comprar cada fragancia.",
  alternates: { canonical: "/catalogo" },
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { familia?: string };
}) {
  const perfumes = await getPerfumes();

  return (
    <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]">
      <section className="mx-auto w-full max-w-[1360px] px-6 pb-6 pt-10 lg:px-10 lg:pb-8 lg:pt-14">
        <div className="flex flex-col gap-7 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-plex text-[9px] uppercase tracking-[.22em] text-gold-contrast">Discovery / catálogo 02</p>
            <h1 className="mt-3 font-display text-[48px] font-medium leading-[.9] tracking-[-.035em] text-ink lg:text-[74px]">Catálogo</h1>
          </div>
          <p className="max-w-[44ch] font-sans text-sm leading-6 text-muted lg:text-right">
            Busca por familia, presencia o contexto. Los filtros afinan la selección sin esconderte nunca la salida.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1360px] px-6 pb-20 lg:px-10 lg:pb-28">
        {perfumes.length === 0 ? (
          <p className="font-sans text-sm text-muted">Todavía no hay perfumes cargados.</p>
        ) : (
          <PerfumesCatalog perfumes={perfumes} initialFamilia={searchParams.familia} />
        )}
      </section>
    </main>
  );
}
