import Image from "next/image";
import Link from "next/link";
import type { Perfume } from "@/lib/types";

export function HomeHero({ perfume }: { perfume?: Perfume }) {
  return (
    <section className="relative overflow-hidden border-b border-line text-white">
      <div aria-hidden="true" className="absolute inset-0">
        <Image src="/editorial/sunlit-warm.png" alt="" fill priority sizes="100vw" className="object-cover object-center dark:hidden" />
        <Image src="/editorial/cinematic-warm.png" alt="" fill priority sizes="100vw" className="hidden object-cover object-center dark:block" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,15,10,.1)_25%,rgba(20,15,10,.72)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[650px] max-w-[1440px] flex-col justify-end px-6 py-16 lg:min-h-[720px] lg:px-10 lg:py-20 xl:px-14">
        <span className="mb-7 block h-px w-12 bg-gold" aria-hidden="true" />
        <h1 className="max-w-[8.2ch] font-display text-[54px] font-medium leading-[.92] tracking-[-.04em] text-white sm:text-[72px] lg:text-[104px]">Esencias que permanecen.</h1>
        <p className="mt-7 max-w-[440px] font-sans text-[15px] leading-7 text-white/80 lg:text-base">Aromia une perfumería, contexto editorial y descubrimiento para ayudarte a elegir una fragancia con criterio propio.</p>
        <div className="mt-9 flex flex-wrap items-center gap-6">
          <Link href="/catalogo" className="inline-flex min-h-12 items-center justify-center border border-white/65 px-7 font-plex text-[10px] uppercase tracking-[.17em] text-white transition hover:-translate-y-0.5 hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-2">Explorar colecciones</Link>
          <Link href="/quiz" className="nav-link font-sans text-sm text-white">Descubrir mi perfil →</Link>
        </div>
        {perfume ? <div className="mt-10 flex max-w-[430px] items-center gap-3 border-t border-white/25 pt-4 font-plex text-[9px] uppercase tracking-[.14em] text-white/70"><span>Selección editorial</span><span className="h-px flex-1 bg-white/25" /><span>{perfume.marca}</span></div> : null}
      </div>
    </section>
  );
}
