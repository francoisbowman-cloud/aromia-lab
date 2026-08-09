import Link from "next/link";
import type { CATEGORIAS_PRINCIPALES } from "@/lib/olfactiveCategories";

const EYEBROW =
  "font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast font-semibold";

type Categoria = (typeof CATEGORIAS_PRINCIPALES)[number];

/**
 * "Explora por notas" reconstruida como Índice Olfativo — un sumario
 * editorial (líneas punteadas, sin tiles/chips), no una grilla de filtros.
 * El fondo cálido crea contraste tonal en Light sin introducir gris frío.
 */
export function OlfactiveIndex({ categorias }: { categorias: Categoria[] }) {
  if (categorias.length === 0) return null;

  return (
    <section
      id="indice-olfativo"
      className="scroll-mt-24 bg-[#f3ecdf] py-16 dark:bg-[#120f0c] lg:py-24"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 lg:grid-cols-[.72fr_1.28fr] lg:gap-16 lg:px-10">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className={EYEBROW}>Explora por notas</p>
          <h2 className="mt-4 max-w-[9ch] font-display text-[42px] font-medium leading-[.95] tracking-tight text-ink lg:text-[64px]">
            Índice olfativo
          </h2>
          <p className="mt-5 max-w-[36ch] font-sans text-sm leading-6 text-muted">
            Las familias olfativas ordenan el catálogo como un índice editorial: entra por una
            sensación y descubre qué fragancias viven cerca de ella.
          </p>
          <p className="mt-8 font-plex text-[10px] uppercase tracking-[.16em] text-muted">
            {String(categorias.length).padStart(2, "0")} familias disponibles
          </p>
        </div>

        <div className="flex flex-col border-t border-line">
          {categorias.map((cat, index) => (
            <Link
              key={cat.label}
              href={`/catalogo?familia=${encodeURIComponent(cat.familias[0])}`}
              className="group grid grid-cols-[36px_auto_1fr_auto] items-baseline gap-3 border-b border-line py-4.5 transition-[padding] hover:pl-2 lg:py-5"
            >
              <span className="font-plex text-[10px] tracking-[.1em] text-gold-contrast">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="whitespace-nowrap font-display text-xl italic text-ink transition-colors group-hover:text-gold-contrast lg:text-2xl">
                {cat.label}
              </span>
              <span className="-translate-y-1.5 border-b border-dotted border-line" />
              <span className="whitespace-nowrap font-plex text-[10px] uppercase tracking-[.08em] text-muted transition-colors group-hover:text-ink">
                Explorar
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
