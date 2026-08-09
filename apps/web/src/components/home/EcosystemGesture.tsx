import Link from "next/link";

const EYEBROW = "font-sans text-[10px] uppercase tracking-[.28em] text-gold-contrast font-semibold";

const ECOSISTEMA = [
  { title: "Magazine", desc: "Historias, tendencias y cultura de perfumería.", href: "/magazine" },
  { title: "Catálogo", desc: "Perfumes comparados con contexto, no ruido.", href: "/catalogo" },
  { title: "Quiz", desc: "Una consulta breve para afinar tu identidad olfativa.", href: "/quiz" },
  { title: "Academia", desc: "Aprender a leer una fragancia cambia cómo eliges.", href: "/academia" },
  { title: "Club", desc: "La capa privada de la conversación Aromia.", href: "/club" },
];

export function EcosystemGesture() {
  return (
    <section className="relative overflow-hidden bg-[#f5eee2] py-20 dark:bg-[#15110d] lg:py-28">
      <div aria-hidden="true" className="absolute -right-[8vw] top-[-8vw] h-[34vw] w-[34vw] rounded-full border border-[rgba(182,138,68,.14)]" />
      <div aria-hidden="true" className="absolute -right-[2vw] top-[-2vw] h-[22vw] w-[22vw] rounded-full border border-[rgba(182,138,68,.1)]" />
      <div className="relative mx-auto w-full max-w-6xl px-6 lg:px-10">
        <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div><p className={EYEBROW}>Aromia / sistema 02</p><p className="mt-3 max-w-[32ch] font-sans text-sm leading-6 text-muted">No es una tienda con contenido alrededor. Es un sistema para mirar, entender y elegir perfume.</p></div>
          <h2 className="max-w-[10ch] font-display text-[48px] font-medium leading-[.9] tracking-[-.035em] text-ink lg:text-[78px]">Cinco puertas. Una sola <em className="font-medium text-gold-contrast">sensibilidad.</em></h2>
        </div>

        <div className="mt-12 flex flex-col border-t border-line">
          {ECOSISTEMA.map((item, index) => (
            <Link key={item.href} href={item.href} className="group grid grid-cols-[34px_1fr] items-baseline gap-x-4 border-b border-line py-6 sm:grid-cols-[44px_1fr_auto] sm:gap-x-6 lg:py-7">
              <span className="font-plex text-[9px] tracking-[.16em] text-gold-contrast">0{index + 1}</span>
              <span className="font-display text-[38px] font-medium leading-none tracking-[-.02em] text-ink transition-[transform,color] duration-300 group-hover:translate-x-2 group-hover:text-gold-contrast lg:text-[66px]">{item.title}</span>
              <span className="col-start-2 mt-3 max-w-[300px] font-sans text-xs leading-5 text-muted sm:col-start-auto sm:mt-0 sm:text-right">{item.desc}</span>
            </Link>
          ))}
        </div>
        <div className="mt-7 flex items-center gap-3 font-plex text-[9px] uppercase tracking-[.16em] text-muted"><span>Desire</span><span>→</span><span>Context</span><span>→</span><span>Discovery</span><span>→</span><span>Choice</span></div>
      </div>
    </section>
  );
}
