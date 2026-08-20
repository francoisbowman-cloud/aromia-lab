import { ProductImage } from "./ProductImage";

/**
 * Product-context scene for PDP.
 *
 * The previous OVL mockups could preserve mood while weakening lettering,
 * label fidelity or bottle geometry. This scene deliberately composes around
 * the canonical catalog packshot instead: atmosphere may change, product
 * identity may not.
 */
export function EditorialMood({ slug, nombre }: { slug: string; nombre: string }) {
  return (
    <section className="aromia-atmosphere relative overflow-hidden" data-family="neutral">
      <div className="aromia-material-frame" aria-hidden="true" />
      <div className="aromia-material-orbit aromia-material-orbit--a" aria-hidden="true" />
      <div className="aromia-material-orbit aromia-material-orbit--b" aria-hidden="true" />

      <div className="relative z-10 grid min-h-[500px] items-stretch lg:grid-cols-[.68fr_1.32fr]">
        <div className="flex flex-col justify-between px-6 py-8 sm:px-9 sm:py-10 lg:px-10 lg:py-12">
          <div>
            <p className="font-plex text-xs uppercase tracking-[.16em] text-[#342a21]/70">Estudio de materia</p>
            <p className="mt-5 max-w-[9ch] font-display text-[38px] leading-[.9] tracking-[-.035em] text-[#211d17] sm:text-[48px]">
              Una escena que no suplanta al objeto.
            </p>
          </div>
          <div className="mt-12 max-w-[34ch]">
            <div className="aromia-rule mb-5" />
            <p className="font-sans text-sm leading-6 text-[#342a21]/72">
              Luz, superficie y distancia construyen contexto. El frasco de {nombre} permanece intacto y reconocible.
            </p>
          </div>
        </div>

        <div className="relative m-5 min-h-[390px] bg-white shadow-[0_34px_90px_rgba(48,34,23,.16)] sm:m-8 lg:m-10 lg:min-h-[520px]">
          <ProductImage slug={slug} alt={`${nombre}, producto real`} mode="hero" />
          <div className="pointer-events-none absolute inset-x-5 bottom-5 z-10 flex items-center justify-between gap-6 font-plex text-[10px] uppercase tracking-[.13em] text-[#342a21]/55 sm:inset-x-7 sm:bottom-7">
            <span>Producto real</span>
            <span>Identidad preservada</span>
          </div>
        </div>
      </div>
    </section>
  );
}
