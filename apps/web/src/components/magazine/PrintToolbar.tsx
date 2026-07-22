"use client";

import Link from "next/link";

export function PrintToolbar({ slug }: { slug: string }) {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-black px-6 py-4 text-white print:hidden">
      <Link href={`/magazine/${slug}`} className="font-sans text-[12px] uppercase tracking-[.12em]">
        ← Volver
      </Link>
      <div className="flex items-center gap-3">
        <span className="hidden font-sans text-[12px] text-white/60 md:inline">
          Vista optimizada para A4
        </span>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-[48px] items-center justify-center bg-gold px-5 font-sans text-[13px] font-semibold uppercase tracking-[.02em] text-[#17130f]"
        >
          Imprimir / Guardar PDF
        </button>
      </div>
    </div>
  );
}
