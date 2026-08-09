import Link from "next/link";

const EYEBROW =
  "font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast font-semibold";

const ECOSISTEMA = [
  {
    title: "Magazine",
    desc: "Historias, tendencias y entrevistas del mundo de la perfumería.",
    href: "/magazine",
  },
  {
    title: "Catálogo",
    desc: "Los mejores perfumes seleccionados y comparados para ti.",
    href: "/catalogo",
  },
  {
    title: "Quiz",
    desc: "Responde 6 preguntas y encuentra el perfil que te representa.",
    href: "/quiz",
  },
  {
    title: "Academia",
    desc: "Aprendé a leer y elegir una fragancia con nuestras guías.",
    href: "/academia",
  },
  {
    title: "Club",
    desc: "Comunidad, sorteos y beneficios para los amantes de Aromia.",
    href: "/club",
  },
];

/**
 * "El Ecosistema" como gesto tipográfico grande — una página de sumario,
 * no un grid de cards. En Light se comporta como papel editorial cálido;
 * en Dark vuelve a Grafito sin cambiar estructura ni jerarquía.
 */
export function EcosystemGesture() {
  return (
    <section className="relative overflow-hidden bg-[#fffdf8] dark:bg-[#15110d]">
      <div
        aria-hidden="true"
        className="aromia-scene-glow absolute inset-0 opacity-[.06] dark:opacity-20"
      />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
          <div>
            <p className={EYEBROW}>El ecosistema</p>
            <p className="mt-2 max-w-[38ch] font-sans text-sm leading-relaxed text-muted">
              Cinco puertas para entrar al universo Aromia, cada una con una función distinta.
            </p>
          </div>
          <span className="hidden font-plex text-[10px] uppercase tracking-[.18em] text-muted sm:block">
            Índice / 05
          </span>
        </div>

        <div className="flex flex-col">
          {ECOSISTEMA.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="group grid grid-cols-[auto_1fr] items-baseline gap-x-4 border-b border-line py-5 sm:grid-cols-[44px_1fr_auto] sm:gap-x-5 lg:py-6"
            >
              <span className="font-plex text-[10px] tracking-[.12em] text-gold-contrast">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-[32px] font-medium leading-none text-ink transition-[transform,color] duration-300 group-hover:translate-x-2 group-hover:text-gold-contrast lg:text-[56px]">
                {item.title}
              </span>
              <span className="col-start-2 mt-2 max-w-[300px] font-sans text-xs leading-relaxed text-muted sm:col-start-auto sm:mt-0 sm:text-right">
                {item.desc}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
