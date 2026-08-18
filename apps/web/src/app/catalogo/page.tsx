import type { Metadata } from "next";
import { getPerfumes } from "@/lib/api";
import { ResilientPerfumesCatalog } from "@/components/perfume/ResilientPerfumesCatalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de perfumes",
  description: "Compara perfumes por notas, familia olfativa, precio y disponibilidad en un índice editorial de fragancias.",
  alternates: { canonical: "/catalogo" },
};

export default async function CatalogoPage({ searchParams }: { searchParams: { familia?: string } }) {
  const perfumes = await getPerfumes();

  return (
    <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]">
      <section className="mx-auto w-full max-w-[1440px] px-6 pb-10 pt-10 lg:px-10 lg:pb-14 lg:pt-14">
        <div className="flex items-center justify-between font-plex text-xs uppercase tracking-[.14em] text-muted">
          <span>Índice de fragancias</span>
          <span>Aromia / 02</span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.12fr_.88fr] lg:items-end">
          <div>
            <p className="font-plex text-xs uppercase tracking-[.15em] text-gold-contrast">Fragancias</p>
            <h1 className="mt-5 max-w-[12ch] font-display text-[44px] font-medium leading-[.96] tracking-[-.035em] text-ink sm:text-[54px] lg:text-[64px]">
              Encuentra por instinto. Afina con criterio.
            </h1>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-[40ch] font-sans text-base leading-7 text-muted">
              Explora por familia, ocasión, precio o carácter y deja que el catálogo reduzca el ruido.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 font-plex text-xs uppercase tracking-[.11em] text-muted">
              <span><strong className="font-normal text-gold-contrast">{perfumes.length > 0 ? perfumes.length : "125"}</strong> fragancias</span>
              <span>Familia → perfume</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-6 pb-20 lg:px-10 lg:pb-28">
        <ResilientPerfumesCatalog initialPerfumes={perfumes} initialFamilia={searchParams.familia} />
      </section>
    </main>
  );
}
