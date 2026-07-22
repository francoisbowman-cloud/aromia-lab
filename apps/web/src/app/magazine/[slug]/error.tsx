"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main>
      <div className="border-b border-line">
        <div className="mx-auto flex h-[66px] max-w-[1440px] items-center px-6 lg:px-10">
          <Link href="/magazine" className="font-sans text-[12px] uppercase tracking-[.12em]">
            ← Volver al Magazine
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-3xl p-8 text-center">
        <p className="rounded-card border border-line bg-surface p-8 font-sans text-sm text-muted">
          Este artículo no está disponible.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-full bg-gold-contrast px-6 py-3 font-sans text-[12px] font-semibold uppercase tracking-[.08em] text-white"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}
