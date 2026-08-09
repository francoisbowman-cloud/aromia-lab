import Link from "next/link";

const EYEBROW = "font-sans text-[10px] uppercase tracking-[.28em] font-semibold text-gold-contrast dark:text-gold-dark";
const ANSWERS = ["Presencia", "Calma", "Misterio", "Energía"];

export function QuizSpotlight() {
  return (
    <section className="relative overflow-hidden bg-[#f3eadc] py-20 dark:bg-[#15110d] lg:py-28">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[42%] bg-[radial-gradient(circle_at_60%_42%,rgba(200,168,107,.22),transparent_58%)] dark:bg-[radial-gradient(circle_at_60%_42%,rgba(200,168,107,.1),transparent_60%)]" />
      <div className="relative z-[1] mx-auto w-full max-w-6xl px-6 lg:px-10">
        <div className="mb-12 flex items-center gap-4 border-b border-line pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>Scent consultation</span><span className="h-px flex-1 bg-line" /><span>07 / Discovery</span></div>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[.78fr_1.22fr] lg:gap-20">
          <div>
            <p className={EYEBROW}>Consulta olfativa</p>
            <h2 className="mt-5 max-w-[9ch] font-display text-[48px] font-medium leading-[.91] tracking-[-.035em] text-ink lg:text-[72px]">Tu perfume no empieza con una <em className="font-medium text-gold-contrast">marca.</em></h2>
            <p className="mt-6 max-w-[38ch] font-sans text-sm leading-6 text-muted">Empieza con lo que quieres proyectar. Seis preguntas reducen el catálogo a una conversación más personal.</p>
            <Link href="/quiz" className="group mt-9 inline-flex items-center gap-4 border-b border-ink pb-2 font-plex text-[10px] uppercase tracking-[.16em] text-ink transition-colors hover:border-gold hover:text-gold-contrast dark:border-[#f2ebdd]">Iniciar consulta <span className="transition-transform group-hover:translate-x-1">→</span></Link>
          </div>

          <div className="relative pt-2 lg:pl-10">
            <span aria-hidden="true" className="absolute left-0 top-0 hidden h-full w-px bg-line lg:block" />
            <p className="font-plex text-[9px] uppercase tracking-[.18em] text-muted">Pregunta de apertura / 01</p>
            <p className="mt-5 max-w-[15ch] font-display text-[32px] italic leading-[1.05] text-ink lg:text-[46px]">¿Qué quieres que diga tu perfume antes de que tú digas una palabra?</p>
            <div className="mt-9 grid grid-cols-1 border-t border-line sm:grid-cols-2">
              {ANSWERS.map((label, index) => (
                <div key={label} className="group flex min-h-20 items-center justify-between border-b border-line py-4 sm:odd:pr-6 sm:even:border-l sm:even:pl-6">
                  <span className="font-display text-2xl text-ink transition-colors group-hover:text-gold-contrast">{label}</span>
                  <span className="font-plex text-[9px] tracking-[.14em] text-gold-contrast">0{index + 1}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 max-w-[46ch] font-sans text-xs leading-5 text-muted">No hay una respuesta correcta. Solo señales que acercan la fragancia a tu forma de estar en el mundo.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
