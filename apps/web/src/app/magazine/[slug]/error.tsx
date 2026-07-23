"use client";

import Link from "next/link";
import { ErrorState } from "@/components/ErrorState";

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
      <ErrorState message="Este artículo no está disponible." reset={reset} />
    </main>
  );
}
