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
      <section className="relative mx-auto w-full max-w-[1520px] px-5 pb-10 pt-12 sm:px-8 lg:px-12 lg:pb-16 lg:pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute right-[-4%] top-[5%] font-display text-[clamp(150px,24vw,360px)] leading-none tracking-[-.09em] text-ink/[.018]">{count}</div>
        <div className="relative grid gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <div>
            <p className="font-plex text-[10px] uppercase tracking-[.16em] text-[#5a6b54]">Colección / archivo olfativo</p>
            <h1 className="mt-6 max-w-[11ch] font-display text-[52px] font-medium leading-[.89] tracking-[-.05em] text-ink sm:text-[72px] lg:text-[94px]">
              {count} fragancias. Una sola obsesión: lo extraordinario.
            </h1>
            <p className="mt-7 max-w-[38ch] font-sans text-[15px] leading-7 text-muted">
              Explora la colección real de Aromia como una secuencia de objetos, familias y sensaciones. El blanco funciona como un lienzo continuo: la composición sucede alrededor del perfume, no detrás de él.
            </p>
          </div>

          <div className="lg:justify-self-end lg:pb-1">
            <p className="max-w-[34ch] font-display text-[24px] leading-[1.12] tracking-[-.02em] text-[#5a6b54] sm:text-[29px]">
              Primero unificamos la evidencia del producto. Después dejamos que la dirección editorial rompa la cuadrícula.
            </p>
            <div className="mt-8 flex items-center gap-8 border-t border-[#20231f]/12 pt-4 font-plex text-[10px] uppercase tracking-[.14em] text-muted">
              <span><strong className="font-normal text-[#5a6b54]">{count}</strong> objetos</span>
              <span>Fondo blanco normalizado</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1520px] bg-white px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        <ResilientPerfumesCatalog initialPerfumes={perfumes} initialFamilia={searchParams.familia} />
      </section>
    </main>
  );
}
