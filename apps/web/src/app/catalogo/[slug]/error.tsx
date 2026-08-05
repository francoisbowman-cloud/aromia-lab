"use client";

import { ErrorState } from "@/components/ErrorState";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main>
      <ErrorState message="No se pudo cargar este perfume. Puede ser un problema temporal de conexión." reset={reset} />
    </main>
  );
}
