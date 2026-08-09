import Link from "next/link";
import type { CATEGORIAS_PRINCIPALES } from "@/lib/olfactiveCategories";

type Categoria = (typeof CATEGORIAS_PRINCIPALES)[number];

const copy: Record<string, string> = {
  "Acuáticos": "Frescura luminosa y transparente.",
  "Floral": "Delicados, elegantes y envolventes.",
  "Amaderados": "Profundos, cálidos y sofisticados.",
  "Árabes": "Intensos, sensuales y memorables.",
  "Cítricos": "Energía pura, limpia y radiante.",
  "Afrutados": "Jugosos, vibrantes y expresivos.",
  "Frescos": "Ligereza nítida para todos los días.",
  "Fougère": "Verde, aromático y clásico.",
};

export function OlfactiveIndex({ categorias }: { categorias: Categoria[] }) {
  if (categorias.length === 0) return null;
  const featured = [...categorias].sort((a, b) => {
    const order = ["Acuáticos", "Floral", "Amaderados", "Árabes", "Cítricos"];
    return (order.indexOf(a.label) === -1 ? 99 : order.indexOf(a.label)) - (order.indexOf(b.label) === -1 ? 99 : order.indexOf(b.label));
  }).slice(0, 5);

  return (
    <section id="indice-olfativo" className="scroll-mt-24 border-y border-line bg-[#fbf8f3] py-14 dark:bg-[#0f0c09] lg:py-16">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10 xl:px-14">
        <div className="mb-7 flex items-center gap-4">
          <span className="h-px flex-1 bg-line" />
          <p className="font-plex text-[10px] uppercase tracking-[.22em] text-muted">Descubre tu esencia</p>
          <span className="h-px flex-1 bg-line" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {featured.map((cat, index) => (
            <Link key={cat.label} href={`/catalogo?familia=${encodeURIComponent(cat.familias[0])}`} className="group overflow-hidden border border-line bg-[#fffdf9] transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-lux dark:bg-[#15110d]">
              <div className="relative h-28 overflow-hidden" style={{ background: cat.gradient }}>
                <span aria-hidden="true" className="absolute -right-3 -top-8 font-display text-[112px] leading-none text-white/25">{String(index + 1).padStart(2, "0")}</span>
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.26),transparent_46%,rgba(20,15,10,.08))]" />
                <div className="absolute bottom-4 left-4 h-px w-9 bg-white/70" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4"><h3 className="font-display text-[24px] leading-none text-ink">{cat.label}</h3><span className="font-plex text-[9px] text-gold-contrast transition-transform group-hover:translate-x-1">→</span></div>
                <p className="mt-3 min-h-10 font-sans text-xs leading-5 text-muted">{copy[cat.label] ?? "Una ruta para descubrir familias afines."}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
