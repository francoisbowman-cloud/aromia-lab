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
 * "El Ecosistema" como gesto tipográfico grande sobre una escena, no un
 * grid de 5 cards con ícono — la pieza de Editorial Cinematic que mejor
 * funcionó en los prototipos (docs/design/visual-upgrade).
 */
export function EcosystemGesture() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div
        aria-hidden="true"
        className="aromia-scene-glow absolute inset-0 opacity-10 dark:opacity-25"
      />
      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
        <p className={EYEBROW}>El ecosistema</p>
        <div className="mt-6 flex flex-col">
          {ECOSISTEMA.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-wrap items-baseline justify-between gap-4 border-t border-line py-5 last:border-b last:border-line"
            >
              <span className="font-display text-[32px] font-medium leading-none text-ink transition-all duration-300 group-hover:translate-x-2.5 group-hover:text-gold-contrast lg:text-[54px]">
                {item.title}
              </span>
              <span className="max-w-[260px] text-right font-sans text-xs text-muted">
                {item.desc}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
