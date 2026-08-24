"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { formattedReferencePrice, publicText } from "@/lib/catalogDisplay";
import { perfumersForPerfume } from "@/lib/perfumers";
import { recordPerfumeInterest, recordPerfumerInterest } from "@/lib/discoveryProfile";
import { trackEvent } from "@/lib/analytics";
import { ProductImage } from "./ProductImage";

export function HeroHeaderSkeleton() {
  return (
    <section className="grid min-h-[72vh] border-y border-line lg:grid-cols-[1.06fr_.94fr]" aria-busy="true">
      <div className="animate-pulse bg-[#e6e8e4] dark:bg-[#1c2621]" />
      <div className="flex flex-col justify-center gap-4 p-8 lg:p-14"><div className="h-3 w-24 animate-pulse bg-soft"/><div className="h-10 w-3/4 animate-pulse bg-soft"/></div>
    </section>
  );
}

export function HeroHeader({ perfume }: { perfume: Perfume }) {
  const family = publicText(perfume.familia_olfativa);
  const concentration = publicText(perfume.concentracion);
  const price = formattedReferencePrice(perfume);
  const perfumers = perfumersForPerfume(perfume.slug);
  const buyHref = `/api/catalog-buy/${encodeURIComponent(perfume.slug)}`;

  useEffect(() => { recordPerfumeInterest(perfume, 1); }, [perfume]);

  const trackBuy = () => {
    trackEvent("pdp_gallery_interaction", { perfume_slug: perfume.slug, action: "availability_cta" });
    trackEvent("affiliate_click", { perfume_slug: perfume.slug, retailer: "amazon", surface: "cta" });
  };

  return (
    <section className="grid min-h-[72vh] border-y border-line lg:grid-cols-[1.07fr_.93fr]">
      <div className="aromia-material-wash relative min-h-[520px] overflow-hidden lg:min-h-[72vh]">
        <div aria-hidden="true" className="absolute left-[12%] top-[10%] h-[72%] w-[72%] rounded-[50%] bg-[#d9c8b1]/42 blur-[90px] dark:bg-[#4a1f24]/18" />
        <div className="absolute inset-[4%] sm:inset-[6%] lg:inset-[4%_8%_2%_6%]">
          <ProductImage slug={perfume.slug} imageUrl={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} mode="hero" />
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-5 border-t border-line pt-3 font-plex text-xs uppercase tracking-[.13em] text-muted sm:left-8 sm:right-8">
          <span>Objeto auténtico</span>
          <span>{perfume.marca}</span>
        </div>
      </div>

      <div className="flex flex-col justify-between px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div>
          <div className="flex items-center justify-between gap-4 font-plex text-xs uppercase tracking-[.14em] text-muted">
            <span>Ficha Aromia</span>
            <span>{concentration ?? "Perfume"}</span>
          </div>

          <p className="mt-12 font-plex text-xs uppercase tracking-[.15em] text-[#5a6b54] dark:text-[#b8c5b3]">{family ?? "Objeto olfativo"}</p>
          <h1 className="mt-4 max-w-[10ch] font-display text-[52px] font-medium leading-[.88] tracking-[-.05em] text-ink sm:text-[66px] lg:text-[78px]">{perfume.nombre}</h1>
          <p className="mt-4 font-sans text-sm uppercase tracking-[.08em] text-muted">{perfume.marca}</p>

          {publicText(perfume.descripcion_corta) ? (
            <p className="mt-9 max-w-[42ch] font-display text-[25px] leading-[1.25] tracking-[-.015em] text-ink sm:text-[28px]">{publicText(perfume.descripcion_corta)}</p>
          ) : null}

          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-line pt-6 font-sans text-sm">
            <div><dt className="font-plex text-xs uppercase tracking-[.12em] text-muted">Género</dt><dd className="mt-2 capitalize text-ink">{perfume.genero}</dd></div>
            <div><dt className="font-plex text-xs uppercase tracking-[.12em] text-muted">Concentración</dt><dd className="mt-2 text-ink">{concentration ?? "No especificada"}</dd></div>
            {family ? <div className="col-span-2"><dt className="font-plex text-xs uppercase tracking-[.12em] text-muted">Familia</dt><dd className="mt-2 font-display text-xl capitalize text-ink">{family}</dd></div> : null}
            {perfumers.length ? (
              <div className="col-span-2">
                <dt className="font-plex text-xs uppercase tracking-[.12em] text-muted">Perfumista{perfumers.length > 1 ? "s" : ""}</dt>
                <dd className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
                  {perfumers.map((perfumer) => (
                    <Link
                      key={perfumer.slug}
                      href={`/perfumistas/${perfumer.slug}`}
                      onClick={() => { recordPerfumerInterest(perfumer.slug, 3); trackEvent("perfumer_open", { perfumer_slug: perfumer.slug, source_perfume_slug: perfume.slug }); }}
                      className="inline-flex min-h-11 items-center font-display text-xl text-ink transition hover:text-[#5a6b54]"
                    >
                      {perfumer.name}
                    </Link>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
          <div><p className="font-plex text-xs uppercase tracking-[.12em] text-muted">Referencia</p><p className="mt-1 font-display text-2xl text-ink">{price ?? "Consultar"}</p></div>
          <a href={buyHref} target="_blank" rel="sponsored noopener noreferrer" onClick={trackBuy} className="inline-flex min-h-12 items-center border-b border-ink font-plex text-xs uppercase tracking-[.13em] text-ink transition hover:border-[#5a6b54] hover:text-[#5a6b54]">Ver disponibilidad <span aria-hidden="true" className="ml-4">↗</span></a>
        </div>
      </div>
    </section>
  );
}
