"use client";

import { useState } from "react";
import type { Perfume } from "@/lib/types";
import { ImagePlaceholder } from "./ImagePlaceholder";

export function HeroHeaderSkeleton() {
  return (
    <section className="grid min-h-[76vh] overflow-hidden border-y border-line bg-[#fffdf8] dark:bg-[#100d0a] lg:grid-cols-[1.14fr_.86fr]" aria-busy="true">
      <div className="animate-pulse bg-soft" />
      <div className="flex flex-col justify-center gap-4 p-8 lg:p-14"><div className="h-3 w-24 animate-pulse rounded bg-soft" /><div className="h-10 w-3/4 animate-pulse rounded bg-soft" /></div>
    </section>
  );
}

function formatPrice(perfume: Perfume) {
  if (perfume.precio_referencia == null || !perfume.moneda) return "Precio por verificar";
  return Number(perfume.precio_referencia).toLocaleString("es-AR", { style: "currency", currency: perfume.moneda });
}

export function HeroHeader({ perfume }: { perfume: Perfume }) {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(perfume.imagen_url) && !imgError;

  return (
    <section className="relative grid min-h-[78vh] overflow-hidden border-y border-line bg-[#fffdf8] dark:bg-[#100d0a] lg:grid-cols-[1.14fr_.86fr]">
      <div className="relative min-h-[560px] overflow-hidden bg-[#eee4d4] dark:bg-[#15110d] lg:min-h-[78vh]">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,.96),transparent_34%),radial-gradient(circle_at_78%_72%,rgba(182,138,68,.22),transparent_28%),linear-gradient(145deg,#faf6ee_0%,#ede2d1_55%,#dac29b_100%)] dark:bg-[radial-gradient(circle_at_30%_18%,rgba(200,168,107,.11),transparent_30%),radial-gradient(circle_at_78%_72%,rgba(182,138,68,.10),transparent_28%),linear-gradient(145deg,#17120d_0%,#0e0b08_62%,#241b11_100%)]" />
        <div aria-hidden="true" className="absolute -left-[3%] top-[6%] font-display text-[clamp(120px,19vw,290px)] leading-none tracking-[-.08em] text-[rgba(182,138,68,.07)] dark:text-[rgba(200,168,107,.05)]">{perfume.marca.slice(0, 2).toUpperCase()}</div>
        <div aria-hidden="true" className="absolute bottom-[8%] left-[8%] right-[8%] h-px bg-[linear-gradient(90deg,transparent,rgba(134,101,38,.4),transparent)]" />

        {showImage ? (
          <div className="absolute inset-0 flex items-center justify-center px-10 pb-20 pt-16 lg:px-20 lg:pb-24 lg:pt-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={perfume.imagen_url ?? undefined}
              alt={`${perfume.nombre} de ${perfume.marca}`}
              className="max-h-[82%] max-w-[82%] object-contain drop-shadow-[0_36px_34px_rgba(69,47,20,.20)] transition-transform duration-700 hover:scale-[1.012] dark:drop-shadow-[0_36px_40px_rgba(0,0,0,.56)]"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <ImagePlaceholder alt={`${perfume.nombre} — imagen no disponible`} />
        )}

        <div className="absolute left-5 top-5 flex items-center gap-3 font-plex text-[8px] uppercase tracking-[.18em] text-muted">
          <span>Object study</span><span className="h-px w-10 bg-current opacity-40"/><span>01</span>
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex items-center gap-4 border-t border-[rgba(33,29,23,.16)] pt-3 font-plex text-[8px] uppercase tracking-[.14em] text-muted dark:border-white/10">
          <span>{perfume.genero}</span><span className="h-px flex-1 bg-current opacity-25"/><span>{perfume.concentracion ?? "Concentración pendiente"}</span>
        </div>
      </div>

      <div className="relative flex flex-col justify-between px-6 py-10 lg:px-12 lg:py-14 xl:px-16">
        <div>
          <div className="flex items-center gap-4 border-b border-line pb-4 font-plex text-[8px] uppercase tracking-[.18em] text-muted"><span>Aromia object file</span><span className="h-px flex-1 bg-line"/><span>Edition 01</span></div>
          <p className="mt-10 font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">{perfume.familia_olfativa ?? "Familia por verificar"}</p>
          <h1 className="mt-4 max-w-[9ch] font-display text-[54px] font-medium leading-[.88] tracking-[-.045em] text-ink lg:text-[82px] xl:text-[92px]">{perfume.nombre}</h1>
          <p className="mt-4 font-display text-[26px] italic text-muted">{perfume.marca}</p>
          {perfume.descripcion_corta ? <p className="mt-8 max-w-[44ch] font-sans text-[15px] leading-7 text-muted">{perfume.descripcion_corta}</p> : null}

          <dl className="mt-10 grid grid-cols-2 border-y border-line">
            <div className="border-r border-line py-5 pr-5"><dt className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">Familia</dt><dd className="mt-2 font-display text-lg italic text-ink">{perfume.familia_olfativa ?? "Por verificar"}</dd></div>
            <div className="py-5 pl-5"><dt className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">Concentración</dt><dd className="mt-2 font-display text-lg text-ink">{perfume.concentracion ?? "—"}</dd></div>
            <div className="border-r border-t border-line py-5 pr-5"><dt className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">Perfil</dt><dd className="mt-2 capitalize font-sans text-sm text-ink">{perfume.genero}</dd></div>
            <div className="border-t border-line py-5 pl-5"><dt className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">Categoría</dt><dd className="mt-2 capitalize font-sans text-sm text-ink">{perfume.categoria_precio ?? "Por verificar"}</dd></div>
          </dl>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-line pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="font-plex text-[8px] uppercase tracking-[.16em] text-muted">Referencia desde</p><p className="mt-1 font-display text-[30px] text-ink">{formatPrice(perfume)}</p></div>
          <a href="#precios" className="group inline-flex w-fit items-center gap-3 border-b border-ink pb-2 font-plex text-[9px] uppercase tracking-[.14em] text-ink transition hover:border-gold hover:text-gold-contrast dark:border-[#f2ebdd]">Comparar ofertas <span className="transition-transform group-hover:translate-y-0.5">↓</span></a>
        </div>
      </div>
    </section>
  );
}
