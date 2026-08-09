"use client";

import type { Retailer } from "@/lib/types";
import { publicText } from "@/lib/catalogDisplay";
import { trackEvent } from "@/lib/analytics";

export function PriceTableSkeleton() {
  return <section className="border-y border-line" aria-busy="true">{[0,1].map((i)=><div key={i} className="grid min-h-24 grid-cols-[1.2fr_.8fr_.7fr] items-center gap-4 border-b border-line px-4 py-5 last:border-b-0"><div className="h-4 w-24 animate-pulse bg-soft"/><div className="h-4 w-16 animate-pulse bg-soft"/><div className="h-10 w-full animate-pulse bg-soft"/></div>)}</section>;
}

export function PriceTable({ retailers, directLink, perfumeSlug, perfumeNombre }: { retailers: Retailer[]; directLink?: string | null; perfumeSlug?: string; perfumeNombre?: string }) {
  const amazonLink = publicText(directLink);
  if (!amazonLink) return <section className="border-y border-line py-12"><p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Amazon</p><p className="mt-3 font-display text-2xl text-ink">Producto temporalmente no disponible.</p><p className="mt-2 max-w-[42ch] font-sans text-sm leading-6 text-muted">Aromia no publica una salida comercial alternativa cuando no puede verificar el enlace Amazon del producto.</p></section>;
  return (
    <section className="border-y border-line">
      <div className="grid gap-6 bg-[#fffdf8] px-4 py-8 dark:bg-[#100d0a] sm:grid-cols-[1fr_auto] sm:items-center">
        <div><p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Amazon · Canal principal</p><p className="mt-3 font-display text-2xl text-ink">Consulta el producto, precio y stock actuales.</p><p className="mt-2 max-w-[50ch] font-sans text-sm leading-6 text-muted">La imagen mostrada en Aromia y este enlace se resuelven desde el mismo producto de Amazon. Aromia puede recibir una comisión por compras elegibles, sin costo adicional para ti.</p></div>
        <a href={amazonLink} target="_blank" rel="sponsored noopener noreferrer" onClick={()=>trackEvent("affiliate_click",{retailer:"Amazon",perfume_slug:perfumeSlug,perfume_name:perfumeNombre,offer_type:"direct",offer_position:1,offer_count:1})} className="group flex min-w-48 items-center justify-between border-b border-ink pb-2 font-plex text-[9px] uppercase tracking-[.14em] text-ink transition hover:border-gold hover:text-gold-contrast"><span>Ver en Amazon</span><span aria-hidden="true" className="transition-transform group-hover:translate-x-1">↗</span></a>
      </div>
      {retailers.length>0?<details className="border-t border-line"><summary className="cursor-pointer px-4 py-4 font-plex text-[8px] uppercase tracking-[.16em] text-muted">Referencias históricas de precio</summary><ul className="border-t border-line">{retailers.map((r,index)=><li key={r.id} className="grid grid-cols-[48px_1fr_.7fr] items-center gap-4 border-b border-line px-4 py-5 last:border-b-0"><span className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">{String(index+1).padStart(2,"0")}</span><div><p className="font-sans text-sm font-medium text-ink">{r.nombre}</p>{r.detalle?<p className="mt-1 font-sans text-xs text-muted">{r.detalle}</p>:null}</div><p className="text-right font-display text-xl text-ink">{Number(r.precio).toLocaleString("es-AR",{style:"currency",currency:r.moneda})}</p></li>)}</ul></details>:null}
    </section>
  );
}
