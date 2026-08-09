"use client";

import type { Perfume } from "@/lib/types";
import { formattedReferencePrice, publicText } from "@/lib/catalogDisplay";
import { ProductImage } from "./ProductImage";

export function HeroHeaderSkeleton() {
  return <section className="grid min-h-[70vh] overflow-hidden border-y border-line bg-[#fffdf8] dark:bg-[#100d0a] lg:grid-cols-[1.12fr_.88fr]" aria-busy="true"><div className="animate-pulse bg-soft"/><div className="flex flex-col justify-center gap-4 p-8 lg:p-14"><div className="h-3 w-24 animate-pulse rounded bg-soft"/><div className="h-10 w-3/4 animate-pulse rounded bg-soft"/></div></section>;
}

export function HeroHeader({ perfume }: { perfume: Perfume }) {
  const family = publicText(perfume.familia_olfativa);
  const concentration = publicText(perfume.concentracion);
  const price = formattedReferencePrice(perfume);
  const buyHref = `/api/catalog-buy/${encodeURIComponent(perfume.slug)}`;
  return (
    <section className="grid min-h-[72vh] overflow-hidden border-y border-line bg-[#fffdf8] dark:bg-[#100d0a] lg:grid-cols-[1.1fr_.9fr]">
      <div className="relative min-h-[480px] overflow-hidden bg-[#e9dcc8] dark:bg-[#17120d] lg:min-h-[72vh]">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,.82),transparent_35%),linear-gradient(145deg,#f7f1e7_0%,#eadbc4_56%,#d6b87f_100%)] dark:bg-[radial-gradient(circle_at_35%_25%,rgba(200,168,107,.12),transparent_34%),linear-gradient(145deg,#17120d_0%,#0f0c09_58%,#2a2116_100%)]"/>
        <div aria-hidden="true" className="absolute bottom-[10%] left-[12%] h-[26%] w-[26%] rounded-full border border-white/70 bg-[radial-gradient(circle,rgba(255,255,255,.72),rgba(255,255,255,.08)_70%)] blur-[1px] dark:border-white/10 dark:bg-[radial-gradient(circle,rgba(200,168,107,.12),transparent_70%)]"/>
        <a href={buyHref} target="_blank" rel="sponsored noopener noreferrer" aria-label={`Ver ${perfume.nombre} de ${perfume.marca} en Amazon`} className="absolute inset-[6%] overflow-hidden border border-black/[.06] bg-[#fbfaf7] shadow-[0_26px_65px_rgba(89,62,28,.10)] dark:border-white/10 dark:bg-[#f7f4ee] lg:inset-[7%_12%]">
          <ProductImage slug={perfume.slug} alt={`${perfume.nombre} de ${perfume.marca}`} mode="hero"/>
          <span className="absolute bottom-4 right-4 border border-[rgba(33,29,23,.16)] bg-[rgba(251,248,243,.9)] px-3 py-2 font-plex text-[8px] uppercase tracking-[.16em] text-ink backdrop-blur-sm">Ver en Amazon ↗</span>
        </a>
        <div className="absolute left-5 top-5 border border-[rgba(33,29,23,.18)] bg-[rgba(251,248,243,.72)] px-3 py-2 font-plex text-[8px] uppercase tracking-[.18em] text-ink backdrop-blur-sm dark:border-white/10 dark:bg-[rgba(16,13,10,.7)]">Amazon product object</div>
        <div className="absolute bottom-5 left-5 right-5 flex items-center gap-4 border-t border-[rgba(33,29,23,.18)] pt-3 font-plex text-[8px] uppercase tracking-[.14em] text-muted dark:border-white/10"><span>Objeto</span><span className="h-px flex-1 bg-current opacity-25"/><span>Aromia / Amazon</span></div>
      </div>
      <div className="flex flex-col justify-between px-6 py-10 lg:px-12 lg:py-14">
        <div><div className="flex items-center gap-4 border-b border-line pb-4 font-plex text-[8px] uppercase tracking-[.18em] text-muted"><span>Producto</span><span className="h-px flex-1 bg-line"/><span>Hybrid Signature</span></div><p className="mt-10 min-h-3 font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">{family ?? "Objeto olfativo"}</p><h1 className="mt-4 max-w-[10ch] font-display text-[48px] font-medium leading-[.92] tracking-[-.035em] text-ink lg:text-[72px]">{perfume.nombre}</h1><p className="mt-3 font-sans text-base text-muted">{perfume.marca}</p>{publicText(perfume.descripcion_corta)?<p className="mt-7 max-w-[46ch] font-sans text-[15px] leading-7 text-muted">{publicText(perfume.descripcion_corta)}</p>:null}
          <dl className="mt-10 grid grid-cols-2 border-y border-line font-sans text-sm"><div className="border-r border-line py-5 pr-5"><dt className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">Género</dt><dd className="mt-2 capitalize text-ink">{perfume.genero}</dd></div><div className="py-5 pl-5"><dt className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">Concentración</dt><dd className="mt-2 text-ink">{concentration ?? "No especificada"}</dd></div>{family?<div className="col-span-2 border-t border-line py-5"><dt className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">Familia olfativa</dt><dd className="mt-2 font-display text-xl capitalize text-ink">{family}</dd></div>:null}</dl></div>
        <div className="mt-12 flex items-end justify-between gap-6 border-t border-line pt-5"><div><p className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">Referencia</p><p className="mt-1 font-display text-2xl text-ink">{price ?? "Ver disponibilidad"}</p></div><a href={buyHref} target="_blank" rel="sponsored noopener noreferrer" className="border-b border-ink pb-1 font-plex text-[9px] uppercase tracking-[.14em] text-ink transition hover:border-gold hover:text-gold-contrast dark:border-[#f2ebdd]">Comprar en Amazon ↗</a></div>
      </div>
    </section>
  );
}
