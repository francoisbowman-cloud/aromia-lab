import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { ProductImage } from "@/components/perfume/ProductImage";

export function HomeHero({ perfume }: { perfume?: Perfume }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-[#f7f5f0] dark:bg-[#0e1311]">
      <div className="mx-auto grid min-h-[690px] w-full max-w-[1520px] grid-cols-1 px-5 sm:px-8 lg:min-h-[760px] lg:grid-cols-[.92fr_1.08fr] lg:px-12">
        <div className="relative z-10 flex flex-col justify-between py-12 lg:py-16">
          <p className="font-plex text-xs uppercase tracking-[.16em] text-[#5a6b54] dark:text-[#b8c5b3]">
            Aromia — perfume, contexto, criterio
          </p>

          <div className="py-14 lg:py-20">
            <h1 className="max-w-[7.7ch] font-display text-[58px] font-medium leading-[.87] tracking-[-.055em] text-ink sm:text-[76px] lg:text-[106px]">
              El perfume se entiende mejor de cerca.
            </h1>
            <p className="mt-8 max-w-[38ch] font-sans text-[15px] leading-7 text-muted lg:text-base">
              Aromia reúne objetos reales, materia olfativa y contexto editorial para ayudarte a descubrir qué vale la pena llevar contigo.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href="/catalogo"
                className="inline-flex min-h-12 items-center border-b border-ink font-plex text-xs uppercase tracking-[.14em] text-ink transition hover:border-[#5a6b54] hover:text-[#5a6b54]"
              >
                Explorar perfumes <span aria-hidden="true" className="ml-4">↗</span>
              </Link>
              <Link href="/descubrir" className="font-sans text-sm text-muted transition hover:text-ink">
                Descubrir por sensación →
              </Link>
            </div>
          </div>

          {perfume ? (
            <div className="flex max-w-[480px] items-end justify-between gap-5 border-t border-line pt-4">
              <div>
                <p className="font-plex text-xs uppercase tracking-[.13em] text-muted">Objeto en foco</p>
                <p className="mt-1 font-display text-xl text-ink">{perfume.nombre}</p>
              </div>
              <p className="font-plex text-xs uppercase tracking-[.13em] text-[#5a6b54] dark:text-[#b8c5b3]">{perfume.marca}</p>
            </div>
          ) : null}
        </div>

        <div className="relative min-h-[560px] lg:min-h-0">
          <div aria-hidden="true" className="absolute inset-x-[8%] top-[12%] h-[70%] rounded-[50%] bg-[#d9c8b1]/45 blur-[90px] dark:bg-[#4a1f24]/20" />
          {perfume ? (
            <div className="absolute inset-0 flex items-center justify-center lg:justify-end">
              <div className="relative h-[78%] w-[86%] max-w-[720px] transition-transform duration-700 ease-out hover:-translate-y-1 lg:h-[84%] lg:w-[94%]">
                <ProductImage
                  slug={perfume.slug}
                  imageUrl={perfume.imagen_url}
                  alt={`${perfume.nombre} de ${perfume.marca}`}
                  mode="hero"
                />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 grid place-items-center font-display text-5xl text-muted">Aromia</div>
          )}

          <div className="absolute bottom-7 right-0 hidden max-w-[260px] border-t border-line pt-3 font-sans text-xs leading-5 text-muted lg:block">
            Producto auténtico. La atmósfera acompaña; nunca sustituye al objeto.
          </div>
        </div>
      </div>
    </section>
  );
}
