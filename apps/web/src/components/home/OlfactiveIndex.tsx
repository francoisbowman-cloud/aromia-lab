import Link from "next/link";
import type { CATEGORIAS_PRINCIPALES } from "@/lib/olfactiveCategories";

const EYEBROW = "font-sans text-[10px] uppercase tracking-[.28em] text-gold-contrast font-semibold";
type Categoria = (typeof CATEGORIAS_PRINCIPALES)[number];

export function OlfactiveIndex({ categorias }: { categorias: Categoria[] }) {
  if (categorias.length === 0) return null;
  return (
    <section id="indice-olfativo" className="scroll-mt-24 bg-[#fbf8f3] py-20 dark:bg-[#0f0c09] lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <div className="mb-12 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>Index des matières</span><span className="h-px flex-1 bg-line" /><span>03 / {String(categorias.length).padStart(2, "0")}</span></div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className={EYEBROW}>Índice olfativo</p>
            <h2 className="mt-4 max-w-[8ch] font-display text-[48px] font-medium leading-[.9] tracking-[-.035em] text-ink lg:text-[72px]">Empieza por una <em className="font-medium text-gold-contrast">sensación.</em></h2>
            <p className="mt-6 max-w-[34ch] font-sans text-sm leading-6 text-muted">Antes del nombre y de la marca está la materia: fresco, floral, amaderado, especiado. El índice convierte esa intuición en una ruta.</p>
          </div>

          <div className="flex flex-col border-t border-line">
            {categorias.map((cat, index) => (
              <Link key={cat.label} href={`/catalogo?familia=${encodeURIComponent(cat.familias[0])}`} className="group grid grid-cols-[34px_auto_1fr] items-baseline gap-3 border-b border-line py-5 lg:grid-cols-[40px_auto_1fr_auto] lg:py-6">
                <span className="font-plex text-[9px] tracking-[.14em] text-gold-contrast">{String(index + 1).padStart(2, "0")}</span>
                <span className="whitespace-nowrap font-display text-[24px] italic text-ink transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-gold-contrast lg:text-[30px]">{cat.label}</span>
                <span className="-translate-y-1.5 border-b border-dotted border-[rgba(33,29,23,.24)] dark:border-[rgba(242,235,221,.22)]" />
                <span className="col-start-2 mt-2 font-plex text-[9px] uppercase tracking-[.12em] text-muted group-hover:text-ink lg:col-start-auto lg:mt-0">Abrir familia ↗</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
