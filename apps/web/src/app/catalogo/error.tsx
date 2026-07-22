"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl p-8 text-center">
      <p className="rounded-card border border-line bg-surface p-8 font-sans text-sm text-muted">
        No se pudo cargar el catálogo. Puede ser un problema temporal de conexión.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-full bg-gold-contrast px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[.08em] text-white"
      >
        Reintentar
      </button>
    </main>
  );
}
