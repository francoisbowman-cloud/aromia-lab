"use client";

import "./globals.css";

/**
 * Red de seguridad para errores que ocurren en el layout raíz mismo (fuera
 * del alcance de cualquier error.tsx de ruta — esos solo capturan errores
 * de su propio subárbol, no del layout que los envuelve). Sin este archivo,
 * un error acá caía en la pantalla de error genérica y sin estilo de
 * Next.js. Reemplaza <html>/<body> por completo — no puede depender del
 * layout raíz (NavBar/Footer/fuentes), solo de globals.css.
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
          <p className="mt-4 font-sans text-sm text-muted">
            Algo salió mal. Ya estamos al tanto — probá de nuevo en un momento.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full bg-gold-contrast px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[.08em] text-white outline-none transition hover:brightness-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
