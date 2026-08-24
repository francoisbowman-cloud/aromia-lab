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
    <main className="min-h-screen bg-[#f7f5f0] text-ink dark:bg-[#0e1311]">
      <section className="mx-auto w-full max-w-[1520px] px-5 pb-8 pt-12 sm:px-8 lg:px-12 lg:pb-14 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <h1 className="max-w-[10ch] font-display text-[52px] font-medium leading-[.88] tracking-[-.05em] text-ink sm:text-[68px] lg:text-[92px]">
              Perfumes
            </h1>
            <p className="mt-6 max-w-[34ch] font-display text-[27px] leading-[1.08] tracking-[-.02em] text-[#5a6b54] sm:text-[32px]">
              Un archivo para encontrar por instinto y afinar con criterio.
            </p>
          </div>

          <div className="lg:justify-self-end lg:pb-1">
            <p className="max-w-[42ch] font-sans text-[15px] leading-7 text-muted">
              Explora la colección real de Aromia por familia, ocasión, precio, carácter o nota. El objeto permanece al centro; los filtros solo reducen el ruido.
            </p>
            <div className="mt-8 flex items-center gap-8 border-t border-line pt-4 font-plex text-xs uppercase tracking-[.13em] text-muted">
              <span><strong className="font-normal text-[#5a6b54] dark:text-[#b8c5b3]">{perfumes.length > 0 ? perfumes.length : "125"}</strong> fragancias</span>
              <span>Archivo vivo</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1520px] px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <ResilientPerfumesCatalog initialPerfumes={perfumes} initialFamilia={searchParams.familia} />
      </section>
    </main>
  );
}
