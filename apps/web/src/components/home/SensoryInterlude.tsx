import Link from "next/link";

const EYEBROW =
  "font-sans text-[11px] uppercase tracking-[.26em] font-semibold text-gold-contrast dark:text-gold-dark";

/**
 * Product Reveal — la materia del hero se materializa en objeto. Mantiene
 * el mismo universo visual pero usa su propio H02: el frasco entra en el
 * tercio derecho y el copy conserva una zona segura a la izquierda.
 */
export function SensoryInterlude() {
  return (
    <section className="relative min-h-[72vh] overflow-hidden bg-[#f6efe3] dark:bg-[#100c09]">
      <div aria-hidden="true" className="aromia-scene-reveal absolute inset-0 overflow-hidden">
        {/* Primera capa fotográfica real reutilizando masters editoriales ya
            versionados por Aromia. El gradiente queda debajo como fallback;
            H02 bespoke sigue siendo reemplazable sin reescribir el componente. */}
        <img
          src="/editorial/sunlit-warm.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center opacity-[.62] mix-blend-multiply dark:hidden"
        />
        <img
          src="/editorial/cinematic-warm.png"
          alt=""
          className="absolute inset-0 hidden h-full w-full object-cover object-center opacity-[.66] mix-blend-soft-light dark:block"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,239,227,.97)_0%,rgba(246,239,227,.84)_40%,rgba(246,239,227,.24)_70%,transparent_100%)] dark:bg-[linear-gradient(90deg,rgba(16,12,9,.96)_0%,rgba(16,12,9,.82)_40%,rgba(16,12,9,.2)_70%,transparent_100%)]" />

      <div className="relative z-[1] mx-auto grid min-h-[72vh] w-full max-w-6xl grid-cols-1 items-end px-6 py-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-10 lg:py-20">
        <div>
          <p className={EYEBROW}>Product Reveal · de la materia al frasco</p>
          <p className="mt-5 max-w-[13ch] font-display text-[36px] font-medium italic leading-[1.02] tracking-[-.02em] text-ink lg:text-[58px]">
            Antes de ser un frasco, cada perfume es materia, memoria y piel.
          </p>
          <p className="mt-5 max-w-[42ch] font-sans text-sm leading-6 text-muted">
            Resina, madera, flor, cítrico: el objeto llega después. Primero está la sensación que
            quieres reconocer en ti.
          </p>
          <Link
            href="#indice-olfativo"
            className="nav-link mt-8 font-sans text-sm text-ink transition hover:text-gold-contrast"
          >
            Volver al índice olfativo ↑
          </Link>
        </div>

        <div className="hidden lg:block" aria-hidden="true">
          <div className="ml-auto flex max-w-[280px] items-center justify-between border-t border-[rgba(33,29,23,.2)] pt-3 font-plex text-[9px] uppercase tracking-[.16em] text-[rgba(33,29,23,.5)] dark:border-[rgba(242,235,221,.22)] dark:text-[rgba(242,235,221,.52)]">
            <span>Materia</span>
            <span>→</span>
            <span>Identidad</span>
            <span>→</span>
            <span>Objeto</span>
          </div>
        </div>
      </div>
    </section>
  );
}
