import Link from "next/link";
import { Button } from "@/components/ui/button";

const EYEBROW =
  "font-sans text-[11px] uppercase tracking-[.24em] font-semibold text-gold-contrast dark:text-gold-dark";

/**
 * Quiz como herramienta estratégica de discovery — momento full-bleed
 * inmersivo, no una card más entre otras. Copy real sin cambios.
 */
export function QuizSpotlight() {
  return (
    <section className="aromia-scene-glow relative flex min-h-[54vh] items-center justify-center overflow-hidden text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,248,243,.4),rgba(251,248,243,.86))] dark:bg-[radial-gradient(ellipse_at_center,rgba(14,12,10,.34),rgba(14,12,10,.8))]" />
      <div className="relative z-[1] max-w-[520px] px-6">
        <p className={EYEBROW}>Quiz de matching</p>
        <h2 className="mt-4 font-display text-3xl font-semibold text-ink lg:text-[44px]">
          ¿No sabes por dónde empezar?
        </h2>
        <p className="mx-auto mt-3 max-w-md font-sans text-muted">
          Responde 6 preguntas y te mostramos los perfumes que mejor se adaptan a tu estilo y
          presupuesto.
        </p>
        <Button asChild size="lg" className="mt-7">
          <Link href="/quiz">Empezar el quiz</Link>
        </Button>
      </div>
    </section>
  );
}
