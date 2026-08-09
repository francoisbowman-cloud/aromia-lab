"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Perfume } from "@/lib/types";
import { Button } from "@/components/ui/button";

const EYEBROW = "font-sans text-[10px] uppercase tracking-[.32em] font-semibold text-gold-contrast dark:text-gold-dark";

const HERO_NOTES = [
  { label: "Bergamota", className: "left-[7%] top-[19%] sm:left-[17%] sm:top-[27%]", reverse: true, mobile: true },
  { label: "Ámbar gris", className: "right-[6%] top-[14%] sm:left-[75%] sm:right-auto sm:top-[19%]", reverse: false, mobile: true },
  { label: "Cuero", className: "left-[12%] top-[69%]", reverse: true, mobile: false },
  { label: "Azahar", className: "left-[79%] top-[75%]", reverse: false, mobile: false },
];

export function HomeHero({ perfume }: { perfume?: Perfume }) {
  const sceneRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = sceneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `translate(${x * 5}px, ${y * 5}px) scale(1.02)`;
  };

  const resetParallax = () => { if (sceneRef.current) sceneRef.current.style.transform = "scale(1.02)"; };

  return (
    <header className="relative flex min-h-[92svh] items-end overflow-hidden bg-[#eee5d6] dark:bg-[#0d0a08] lg:min-h-[96vh]" onMouseMove={handleMouseMove} onMouseLeave={resetParallax}>
      <div ref={sceneRef} aria-hidden="true" className="aromia-scene-macro absolute -inset-4 overflow-hidden transition-transform duration-500 ease-out" style={{ transform: "scale(1.02)" }}>
        <Image src="/editorial/bright-soft-focus.png" alt="" fill priority sizes="100vw" className="object-cover object-center opacity-[.86] saturate-[.92] contrast-[1.02] dark:hidden" />
        <Image src="/editorial/moody-closeup.png" alt="" fill priority sizes="100vw" className="hidden object-cover object-center opacity-[.8] saturate-[.84] dark:block" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,248,243,.9)_0%,rgba(251,248,243,.58)_38%,rgba(251,248,243,.12)_70%,rgba(251,248,243,.03)_100%)] dark:bg-[linear-gradient(90deg,rgba(14,12,10,.86)_0%,rgba(14,12,10,.48)_42%,rgba(14,12,10,.12)_72%,rgba(14,12,10,.04)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[44%] bg-[linear-gradient(0deg,rgba(251,248,243,.78),transparent)] dark:bg-[linear-gradient(0deg,rgba(14,12,10,.78),transparent)]" />

      <div className="absolute inset-x-6 top-6 z-[5] flex items-center gap-4 border-b border-[rgba(33,29,23,.18)] pb-4 font-plex text-[9px] uppercase tracking-[.2em] text-[rgba(33,29,23,.62)] dark:border-[rgba(242,235,221,.18)] dark:text-[rgba(242,235,221,.62)] lg:inset-x-10 lg:top-8">
        <span>Aromia</span><span className="h-px flex-1 bg-current opacity-25" /><span>Hybrid Signature</span><span>Vol. 01</span>
      </div>

      <div aria-hidden="true" className="absolute right-[5%] top-[15%] z-[2] hidden h-[58%] w-[26%] rounded-[48%_48%_42%_42%/30%_30%_18%_18%] border border-white/45 bg-[linear-gradient(145deg,rgba(255,255,255,.22),rgba(200,168,107,.08)_45%,rgba(74,48,25,.12))] shadow-[0_36px_110px_rgba(65,45,24,.2),inset_0_0_46px_rgba(255,255,255,.16)] backdrop-blur-[2px] lg:block dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(255,255,255,.05),rgba(200,168,107,.05)_45%,rgba(0,0,0,.18))]" />
      <div aria-hidden="true" className="absolute right-[10%] top-[9%] z-[2] hidden h-[13%] w-[16%] rounded-t-[42%] border border-white/35 bg-[linear-gradient(180deg,rgba(200,168,107,.78),rgba(134,101,38,.46))] shadow-[0_12px_28px_rgba(56,37,18,.18)] lg:block dark:border-white/10" />

      {perfume?.imagen_url ? (
        <Link href={`/catalogo/${perfume.slug}`} className="absolute right-[5.8%] top-[18%] z-[3] hidden h-[54%] w-[24%] items-center justify-center lg:flex" aria-label={`Ver ${perfume.nombre} de ${perfume.marca}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} className="max-h-[82%] max-w-[78%] object-contain drop-shadow-[0_26px_24px_rgba(48,31,14,.24)] transition-transform duration-700 hover:scale-[1.025] dark:drop-shadow-[0_26px_28px_rgba(0,0,0,.48)]" />
        </Link>
      ) : null}

      {HERO_NOTES.map((note) => (
        <a key={note.label} href="#indice-olfativo" aria-label={`Explorar el índice olfativo desde ${note.label}`} className={`aromia-note group absolute z-[4] ${note.mobile ? "flex" : "hidden lg:flex"} min-h-11 cursor-pointer items-center gap-[9px] px-1 outline-none focus-visible:ring-2 focus-visible:ring-gold ${note.reverse ? "flex-row-reverse" : ""} ${note.className}`}>
          <span className="aromia-note-dot h-[5px] w-[5px] flex-none rounded-full transition-shadow" />
          <span className="aromia-note-line h-px w-[22px] flex-none transition-all group-hover:w-9 lg:w-[28px]" />
          <span className="font-plex text-[9px] uppercase tracking-[.18em] text-ink [text-shadow:0_1px_9px_rgba(251,248,243,.9)] lg:text-[10px] dark:[text-shadow:0_1px_9px_rgba(14,12,10,.9)]">{note.label}</span>
        </a>
      ))}

      <div className="relative z-[4] w-full px-6 pb-12 sm:pb-16 lg:px-10 lg:pb-16">
        <div className="max-w-[880px] lg:max-w-[66%]">
          <p className={EYEBROW}>Editorial · discovery · commerce</p>
          <h1 className="mt-5 max-w-[10ch] font-display text-[48px] font-semibold leading-[.9] tracking-[-.04em] text-ink sm:text-[64px] lg:text-[102px]">
            La naturaleza convertida en
            <br />
            <em className="font-medium text-gold-contrast">emoción.</em>
          </h1>
        </div>

        <div className="mt-7 grid max-w-[1050px] grid-cols-1 gap-6 border-t border-[rgba(33,29,23,.2)] pt-5 dark:border-[rgba(242,235,221,.18)] sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="flex max-w-[560px] gap-4">
            <span className="mt-1 font-display text-3xl italic text-gold-contrast">A</span>
            <div>
              <p className="font-sans text-[15px] leading-7 text-[rgba(33,29,23,.82)] dark:text-[rgba(242,235,221,.8)]">Fragancias que cuentan historias. Aromia conecta materia, memoria, identidad y datos para ayudarte a elegir con criterio.</p>
              {perfume ? <p className="mt-2 font-plex text-[9px] uppercase tracking-[.18em] text-muted">Objeto editorial · {perfume.nombre} / {perfume.marca}</p> : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Button asChild size="lg"><Link href="/catalogo">Descubrir colecciones</Link></Button>
            <Link href="/quiz" className="nav-link font-sans text-sm text-ink transition hover:text-gold-contrast">Encontrar mi perfume →</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
