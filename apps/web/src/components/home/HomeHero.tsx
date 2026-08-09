"use client";

import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { Button } from "@/components/ui/button";

const EYEBROW = "font-sans text-[10px] uppercase tracking-[.32em] font-semibold text-gold-contrast dark:text-gold-dark";

export function HomeHero({ perfume }: { perfume?: Perfume }) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-[#f8f1e6] text-ink dark:bg-[#0d0a08]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(200,168,107,.22),transparent_27%),linear-gradient(110deg,#fbf8f3_0%,#f6eee1_48%,#eadbc3_100%)] dark:bg-[radial-gradient(circle_at_74%_40%,rgba(200,168,107,.13),transparent_30%),linear-gradient(110deg,#0d0a08_0%,#15100c_55%,#21170f_100%)]" />
      <div className="absolute -right-[8%] top-[18%] h-[58%] w-[36%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.62),rgba(200,168,107,.08)_58%,transparent_72%)] blur-2xl dark:bg-[radial-gradient(circle,rgba(200,168,107,.13),rgba(200,168,107,.03)_58%,transparent_72%)]" />
      <div className="absolute bottom-[-10%] right-[7%] h-[32%] w-[30%] rotate-[-8deg] rounded-[50%] border border-white/45 bg-white/10 blur-[1px] dark:border-white/5 dark:bg-white/[.02]" />

      <div className="relative mx-auto grid min-h-[86svh] max-w-[1440px] grid-cols-1 px-6 pb-12 pt-8 lg:min-h-[88vh] lg:grid-cols-[.9fr_1.1fr] lg:px-10 lg:pb-16 lg:pt-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-4 border-b border-[rgba(33,29,23,.16)] pb-4 font-plex text-[9px] uppercase tracking-[.2em] text-[rgba(33,29,23,.58)] dark:border-[rgba(242,235,221,.14)] dark:text-[rgba(242,235,221,.56)]">
            <span>Aromia</span><span className="h-px flex-1 bg-current opacity-25"/><span>Maison digitale</span><span>Vol. 01</span>
          </div>

          <div className="flex flex-1 flex-col justify-end pb-4 pt-16 lg:pb-6 lg:pt-24">
            <p className={EYEBROW}>Editorial · discovery · commerce</p>
            <h1 className="mt-5 max-w-[9ch] font-display text-[54px] font-semibold leading-[.88] tracking-[-.045em] text-ink sm:text-[72px] lg:text-[104px]">
              Esencias que
              <br />
              <em className="font-medium text-gold-contrast">permanecen.</em>
            </h1>
            <p className="mt-7 max-w-[520px] font-sans text-[15px] leading-7 text-[rgba(33,29,23,.78)] dark:text-[rgba(242,235,221,.76)]">
              Historias olfativas, objetos icónicos y contexto editorial para descubrir una fragancia con criterio, no por impulso.
            </p>
            {perfume ? (
              <p className="mt-5 font-plex text-[9px] uppercase tracking-[.18em] text-muted">
                Objeto editorial · {perfume.nombre} / {perfume.marca}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Button asChild size="lg"><Link href="/catalogo">Explorar colecciones</Link></Button>
              <Link href="/quiz" className="nav-link font-sans text-sm text-ink transition hover:text-gold-contrast">Encontrar mi perfume →</Link>
            </div>
          </div>
        </div>

        <div className="relative mt-10 min-h-[420px] lg:mt-0 lg:min-h-0">
          <div className="absolute inset-[6%_2%_0_8%] rounded-[46%_46%_32%_32%/22%_22%_12%_12%] border border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,.46),rgba(255,255,255,.10)_45%,rgba(200,168,107,.08))] shadow-[0_40px_120px_rgba(96,66,34,.14)] backdrop-blur-[1px] dark:border-white/8 dark:bg-[linear-gradient(145deg,rgba(255,255,255,.035),rgba(255,255,255,.01)_45%,rgba(200,168,107,.03))] dark:shadow-[0_40px_120px_rgba(0,0,0,.42)]" />

          {perfume?.imagen_url ? (
            <Link href={`/catalogo/${perfume.slug}`} className="absolute inset-0 z-[2] flex items-end justify-center pb-8 lg:items-center lg:pb-0" aria-label={`Ver ${perfume.nombre} de ${perfume.marca}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} className="max-h-[78%] max-w-[76%] object-contain drop-shadow-[0_30px_28px_rgba(56,35,16,.24)] transition-transform duration-700 hover:scale-[1.02] lg:max-h-[74%] dark:drop-shadow-[0_30px_36px_rgba(0,0,0,.55)]" />
            </Link>
          ) : (
            <div className="absolute inset-0 z-[2] flex items-center justify-center px-10 text-center">
              <p className="max-w-[26ch] font-display text-3xl italic text-muted">Una selección editorial de objetos olfativos.</p>
            </div>
          )}

          <div className="absolute bottom-5 left-[12%] right-[8%] z-[3] flex items-center gap-4 border-t border-[rgba(33,29,23,.16)] pt-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted dark:border-[rgba(242,235,221,.14)]">
            <span>Objeto</span><span className="h-px flex-1 bg-current opacity-25"/><span>{perfume?.marca ?? "Aromia"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
