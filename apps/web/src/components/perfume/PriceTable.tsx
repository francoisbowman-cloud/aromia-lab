import type { Retailer } from "@/lib/types";
import { Button } from "@/components/ui/button";

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

export function PriceTable({ retailers }: { retailers: Retailer[] }) {
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
              <a href={r.link_afiliado} target="_blank" rel="sponsored noopener">
                Ver oferta
              </a>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
