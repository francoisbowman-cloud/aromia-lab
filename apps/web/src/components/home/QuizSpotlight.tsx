import Link from "next/link";

const EYEBROW =
  "font-sans text-[11px] uppercase tracking-[.24em] font-semibold text-gold-contrast dark:text-gold-dark";

/**
 * Quiz como consulta olfativa, no como CTA genérico. Mantiene la acción
 * principal clara, pero la encuadra como experiencia de identidad.
 */
export function QuizSpotlight() {
  return (
    <section className="relative overflow-hidden bg-[#f8f1e5] dark:bg-[#120f0c]">
      <div aria-hidden="true" className="aromia-scene-glow absolute inset-0 opacity-20 dark:opacity-30" />
      <div className="relative z-[1] mx-auto grid min-h-[56vh] w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-[.82fr_1.18fr] lg:px-10 lg:py-20">
        <div>
          <p className={EYEBROW}>Discovery / consulta olfativa</p>
          <h2 className="mt-4 max-w-[10ch] font-display text-[40px] font-medium leading-[.98] tracking-[-.02em] text-ink lg:text-[62px]">
            Tu perfume probablemente ya existe.
          </h2>
          <p className="mt-5 max-w-[42ch] font-sans text-sm leading-6 text-muted">
            Seis preguntas bastan para reducir el ruido: estilo, presencia, ocasión, familia,
            presupuesto y personalidad.
          </p>
          <Link
            href="/quiz"
            className="nav-link mt-8 inline-block font-sans text-sm font-semibold text-ink transition hover:text-gold-contrast"
          >
            Encontrar mi perfil →
          </Link>
        </div>

        <div className="relative border-y border-line py-8 lg:py-10">
          <p className="font-plex text-[9px] uppercase tracking-[.18em] text-muted">
            Una pregunta de muestra
          </p>
          <p className="mt-4 max-w-[16ch] font-display text-2xl italic leading-snug text-ink lg:text-[34px]">
            ¿Qué quieres que diga tu perfume antes de hablar?
          </p>
          <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 font-plex text-[10px] uppercase tracking-[.12em] text-muted sm:grid-cols-4 lg:grid-cols-2">
            {['Presencia', 'Calma', 'Misterio', 'Energía'].map((label, index) => (
              <span key={label} className="flex items-center gap-2 border-b border-line pb-2.5">
                <span className="text-gold-contrast">0{index + 1}</span>
                <span>{label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
