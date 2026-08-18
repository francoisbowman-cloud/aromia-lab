"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Perfume } from "@/lib/types";
import { formattedReferencePrice, publicText } from "@/lib/catalogDisplay";
import { perfumersForPerfume } from "@/lib/perfumers";
import { recordPerfumeInterest, recordPerfumerInterest } from "@/lib/discoveryProfile";
import { ProductImage } from "./ProductImage";

export function HeroHeaderSkeleton() {
  return <section className="grid min-h-[70vh] overflow-hidden bg-[#fffdf8] dark:bg-[#100d0a] lg:grid-cols-[1.08fr_.92fr]" aria-busy="true"><div className="animate-pulse bg-white"/><div className="flex flex-col justify-center gap-4 p-8 lg:p-14"><div className="h-3 w-24 animate-pulse rounded bg-soft"/><div className="h-10 w-3/4 animate-pulse rounded bg-soft"/></div></section>;
}

export function HeroHeader({ perfume }: { perfume: Perfume }) {
  const family = publicText(perfume.familia_olfativa);
  const concentration = publicText(perfume.concentracion);
  const price = formattedReferencePrice(perfume);
  const perfumers = perfumersForPerfume(perfume.slug);
  const buyHref = `/api/catalog-buy/${encodeURIComponent(perfume.slug)}`;

  useEffect(() => { recordPerfumeInterest(perfume, 1); }, [perfume]);

  return (
    <section className="grid min-h-[70vh] overflow-hidden bg-[#fffdf8] dark:bg-[#100d0a] lg:grid-cols-[1.08fr_.92fr]">
      <div className="relative min-h-[460px] overflow-hidden bg-[#f1e9dd] dark:bg-[#17120d] lg:min-h-[70vh]">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,.82),transparent_38%),linear-gradient(145deg,#f7f1e7_0%,#eadbc4_58%,#d6b87f_100%)] dark:bg-[radial-gradient(circle_at_35%_25%,rgba(200,168,107,.10),transparent_36%),linear-gradient(145deg,#17120d_0%,#0f0c09_62%,#261d13_100%)]"/>
        <a href={buyHref} target="_blank" rel="sponsored noopener noreferrer" aria-label={`Ver ${perfume.nombre} de ${perfume.marca} en Amazon`} className="absolute inset-[7%] overflow-hidden bg-white shadow-[0_26px_65px_rgba(89,62,28,.10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold lg:inset-[8%_13%]">
          <ProductImage slug={perfume.slug} imageUrl={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} mode="hero"/>
          <span className="absolute bottom-4 right-4 bg-[rgba(251,248,243,.92)] px-3 py-2 font-plex text-[8px] uppercase tracking-[.16em] text-ink backdrop-blur-sm">Comprar ↗</span>
        </a>
      </div>

      <div className="flex flex-col justify-between px-6 py-10 lg:px-12 lg:py-14">
        <div>
          <div className="flex items-center justify-between gap-4 font-plex text-[8px] uppercase tracking-[.18em] text-muted"><span>Ficha Aromia</span><span>{perfume.marca}</span></div>
          <p className="mt-10 min-h-3 font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">{family ?? "Objeto olfativo"}</p>
          <h1 className="mt-4 max-w-[11ch] font-display text-[44px] font-medium leading-[.94] tracking-[-.035em] text-ink sm:text-[54px] lg:text-[64px]">{perfume.nombre}</h1>
          <p className="mt-3 font-sans text-base text-muted">{perfume.marca}</p>
          {publicText(perfume.descripcion_corta) ? <p className="mt-7 max-w-[46ch] font-sans text-base leading-7 text-muted">{publicText(perfume.descripcion_corta)}</p> : null}

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7 font-sans text-sm">
            <div><dt className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">Género</dt><dd className="mt-2 capitalize text-ink">{perfume.genero}</dd></div>
            <div><dt className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">Concentración</dt><dd className="mt-2 text-ink">{concentration ?? "No especificada"}</dd></div>
            {family ? <div className="col-span-2"><dt className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">Familia olfativa</dt><dd className="mt-2 font-display text-xl capitalize text-ink">{family}</dd></div> : null}
            {perfumers.length ? <div className="col-span-2"><dt className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">Perfumista{perfumers.length > 1 ? "s" : ""}</dt><dd className="mt-2 flex flex-wrap gap-x-4 gap-y-2">{perfumers.map((perfumer) => <Link key={perfumer.slug} href={`/perfumistas/${perfumer.slug}`} onClick={() => recordPerfumerInterest(perfumer.slug, 3)} className="font-display text-xl text-ink transition hover:text-gold-contrast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">{perfumer.name}</Link>)}</dd></div> : null}
          </dl>
        </div>

        <div className="mt-12 flex flex-wrap items-end justify-between gap-6">
          <div><p className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">Referencia</p><p className="mt-1 font-display text-2xl text-ink">{price ?? "Ver disponibilidad"}</p></div>
          <a href={buyHref} target="_blank" rel="sponsored noopener noreferrer" className="font-plex text-[9px] uppercase tracking-[.14em] text-ink transition hover:text-gold-contrast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold dark:text-[#f2ebdd]">Comprar en Amazon ↗</a>
        </div>
      </div>
    </section>
  );
}
