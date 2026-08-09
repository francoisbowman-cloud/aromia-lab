"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const EYEBROW = "font-sans text-[10px] uppercase tracking-[.32em] font-semibold text-gold-contrast dark:text-gold-dark";

const HERO_NOTES = [
  { label: "Bergamota", className: "left-[8%] top-[19%] sm:left-[19%] sm:top-[28%]", reverse: true, mobile: true },
  { label: "Ámbar gris", className: "right-[7%] top-[14%] sm:left-[77%] sm:right-auto sm:top-[20%]", reverse: false, mobile: true },
  { label: "Cuero", className: "left-[14%] top-[68%]", reverse: true, mobile: false },
  { label: "Azahar", className: "left-[80%] top-[75%]", reverse: false, mobile: false },
];

export function HomeHero() {
  const sceneRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = sceneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `translate(${x * 6}px, ${y * 6}px) scale(1.015)`;
  };

  const resetParallax = () => { if (sceneRef.current) sceneRef.current.style.transform = "scale(1.015)"; };

  return (
    <header className="relative flex min-h-[90svh] items-end overflow-hidden bg-[#eee5d6] dark:bg-[#0d0a08] lg:min-h-[96vh]" onMouseMove={handleMouseMove} onMouseLeave={resetParallax}>
      <div ref={sceneRef} aria-hidden="true" className="aromia-scene-macro absolute -inset-3 overflow-hidden transition-transform duration-500 ease-out" style={{ transform: "scale(1.015)" }}>
        <Image src="/editorial/bright-soft-focus.png" alt="" fill priority sizes="100vw" className="object-cover object-center opacity-[.82] saturate-[.88] contrast-[1.03] dark:hidden" />
        <Image src="/editorial/moody-closeup.png" alt="" fill priority sizes="100vw" className="hidden object-cover object-center opacity-[.78] saturate-[.82] dark:block" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,248,243,.84)_0%,rgba(251,248,243,.48)_38%,rgba(251,248,243,.08)_72%,rgba(251,248,243,.02)_100%)] dark:bg-[linear-gradient(90deg,rgba(14,12,10,.8)_0%,rgba(14,12,10,.44)_42%,rgba(14,12,10,.1)_72%,rgba(14,12,10,.04)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(0deg,rgba(251,248,243,.72),transparent)] dark:bg-[linear-gradient(0deg,rgba(14,12,10,.72),transparent)]" />

      <div className="absolute inset-x-6 top-6 z-[3] flex items-center gap-4 border-b border-[rgba(33,29,23,.18)] pb-4 font-plex text-[9px] uppercase tracking-[.2em] text-[rgba(33,29,23,.62)] dark:border-[rgba(242,235,221,.18)] dark:text-[rgba(242,235,221,.62)] lg:inset-x-10 lg:top-8">
        <span>Aromia</span><span className="h-px flex-1 bg-current opacity-25" /><span>Olfactive Journal</span><span>Vol. 01</span>
      </div>

      <div aria-hidden="true" className="absolute right-[7%] top-[17%] z-[2] hidden h-[54%] w-[22%] rounded-[48%_48%_42%_42%/28%_28%_18%_18%] border border-white/40 bg-[linear-gradient(145deg,rgba(255,255,255,.2),rgba(200,168,107,.08)_45%,rgba(74,48,25,.12))] shadow-[0_30px_90px_rgba(65,45,24,.16),inset_0_0_40px_rgba(255,255,255,.14)] backdrop-blur-[2px] lg:block dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(255,255,255,.05),rgba(200,168,107,.05)_45%,rgba(0,0,0,.16))]" />
      <div aria-hidden="true" className="absolute right-[11.25%] top-[11%] z-[2] hidden h-[12%] w-[13.5%] rounded-t-[42%] border border-white/35 bg-[linear-gradient(180deg,rgba(200,168,107,.72),rgba(134,101,38,.42))] shadow-[0_12px_26px_rgba(56,37,18,.16)] lg:block dark:border-white/10" />

      {HERO_NOTES.map((note) => (
        <a key={note.label} href="#indice-olfativo" aria-label={`Explorar el índice olfativo desde ${note.label}`} className={`aromia-note group absolute z-[4] ${note.mobile ? "flex" : "hidden lg:flex"} min-h-11 cursor-pointer items-center gap-[9px] px-1 outline-none focus-visible:ring-2 focus-visible:ring-gold ${note.reverse ? "flex-row-reverse" : ""} ${note.className}`}>
          <span className="aromia-note-dot h-[5px] w-[5px] flex-none rounded-full transition-shadow" />
          <span className="aromia-note-line h-px w-[22px] flex-none transition-all group-hover:w-9 lg:w-[28px]" />
          <span className="font-plex text-[9px] uppercase tracking-[.18em] text-ink [text-shadow:0_1px_9px_rgba(251,248,243,.9)] lg:text-[10px] dark:[text-shadow:0_1px_9px_rgba(14,12,10,.9)]">{note.label}</span>
        </a>
      ))}

      <div className="relative z-[3] w-full px-6 pb-12 sm:pb-16 lg:px-10 lg:pb-16">
        <div className="max-w-[900px]">
          <p className={EYEBROW}>Perfumería · cultura · identidad</p>
          <h1 className="mt-5 max-w-[11ch] font-display text-[48px] font-semibold leading-[.9] tracking-[-.04em] text-ink sm:text-[64px] lg:text-[104px]">
            El perfume también
            <br />
            <em className="font-medium text-gold-contrast">dice quién eres.</em>
          </h1>
        </div>

        <div className="mt-7 grid max-w-[1080px] grid-cols-1 gap-6 border-t border-[rgba(33,29,23,.2)] pt-5 dark:border-[rgba(242,235,221,.18)] sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="flex max-w-[560px] gap-4">
            <span className="mt-1 font-display text-3xl italic text-gold-contrast">A</span>
            <p className="font-sans text-[15px] leading-7 text-[rgba(33,29,23,.8)] dark:text-[rgba(242,235,221,.8)]">Aromia convierte notas, contexto, rendimiento y cultura en una forma más humana de descubrir una fragancia.</p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Button asChild size="lg"><Link href="/catalogo">Entrar al catálogo</Link></Button>
            <Link href="/quiz" className="nav-link font-sans text-sm text-ink transition hover:text-gold-contrast">Descubrir mi perfil →</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
