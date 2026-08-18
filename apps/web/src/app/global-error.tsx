"use client";

import "./globals.css";

/**
 * Root-layout error boundary. It replaces <html>/<body>, so it deliberately
 * depends only on globals.css rather than NavBar, Footer or route-level UI.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es" data-theme="light">
      <body className="flex min-h-screen flex-col items-center justify-center bg-paper p-6 antialiased">
        <div className="mx-auto max-w-md text-center">
          <p className="font-sans text-xs uppercase tracking-[.2em] text-gold-contrast">Aromia</p>
          <h1 className="mt-5 font-display text-4xl leading-tight text-ink">Esta página no pudo cargar.</h1>
          <p className="mt-4 font-sans text-base leading-7 text-muted">Inténtalo de nuevo. Si el problema continúa, puedes volver al catálogo desde la siguiente carga.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-7 bg-ink px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[.08em] text-paper outline-none transition hover:bg-gold-contrast focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
