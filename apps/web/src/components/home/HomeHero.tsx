"use client";

import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const EYEBROW =
  "font-sans text-[11px] uppercase tracking-[.3em] font-semibold text-gold-contrast dark:text-gold-dark";

// Notas ancladas a la composición macro del hero — no son un filtro de
// catálogo (no hay una taxonomía de notas individuales con ruta propia
// todavía, ver ESTADO-aromia.md), así que llevan a la sección real más
// cercana: el Índice Olfativo más abajo en esta misma página.
const HERO_NOTES = [
  { label: "Bergamota", className: "left-[20%] top-[29%]", reverse: true },
  { label: "Ámbar gris", className: "left-[78%] top-[19%]", reverse: false },
  { label: "Cuero", className: "left-[13%] top-[69%]", reverse: true },
  { label: "Azahar", className: "left-[80%] top-[77%]", reverse: false },
];

export function HomeHero() {
  const sceneRef = useRef<HTMLDivElement>(null);

  // Paralaje muy sutil al mouse (desktop only, gated por :hover en el propio
  // navegador — en touch simplemente no dispara mousemove). Sin Framer
  // Motion: transform inline vía JS nativo, nada que anime por sí solo.
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = sceneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
  };

  const resetParallax = () => {
    if (sceneRef.current) sceneRef.current.style.transform = "";
  };

  return (
    <header
      className="relative flex min-h-[88vh] items-end overflow-hidden lg:min-h-[92vh]"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetParallax}
    >
      <div
        ref={sceneRef}
        aria-hidden="true"
        className="aromia-scene-macro absolute -inset-3 transition-transform duration-300 ease-out"
      />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(120,95,60,.16)_0%,transparent_42%,rgba(120,95,60,.07)_100%)] dark:bg-[linear-gradient(0deg,rgba(14,12,10,.5)_0%,transparent_42%,rgba(14,12,10,.22)_100%)]" />

      {HERO_NOTES.map((note) => (
        <a
          key={note.label}
          href="#indice-olfativo"
          className={`aromia-note group absolute z-[1] flex cursor-pointer items-center gap-[9px] ${
            note.reverse ? "flex-row-reverse" : ""
          } ${note.className}`}
        >
          <span className="aromia-note-dot h-[5px] w-[5px] flex-none rounded-full transition-shadow" />
          <span className="aromia-note-line h-px w-[26px] flex-none transition-all group-hover:w-8" />
          <span className="font-plex text-[10px] uppercase tracking-[.16em] text-ink transition-colors [text-shadow:0_1px_8px_rgba(251,248,243,.8)] dark:[text-shadow:0_1px_8px_rgba(14,12,10,.75)]">
            {note.label}
          </span>
        </a>
      ))}

      <div className="relative z-[1] max-w-[900px] px-6 pb-16 lg:px-10 lg:pb-20">
        <p className={EYEBROW}>La autoridad editorial que además vende</p>
        <h1 className="mt-5 font-display text-[44px] font-semibold leading-[.98] tracking-tight text-ink lg:text-[96px]">
          No fabricamos perfumes.
          <br />
          <em className="text-gold-contrast">Revelamos identidades.</em>
        </h1>
        <p className="mt-6 max-w-[440px] font-sans text-[15.5px] leading-relaxed text-ink/80">
          Reseñas honestas, comparadas y sin ruido — para encontrar la fragancia que realmente te
          representa.
        </p>
        <div className="mt-8 flex flex-wrap gap-3.5">
          <Button asChild size="lg">
            <Link href="/catalogo">Explorar catálogo</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/quiz">Hacer el quiz</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
