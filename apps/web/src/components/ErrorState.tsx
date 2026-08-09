"use client";

export function ErrorState({ message, reset }: { message: string; reset: () => void }) {
  return (
    <section className="mx-auto w-full max-w-[1160px] px-6 py-20 lg:px-10 lg:py-28" role="alert">
      <div className="border-y border-line py-12 lg:py-16">
        <div className="flex items-center gap-4 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>System note</span><span className="h-px flex-1 bg-line"/><span>Interrupción temporal</span></div>
        <div className="mt-9 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_.72fr] lg:items-end">
          <div><p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">No pudimos completar esta lectura</p><h2 className="mt-4 max-w-[12ch] font-display text-[42px] font-medium leading-[.95] tracking-[-.03em] text-ink lg:text-[56px]">La experiencia se interrumpió por un momento.</h2></div>
          <div className="lg:justify-self-end"><p className="max-w-[42ch] font-sans text-sm leading-7 text-muted">{message}</p><button type="button" onClick={reset} className="mt-6 border-b border-ink pb-1 font-plex text-[9px] uppercase tracking-[.14em] text-ink transition hover:border-gold hover:text-gold-contrast">Reintentar →</button></div>
        </div>
      </div>
    </section>
  );
}
