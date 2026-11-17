"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="bg-paper text-ink">
    <section className="mx-auto flex min-h-[68vh] max-w-[1100px] items-center px-6 py-16 lg:px-10">
      <div>
        <p className="font-plex text-xs uppercase tracking-[.16em] text-muted">Aromia</p>
        <h1 className="mt-6 max-w-[18ch] font-display text-4xl leading-tight sm:text-5xl">No pudimos abrir esta página.</h1>
        <p className="mt-6 max-w-[44ch] font-sans text-base leading-7 text-muted">Puedes reintentar o volver al archivo para seguir leyendo.</p>
        <div className="mt-7 flex flex-wrap items-center gap-5">
          <button type="button" onClick={reset} className="min-h-11 border border-ink px-5 font-sans text-sm">Reintentar</button>
          <Link href="/magazine" className="inline-flex min-h-11 items-center font-sans text-sm underline underline-offset-4">Volver a Historias</Link>
        </div>
      </div>
    </section>
  </main>;
}
