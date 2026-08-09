"use client";

import type { Retailer } from "@/lib/types";
import { publicText } from "@/lib/catalogDisplay";
import { trackEvent } from "@/lib/analytics";

export function PriceTableSkeleton() {
  return <section className="border-y border-line" aria-busy="true">{[0,1,2].map((i)=><div key={i} className="grid min-h-24 grid-cols-[1.2fr_.8fr_.7fr] items-center gap-4 border-b border-line px-4 py-5 last:border-b-0"><div className="h-4 w-24 animate-pulse bg-soft"/><div className="h-4 w-16 animate-pulse bg-soft"/><div className="h-10 w-full animate-pulse bg-soft"/></div>)}</section>;
}

export function PriceTable({ retailers, directLink, perfumeSlug, perfumeNombre }: { retailers: Retailer[]; directLink?: string | null; perfumeSlug?: string; perfumeNombre?: string }) {
  const safeDirectLink = publicText(directLink);

  if (retailers.length === 0 && safeDirectLink) {
    return (
      <section className="grid gap-6 border-y border-line py-9 sm:grid-cols-[1fr_auto] sm:items-center">
        <div><p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Disponibilidad</p><p className="mt-3 font-display text-2xl text-ink">Consulta precio y stock actuales.</p><p className="mt-2 max-w-[48ch] font-sans text-sm leading-6 text-muted">El valor final depende del formato, vendedor y disponibilidad. Aromia te lleva al canal comercial sin inventar una referencia de precio.</p></div>
        <a href={safeDirectLink} target="_blank" rel="sponsored noopener" onClick={() => trackEvent("affiliate_click", { retailer: "direct", perfume_slug: perfumeSlug, perfume_name: perfumeNombre, offer_type: "direct", offer_position: 1, offer_count: 1 })} className="group flex min-w-44 items-center justify-between border-b border-ink pb-2 font-plex text-[9px] uppercase tracking-[.14em] text-ink transition hover:border-gold hover:text-gold-contrast"><span>Ver disponibilidad</span><span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span></a>
      </section>
    );
  }

  if (retailers.length === 0) return <section className="border-y border-line py-12"><p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Disponibilidad</p><p className="mt-3 font-display text-2xl text-ink">Sin oferta activa publicada.</p><p className="mt-2 max-w-[42ch] font-sans text-sm leading-6 text-muted">No mostramos precios ni enlaces sin una fuente comercial válida.</p></section>;

  return (
    <section className="border-y border-line">
      <div className="hidden grid-cols-[48px_1.2fr_.7fr_.72fr] gap-4 border-b border-line px-4 py-3 font-plex text-[8px] uppercase tracking-[.16em] text-muted sm:grid"><span>Ref.</span><span>Retailer</span><span>Precio</span><span className="text-right">Salida</span></div>
      <ul>
        {retailers.map((r,index)=><li key={r.id} className="grid grid-cols-1 items-center gap-4 border-b border-line px-4 py-5 last:border-b-0 sm:grid-cols-[48px_1.2fr_.7fr_.72fr] sm:py-6">
          <span className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">{String(index+1).padStart(2,"0")}</span>
          <div><p className="font-sans text-sm font-medium text-ink">{r.nombre}</p>{r.detalle?<p className="mt-1 font-sans text-xs text-muted">{r.detalle}</p>:null}</div>
          <p className="font-display text-xl text-ink">{Number(r.precio).toLocaleString("es-AR",{style:"currency",currency:r.moneda})}</p>
          <a href={r.link_afiliado} target="_blank" rel="sponsored noopener" onClick={() => trackEvent("affiliate_click", { retailer:r.nombre, price:r.precio, currency:r.moneda, perfume_slug:perfumeSlug, perfume_name:perfumeNombre, offer_type:"retailer", offer_position:index+1, offer_count:retailers.length })} className="group flex items-center justify-between border-b border-ink pb-2 font-plex text-[9px] uppercase tracking-[.14em] text-ink transition hover:border-gold hover:text-gold-contrast sm:justify-self-end sm:min-w-32"><span>Ver retailer</span><span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span></a>
        </li>)}
      </ul>
      <p className="border-t border-line px-4 py-4 font-sans text-[11px] leading-5 text-muted">Aromia puede recibir una comisión por compras realizadas desde enlaces de afiliado, sin costo adicional para ti. El precio final y la disponibilidad se confirman en el retailer.</p>
    </section>
  );
}
