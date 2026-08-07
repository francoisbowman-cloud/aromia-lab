"use client";

import type { Retailer } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

export function PriceTableSkeleton() {
  return (
    <section className="rounded-table border border-line bg-surface" aria-busy="true">
      <div className="divide-y divide-line">
        {[0, 1, 2].map((i) => (
          <div key={i} className="grid grid-cols-[1.2fr_.8fr_.7fr] items-center gap-4 p-4">
            <div className="h-4 w-24 animate-pulse rounded bg-soft" />
            <div className="h-4 w-16 animate-pulse rounded bg-soft" />
            <div className="h-10 w-full animate-pulse rounded bg-soft" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function PriceTable({
  retailers,
  perfumeSlug,
  perfumeNombre,
}: {
  retailers: Retailer[];
  /** Opcionales — sin ellos el evento igual se manda, solo con menos
   * contexto (retailer/precio). Ninguna vista existente los pasa hoy
   * salvo la ficha de producto. */
  perfumeSlug?: string;
  perfumeNombre?: string;
}) {
  if (retailers.length === 0) {
    return (
      <section className="rounded-table border border-line bg-surface p-6 text-center font-sans text-sm text-muted">
        Oferta no disponible en este momento.
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-table border border-line bg-surface">
      <ul className="divide-y divide-line">
        {retailers.map((r) => (
          <li
            key={r.id}
            className="grid grid-cols-1 items-center gap-3 p-4 sm:grid-cols-[1.2fr_.8fr_.7fr] sm:gap-4"
          >
            <div>
              <p className="font-sans text-sm font-medium text-ink">{r.nombre}</p>
              {r.detalle ? <p className="font-sans text-xs text-muted">{r.detalle}</p> : null}
            </div>
            <p className="font-display text-lg text-ink">
              {Number(r.precio).toLocaleString("es-AR", {
                style: "currency",
                currency: r.moneda,
              })}
            </p>
            <Button asChild className="w-full">
              <a
                href={r.link_afiliado}
                target="_blank"
                rel="sponsored noopener"
                onClick={() =>
                  trackEvent("affiliate_click", {
                    retailer: r.nombre,
                    price: r.precio,
                    currency: r.moneda,
                    perfume_slug: perfumeSlug,
                    perfume_name: perfumeNombre,
                  })
                }
              >
                Ver oferta
              </a>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
