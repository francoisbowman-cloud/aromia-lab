import Link from "next/link";
import type { CATEGORIAS_PRINCIPALES } from "@/lib/olfactiveCategories";

const EYEBROW =
  "font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast font-semibold";

type Categoria = (typeof CATEGORIAS_PRINCIPALES)[number];

/**
 * "Explora por notas" reconstruida como Índice Olfativo — un sumario
 * editorial (líneas punteadas, sin tiles/chips), no una grilla de
 * filtros. Mismos datos que antes (categoriasConResultados calculado en
 * page.tsx a partir del catálogo real).
 */
export function OlfactiveIndex({ categorias }: { categorias: Categoria[] }) {
  if (categorias.length === 0) return null;

  return (
    <section id="indice-olfativo" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 lg:px-10">
      <div className="max-w-[640px]">
        <p className={EYEBROW}>Explora por notas</p>
        <p className="mt-3 font-display text-lg leading-relaxed text-ink first-letter:float-left first-letter:pr-2 first-letter:pt-0.5 first-letter:font-display first-letter:text-[48px] first-letter:font-semibold first-letter:leading-[.75] first-letter:text-gold-contrast">
          Ocho familias olfativas ordenan todo el catálogo de Aromia — un índice, no un filtro
          más: elegí una nota y entrá directo a lo que realmente huele parecido.
        </p>
      </div>
      <div className="mt-8 flex flex-col">
        {categorias.map((cat) => (
          <Link
            key={cat.label}
            href={`/catalogo?familia=${encodeURIComponent(cat.familias[0])}`}
            className="group flex items-baseline gap-3.5 border-b border-line py-4 transition-[padding] hover:pl-2"
          >
            <span className="whitespace-nowrap font-display text-xl italic text-ink">
              {cat.label}
            </span>
            <span className="-translate-y-1.5 flex-1 border-b border-dotted border-line" />
            <span className="whitespace-nowrap font-plex text-[11px] text-muted">
              Ver catálogo
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
