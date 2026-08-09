import { Button } from "@/components/ui/button";

const EYEBROW =
  "font-sans text-[11px] uppercase tracking-[.26em] font-semibold text-gold-contrast dark:text-gold-dark";

/**
 * Product Reveal — continuación del set del hero (misma clase de escena,
 * `.aromia-scene-macro`), ahora resuelto como el momento donde la materia
 * prima se piensa como frasco. Puente entre el Índice Olfativo (discovery)
 * y el Magazine (storytelling), no relleno.
 */
export function SensoryInterlude() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden text-center">
      <div aria-hidden="true" className="aromia-scene-macro absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,248,243,.18),rgba(251,248,243,.7))] dark:bg-[radial-gradient(ellipse_at_center,rgba(14,12,10,.14),rgba(14,12,10,.64))]" />
      <div className="relative z-[1] max-w-[640px] px-6">
        <p className={EYEBROW}>Product Reveal · de la materia al frasco</p>
        <p className="mt-5 font-display text-2xl font-medium italic leading-snug text-ink lg:text-4xl">
          Antes de ser un frasco, cada perfume es una acumulación de materia: resina, madera,
          flor, piel.
        </p>
        <Button asChild variant="outline" size="lg" className="mt-7">
          <a href="#indice-olfativo">Descubrir las notas ↑</a>
        </Button>
      </div>
    </section>
  );
}
