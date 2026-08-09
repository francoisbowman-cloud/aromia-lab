import Image from "next/image";
import Link from "next/link";

const EYEBROW = "font-sans text-[10px] uppercase tracking-[.3em] font-semibold text-gold-contrast dark:text-gold-dark";

export function SensoryInterlude() {
  return (
    <section className="relative min-h-[78vh] overflow-hidden bg-[#eee4d5] dark:bg-[#100c09]">
      <div aria-hidden="true" className="aromia-scene-reveal absolute inset-0 overflow-hidden">
        <Image src="/editorial/sunlit-warm.png" alt="" fill sizes="100vw" className="object-cover object-center opacity-[.76] saturate-[.86] dark:hidden" />
        <Image src="/editorial/cinematic-warm.png" alt="" fill sizes="100vw" className="hidden object-cover object-center opacity-[.72] saturate-[.82] dark:block" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,239,227,.97)_0%,rgba(246,239,227,.82)_36%,rgba(246,239,227,.16)_68%,transparent_100%)] dark:bg-[linear-gradient(90deg,rgba(16,12,9,.96)_0%,rgba(16,12,9,.78)_38%,rgba(16,12,9,.14)_70%,transparent_100%)]" />

      <div aria-hidden="true" className="absolute right-[9%] top-[18%] hidden h-[56%] w-[24%] rounded-[50%_50%_40%_40%/24%_24%_16%_16%] border border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,.28),rgba(200,168,107,.09)_45%,rgba(70,43,20,.16))] shadow-[0_35px_95px_rgba(72,45,20,.22),inset_0_0_44px_rgba(255,255,255,.18)] backdrop-blur-[1px] lg:block dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(255,255,255,.04),rgba(200,168,107,.07),rgba(0,0,0,.2))]" />
      <div aria-hidden="true" className="absolute right-[13.4%] top-[12%] hidden h-[13%] w-[15%] rounded-t-[42%] border border-white/35 bg-[linear-gradient(180deg,#c8a86b,#866526)] opacity-80 shadow-[0_12px_28px_rgba(50,30,15,.2)] lg:block" />

      <div className="relative z-[2] mx-auto flex min-h-[78vh] w-full max-w-6xl flex-col justify-between px-6 py-14 lg:px-10 lg:py-20">
        <div className="flex items-center gap-4 border-b border-[rgba(33,29,23,.2)] pb-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted dark:border-[rgba(242,235,221,.18)]"><span>Material study</span><span className="h-px flex-1 bg-current opacity-25" /><span>04 / Reveal</span></div>
        <div className="max-w-[650px] py-14 lg:py-20">
          <p className={EYEBROW}>De la materia al objeto</p>
          <p className="mt-6 max-w-[12ch] font-display text-[42px] font-medium leading-[.94] tracking-[-.03em] text-ink lg:text-[68px]">Primero reconoces una sensación. Después aparece <em className="font-medium text-gold-contrast">el frasco.</em></p>
          <p className="mt-6 max-w-[42ch] font-sans text-sm leading-6 text-muted">Resina, piel, madera, flor, cítrico. Aromia parte de la materia para llegar a la identidad, no de una campaña para llegar a una compra.</p>
          <Link href="#indice-olfativo" className="nav-link mt-8 inline-block font-sans text-sm text-ink transition hover:text-gold-contrast">Volver a las materias ↑</Link>
        </div>
        <div className="flex max-w-[620px] items-center gap-4 border-t border-[rgba(33,29,23,.2)] pt-4 font-plex text-[9px] uppercase tracking-[.16em] text-muted dark:border-[rgba(242,235,221,.18)]"><span>Materia</span><span>01</span><span className="h-px flex-1 bg-current opacity-25"/><span>Memoria</span><span>02</span><span className="h-px flex-1 bg-current opacity-25"/><span>Objeto</span><span>03</span></div>
      </div>
    </section>
  );
}
