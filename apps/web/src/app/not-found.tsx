import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]">
      <section className="mx-auto flex min-h-[68vh] max-w-[1100px] items-center px-6 py-16 lg:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div>
            <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">404 / Fuera del índice</p>
            <p className="mt-6 font-display text-[42px] leading-[.95] tracking-[-.035em] text-ink sm:text-[52px]">Esta pista no está en Aromia.</p>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-[42ch] font-sans text-base leading-7 text-muted">La página pudo cambiar de dirección o todavía no formar parte del archivo.</p>
            <div className="mt-7 flex flex-wrap gap-5 font-plex text-[9px] uppercase tracking-[.14em]"><Link href="/magazine" className="text-ink transition hover:text-gold-contrast">Ir al Magazine →</Link><Link href="/buscar" className="text-muted transition hover:text-ink">Buscar en Aromia</Link></div>
          </div>
        </div>
      </section>
    </main>
  );
}
