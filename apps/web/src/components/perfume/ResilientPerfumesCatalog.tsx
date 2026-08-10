"use client";

import { useEffect, useState } from "react";
import type { Perfume } from "@/lib/types";
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

    fetch("/api/catalog-data", {
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Catalog proxy ${response.status}`);
        const payload = await response.json();
        if (!payload || !Array.isArray(payload.perfumes)) throw new Error("Catalog proxy returned invalid payload");
        return payload.perfumes as Perfume[];
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
          ? "Estamos recuperando las fragancias publicadas."
          : "El catálogo sigue publicado en Aromia. Recarga la página para volver a intentar."}
      </p>
    </div>
  );
}
