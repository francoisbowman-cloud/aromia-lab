"use client";

import type { Retailer } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

export function PriceTableSkeleton() {
  return (
    <section className="border-y border-line" aria-busy="true">
      {[0, 1, 2].map((i) => <div key={i} className="grid min-h-24 grid-cols-[1.2fr_.8fr_.7fr] items-center gap-4 border-b border-line px-4 py-5 last:border-b-0"><div className="h-4 w-24 animate-pulse bg-soft"/><div className="h-4 w-16 animate-pulse bg-soft"/><div className="h-10 w-full animate-pulse bg-soft"/></div>)}
    </section>
  );
}

export function PriceTable({ retailers, perfumeSlug, perfumeNombre }: { retailers: Retailer[]; perfumeSlug?: string; perfumeNombre?: string }) {
  if (retailers.length === 0) {
    return (
      <section className="border-y border-line py-12">
        <p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Disponibilidad</p>
        <p className="mt-3 font-display text-2xl text-ink">Oferta por verificar.</p>
        <p className="mt-2 max-w-[42ch] font-sans text-sm leading-6 text-muted">Todavía no tenemos un retailer verificado para esta fragancia. Preferimos dejar el espacio vacío antes que mostrar un enlace incierto.</p>
      </section>
    );
  }

  return (
    <section className="border-y border-line">
      <div className="hidden grid-cols-[48px_1.2fr_.7fr_.72fr] gap-4 border-b border-line px-4 py-3 font-plex text-[8px] uppercase tracking-[.16em] text-muted sm:grid">
        <span>Ref.</span><span>Retailer</span><span>Precio</span><span className="text-right">Salida</span>
      </div>
      <ul>
        {retailers.map((r, index) => (
          <li key={r.id} className="grid grid-cols-1 items-center gap-4 border-b border-line px-4 py-5 last:border-b-0 sm:grid-cols-[48px_1.2fr_.7fr_.72fr] sm:py-6">
            <span className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">{String(index + 1).padStart(2, "0")}</span>
            <div><p className="font-sans text-sm font-medium text-ink">{r.nombre}</p>{r.detalle ? <p className="mt-1 font-sans text-xs text-muted">{r.detalle}</p> : null}</div>
            <p className="font-display text-xl text-ink">{Number(r.precio).toLocaleString("es-AR", { style: "currency", currency: r.moneda })}</p>
            <a href={r.link_afiliado} target="_blank" rel="sponsored noopener" onClick={() => trackEvent("affiliate_click", { retailer: r.nombre, price: r.precio, currency: r.moneda, perfume_slug: perfumeSlug, perfume_name: perfumeNombre })} className="group flex items-center justify-between border-b border-ink pb-2 font-plex text-[9px] uppercase tracking-[.14em] text-ink transition hover:border-gold hover:text-gold-contrast sm:justify-self-end sm:min-w-32">
              <span>Ver retailer</span><span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="border-t border-line px-4 py-4 font-sans text-[11px] leading-5 text-muted">Aromia puede recibir una comisión por compras realizadas desde enlaces de afiliado, sin costo adicional para ti. El precio final y la disponibilidad se confirman en el retailer.</p>
    </section>
  );
}
