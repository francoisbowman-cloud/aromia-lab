import Link from "next/link";
import type { Perfume } from "@/lib/types";

export function HomeHero({ perfume }: { perfume?: Perfume }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-[#fbf7ef] text-ink dark:bg-[#0e0c0a]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_34%,rgba(214,178,112,.22),transparent_28%),linear-gradient(110deg,#fffdf9_0%,#fbf7ef_48%,#f0e2cd_100%)] dark:bg-[radial-gradient(circle_at_78%_34%,rgba(200,168,107,.10),transparent_30%),linear-gradient(110deg,#0e0c0a_0%,#15100c_52%,#1d150f_100%)]" />
      <div className="pointer-events-none absolute -bottom-24 right-[8%] h-72 w-72 rounded-full border border-white/60 bg-white/25 blur-2xl dark:border-white/5 dark:bg-white/[.02]" />

      <div className="relative mx-auto grid min-h-[650px] max-w-[1440px] grid-cols-1 items-stretch px-6 lg:min-h-[720px] lg:grid-cols-[.78fr_1.22fr] lg:px-10 xl:px-14">
        <div className="relative z-10 flex flex-col justify-center py-16 lg:py-20">
          <span className="mb-7 block h-px w-12 bg-gold" aria-hidden="true" />
          <h1 className="max-w-[8.2ch] font-display text-[58px] font-medium leading-[.92] tracking-[-.04em] text-ink sm:text-[72px] lg:text-[92px] xl:text-[104px]">
            Esencias que permanecen.
          </h1>
          <p className="mt-7 max-w-[440px] font-sans text-[15px] leading-7 text-muted lg:text-base">
            Aromia une perfumería, contexto editorial y descubrimiento para ayudarte a elegir una fragancia con criterio propio.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <Link
              href="/catalogo"
              className="inline-flex min-h-12 items-center justify-center bg-gold-contrast px-7 font-plex text-[10px] uppercase tracking-[.17em] text-white transition hover:-translate-y-0.5 hover:shadow-lux focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              Explorar colecciones
            </Link>
            <Link href="/quiz" className="nav-link font-sans text-sm text-ink">
              Descubrir mi perfil →
            </Link>
          </div>
          {perfume ? (
            <div className="mt-10 flex max-w-[430px] items-center gap-3 border-t border-line pt-4 font-plex text-[9px] uppercase tracking-[.14em] text-muted">
              <span>Selección editorial</span><span className="h-px flex-1 bg-line"/><span>{perfume.marca}</span>
            </div>
          ) : null}
        </div>

        <div className="relative min-h-[440px] lg:min-h-0">
          <div className="absolute inset-[7%_0_4%_4%] rounded-[42%_42%_10%_10%/16%_16%_6%_6%] bg-[linear-gradient(145deg,rgba(255,255,255,.74),rgba(255,255,255,.15)_48%,rgba(194,154,92,.09))] shadow-[0_42px_110px_rgba(96,66,34,.12)] ring-1 ring-white/60 dark:bg-[linear-gradient(145deg,rgba(255,255,255,.035),rgba(255,255,255,.005)_52%,rgba(200,168,107,.025))] dark:shadow-[0_42px_110px_rgba(0,0,0,.45)] dark:ring-white/5" />
          <div className="pointer-events-none absolute bottom-[6%] left-[7%] right-[2%] h-[18%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(140,98,47,.18),transparent_68%)] blur-xl dark:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.55),transparent_70%)]" />
          {perfume?.imagen_url ? (
            <Link
              href={`/catalogo/${perfume.slug}`}
              aria-label={`Ver ${perfume.nombre} de ${perfume.marca}`}
              className="absolute inset-0 z-[2] flex items-center justify-center px-8 pb-12 pt-8 lg:px-12 lg:pb-14 lg:pt-12"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- remote catalog image */}
              <img
                src={perfume.imagen_url}
                alt={`${perfume.nombre} de ${perfume.marca}`}
                className="max-h-[82%] max-w-[82%] object-contain drop-shadow-[0_30px_28px_rgba(63,39,18,.22)] transition-transform duration-700 hover:scale-[1.018] dark:drop-shadow-[0_34px_36px_rgba(0,0,0,.58)]"
              />
            </Link>
          ) : (
            <div className="absolute inset-0 z-[2] grid place-items-center px-12 text-center">
              <p className="max-w-[22ch] font-display text-3xl italic text-muted">Objeto editorial en preparación.</p>
            </div>
          )}
          {perfume ? (
            <div className="absolute bottom-7 left-[10%] right-[6%] z-[3] flex items-end justify-between gap-6 border-t border-line pt-4">
              <div>
                <p className="font-display text-2xl font-medium leading-none text-ink lg:text-3xl">{perfume.nombre}</p>
                <p className="mt-2 font-plex text-[9px] uppercase tracking-[.14em] text-muted">{perfume.marca}</p>
              </div>
              <span className="hidden font-plex text-[9px] uppercase tracking-[.14em] text-muted sm:inline">Objeto 01</span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
