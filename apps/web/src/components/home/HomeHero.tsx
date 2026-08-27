import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { ProductImage } from "@/components/perfume/ProductImage";

export function HomeHero({ perfume }: { perfume?: Perfume }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-[#f7f5f0] dark:bg-[#0e1311]">
      <div className="mx-auto grid min-h-[calc(100svh-68px)] w-full max-w-[1600px] grid-cols-1 px-5 sm:px-8 lg:grid-cols-[.86fr_1.14fr] lg:px-12">
        <div className="relative z-10 flex flex-col justify-between py-8 sm:py-10 lg:py-14">
          <div className="flex items-center justify-between gap-5 border-t border-line pt-3 font-plex text-[10px] uppercase tracking-[.16em] text-muted lg:max-w-[560px]">
            <span>Aromia</span>
            <span>Edición 01</span>
          </div>

          <div className="py-10 sm:py-14 lg:py-12">
            <h1 className="max-w-[7.4ch] font-display text-[54px] font-medium leading-[.86] tracking-[-.055em] text-ink sm:text-[76px] lg:text-[96px] xl:text-[108px]">
              El perfume se entiende mejor de cerca.
            </h1>
            <p className="mt-7 max-w-[34ch] font-sans text-[15px] leading-7 text-muted lg:text-base">
              Objetos reales, materia olfativa y contexto editorial para descubrir con criterio.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/catalogo" className="inline-flex min-h-12 items-center border-b border-ink font-plex text-[10px] uppercase tracking-[.15em] text-ink transition hover:border-[#5a6b54] hover:text-[#5a6b54]">
                Explorar perfumes <span aria-hidden="true" className="ml-4">↗</span>
              </Link>
              <Link href="/descubrir" className="inline-flex min-h-12 items-center font-plex text-[10px] uppercase tracking-[.15em] text-muted transition hover:text-ink">
                Discovery →
              </Link>
            </div>
          </div>

          {perfume ? (
            <div className="grid max-w-[560px] grid-cols-[1fr_auto] items-end gap-5 border-t border-line pt-4">
              <div>
                <p className="font-plex text-[10px] uppercase tracking-[.15em] text-muted">Objeto en foco</p>
                <p className="mt-2 font-display text-[24px] leading-none tracking-[-.02em] text-ink">{perfume.nombre}</p>
              </div>
              <p className="font-plex text-[10px] uppercase tracking-[.15em] text-[#5a6b54] dark:text-[#b8c5b3]">{perfume.marca}</p>
            </div>
          ) : null}
        </div>

        <div className="relative min-h-[54svh] lg:min-h-0">
          <div aria-hidden="true" className="absolute inset-x-[4%] top-[6%] h-[82%] rounded-[50%] bg-[#d9c8b1]/42 blur-[105px] dark:bg-[#4a1f24]/20" />
          {perfume ? (
            <div className="absolute inset-0 flex items-center justify-center lg:justify-end">
              <div className="relative h-[94%] w-[96%] max-w-[820px] sm:h-[90%] sm:w-[92%] lg:h-[92%] lg:w-[96%]">
                <ProductImage slug={perfume.slug} imageUrl={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} mode="hero" />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 grid place-items-center font-display text-5xl text-muted">Aromia</div>
          )}
          <div className="absolute bottom-6 right-0 hidden w-[250px] border-t border-line pt-3 font-plex text-[9px] uppercase leading-5 tracking-[.14em] text-muted lg:block">
            Producto auténtico · sin reconstrucción IA
          </div>
        </div>
      </div>
    </section>
  );
}
