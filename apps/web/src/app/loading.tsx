export default function Loading() {
  return (
    <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]" aria-busy="true" aria-live="polite">
      <section className="mx-auto min-h-[62vh] max-w-[1180px] px-6 py-16 lg:px-10 lg:py-20">
        <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Aromia</p>
        <div className="mt-8 max-w-2xl space-y-4">
          <div className="h-12 w-4/5 animate-pulse bg-soft motion-reduce:animate-none sm:h-14" />
          <div className="h-12 w-3/5 animate-pulse bg-soft motion-reduce:animate-none sm:h-14" />
          <div className="mt-8 h-5 w-2/5 animate-pulse bg-soft motion-reduce:animate-none" />
        </div>
        <span className="sr-only">Cargando contenido</span>
      </section>
    </main>
  );
}
