import Link from "next/link";
import { CATEGORIA_LABEL } from "@/lib/magazineCategories";
import type { Article } from "@/lib/types";

const EYEBROW = "font-sans text-[10px] uppercase tracking-[.28em] font-semibold text-gold-contrast dark:text-gold-dark";

export function MagazineSpotlight({ articulo }: { articulo: Article }) {
  const coverStyle = articulo.imagen_portada_url
    ? { backgroundImage: `linear-gradient(180deg, transparent 38%, rgba(33,29,23,.18) 100%), url("${articulo.imagen_portada_url}")`, backgroundPosition: "center", backgroundSize: "cover" }
    : undefined;

  return (
    <section className="relative overflow-hidden bg-[#fffdf8] dark:bg-[#100d0a]">
      <div className="mx-auto grid min-h-[76vh] w-full max-w-[1500px] grid-cols-1 lg:grid-cols-[.8fr_1.2fr]">
        <div className="relative z-[2] flex flex-col justify-between px-6 py-16 lg:px-12 lg:py-20">
          <div className="flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>Aromia Magazine</span><span className="h-px flex-1 bg-line"/><span>06 / Cover story</span></div>

          <div className="my-14 max-w-[590px] lg:my-20">
            <p className={EYEBROW}>{CATEGORIA_LABEL[articulo.categoria]} · edición digital</p>
            <h2 className="mt-5 font-display text-[44px] font-medium leading-[.93] tracking-[-.035em] text-ink lg:text-[68px]">{articulo.titulo}</h2>
            {articulo.meta_description ? <p className="mt-6 max-w-[44ch] font-sans text-[15px] leading-7 text-muted">{articulo.meta_description}</p> : null}
          </div>

          <div className="flex items-end justify-between gap-5 border-t border-line pt-5">
            <Link href={`/magazine/${articulo.slug}`} className="group inline-flex items-center gap-3 font-plex text-[10px] uppercase tracking-[.16em] text-ink transition-colors hover:text-gold-contrast">Leer la historia <span className="transition-transform group-hover:translate-x-1">→</span></Link>
            <span className="font-display text-2xl italic text-muted">Journal de parfum</span>
          </div>
        </div>

        <Link href={`/magazine/${articulo.slug}`} aria-label={`Leer ${articulo.titulo}`} className="group relative min-h-[500px] overflow-hidden bg-[#eadfce] dark:bg-[#17120d] lg:min-h-full">
          <div aria-hidden="true" className="aromia-scene-editorial absolute inset-0 scale-[1.01] transition-transform duration-1000 group-hover:scale-[1.035]" style={coverStyle} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(33,29,23,.2)_100%)] dark:bg-[linear-gradient(180deg,transparent_46%,rgba(14,12,10,.35)_100%)]" />
          <div aria-hidden="true" className="absolute inset-5 border border-white/35 dark:border-white/15" />
          <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between gap-4 text-white [text-shadow:0_2px_12px_rgba(0,0,0,.45)]">
            <span className="font-plex text-[9px] uppercase tracking-[.18em]">Aromia / Editorial study</span>
            <span className="font-display text-3xl italic">06</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
