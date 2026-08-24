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
  const count = perfumes.length > 0 ? perfumes.length : 125;

  return (
    <main className="min-h-screen overflow-hidden bg-white text-ink">
      <section className="relative mx-auto w-full max-w-[1520px] px-5 pb-10 pt-12 sm:px-8 lg:px-12 lg:pb-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute -right-[5%] top-[-2%] font-display text-[clamp(170px,26vw,390px)] leading-none tracking-[-.09em] text-ink/[.014]">{count}</div>
        <div className="relative grid gap-12 lg:grid-cols-[1.28fr_.72fr] lg:items-end">
          <div>
            <p className="font-plex text-[9px] uppercase tracking-[.18em] text-[#5a6b54]">Índice olfativo / {count} objetos</p>
            <h1 className="mt-7 max-w-[9ch] font-display text-[58px] font-medium leading-[.84] tracking-[-.055em] text-ink sm:text-[82px] lg:text-[112px]">
              El perfume como materia.
            </h1>
            <p className="mt-8 max-w-[36ch] font-display text-[20px] leading-[1.28] tracking-[-.015em] text-muted sm:text-[24px]">
              Una colección para mirar despacio: vidrio, color, proporción, familia y memoria compartiendo el mismo lienzo.
            </p>
          </div>

          <div className="lg:justify-self-end lg:pb-2">
            <p className="max-w-[31ch] font-display text-[25px] leading-[1.08] tracking-[-.025em] text-ink sm:text-[31px]">
              Sin vitrinas. Sin una cuadrícula que obligue a todos los perfumes a parecer iguales.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[#20231f]/10 pt-4 font-plex text-[9px] uppercase tracking-[.16em] text-muted">
              <span><strong className="block font-normal text-[#5a6b54]">{count}</strong><span className="mt-1 block">fragancias</span></span>
              <span><strong className="block font-normal text-ink">01—{String(count).padStart(3, "0")}</strong><span className="mt-1 block">archivo vivo</span></span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1520px] bg-white px-5 pb-24 sm:px-8 lg:px-12 lg:pb-36">
        <ResilientPerfumesCatalog initialPerfumes={perfumes} initialFamilia={searchParams.familia} />
      </section>
    </main>
  );
}
