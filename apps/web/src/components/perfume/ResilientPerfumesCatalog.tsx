"use client";

import { useEffect, useState } from "react";
import type { Perfume } from "@/lib/types";
import { PRODUCTION_API } from "@/lib/api";
import { PerfumesCatalog } from "./PerfumesCatalog";

export function ResilientPerfumesCatalog({
  initialPerfumes,
  initialFamilia,
}: {
  initialPerfumes: Perfume[];
  initialFamilia?: string;
}) {
  const [perfumes, setPerfumes] = useState(initialPerfumes);
  const [recovering, setRecovering] = useState(initialPerfumes.length === 0);

  useEffect(() => {
    if (initialPerfumes.length > 0) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 12_000);

    fetch(`${PRODUCTION_API}/api/perfumes`, {
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Catalog API ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Catalog API did not return an array");
        return data as Perfume[];
      })
      .then((data) => setPerfumes(data))
      .catch(() => setPerfumes([]))
      .finally(() => setRecovering(false));

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [initialPerfumes]);

  if (perfumes.length > 0) {
    return <PerfumesCatalog perfumes={perfumes} initialFamilia={initialFamilia} />;
  }

  return (
    <div className="border-y border-line py-20">
      <p className="font-display text-3xl text-ink">
        {recovering ? "Cargando fragancias…" : "No pudimos cargar el catálogo."}
      </p>
      <p className="mt-3 max-w-[42ch] font-sans text-sm leading-6 text-muted">
        {recovering
          ? "Estamos recuperando el índice directamente desde Aromia API."
          : "El catálogo publicado sigue protegido en la base de datos. Recarga la página para volver a intentar."}
      </p>
    </div>
  );
}
