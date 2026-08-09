"use client";

import type { Retailer } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

export function PriceTableSkeleton() {
  return <section className="min-h-[240px] animate-pulse border-y border-line bg-soft" aria-busy="true" />;
}

export function PriceTable({ retailers, perfumeSlug, perfumeNombre }: { retailers: Retailer[]; perfumeSlug?: string; perfumeNombre?: string }) {
  if (retailers.length === 0) {
    return (
      <section className="border-y border-line py-10">
        <p className="font-display text-[30px] italic text-muted">Oferta no disponible en este momento.</p>
        <p className="mt-3 max-w-[48ch] font-sans text-sm leading-6 text-muted">La ficha permanece publicada por su valor editorial; las ofertas aparecen únicamente cuando existe una fuente comercial verificable.</p>
      </section>
    );
  }

  return (
    <section>
      <ul className="border-t border-line">
        {retailers.map((r, index) => (
          <li key={r.id} className="grid grid-cols-[38px_1fr] gap-4 border-b border-line py-6 sm:grid-cols-[44px_1.3fr_.7fr_auto] sm:items-center lg:py-7">
            <span className="font-plex text-[9px] tracking-[.14em] text-gold-contrast">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p className="font-display text-[24px] leading-none text-ink">{r.nombre}</p>
              {r.detalle ? <p className="mt-2 font-sans text-xs leading-5 text-muted">{r.detalle}</p> : null}
            </div>
            <p className="col-start-2 font-display text-[26px] text-ink sm:col-start-auto">
              {Number(r.precio).toLocaleString("es-AR", { style: "currency", currency: r.moneda })}
            </p>
            <a
              href={r.link_afiliado}
              target="_blank"
              rel="sponsored noopener"
              className="group col-start-2 inline-flex w-fit items-center gap-3 border-b border-ink pb-2 font-plex text-[9px] uppercase tracking-[.15em] text-ink transition hover:border-gold hover:text-gold-contrast dark:border-[#f2ebdd] sm:col-start-auto"
              onClick={() => trackEvent("affiliate_click", { retailer: r.nombre, price: r.precio, currency: r.moneda, perfume_slug: perfumeSlug, perfume_name: perfumeNombre })}
            >
              Ver oferta <span className="transition-transform group-hover:translate-x-1">↗</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="border-b border-line py-4 font-sans text-[11px] leading-relaxed text-muted">
        Aromia participa en el Programa de Afiliados de Amazon y puede ganar una comisión por compras realizadas a través de estos enlaces, sin costo adicional para vos.
      </p>
    </section>
  );
}
