"use client";

import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const EYEBROW =
  "font-sans text-[11px] uppercase tracking-[.3em] font-semibold text-gold-contrast dark:text-gold-dark";

// Las coordenadas son parte del placeholder dirigido. Cuando entren assets
// reales deben calibrarse por crop/breakpoint contra los ingredientes que
// realmente aparezcan en la fotografía (ver Visual Contract pendiente).
const HERO_NOTES = [
  {
    label: "Bergamota",
    className: "left-[8%] top-[19%] sm:left-[20%] sm:top-[29%]",
    reverse: true,
    mobile: true,
  },
  {
    label: "Ámbar gris",
    className: "right-[7%] top-[14%] sm:left-[78%] sm:right-auto sm:top-[19%]",
    reverse: false,
    mobile: true,
  },
  {
    label: "Cuero",
    className: "left-[13%] top-[69%]",
    reverse: true,
    mobile: false,
  },
  {
    label: "Azahar",
    className: "left-[80%] top-[77%]",
    reverse: false,
    mobile: false,
  },
];

export function HomeHero() {
  const sceneRef = useRef<HTMLDivElement>(null);

  // Paralaje deliberadamente mínimo y solo para puntero fino. También
  // respeta prefers-reduced-motion sin introducir estado ni dependencia.
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const el = sceneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
  };

  const resetParallax = () => {
    if (sceneRef.current) sceneRef.current.style.transform = "";
  };

  return (
    <header
      className="relative flex min-h-[86svh] items-end overflow-hidden lg:min-h-[92vh]"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetParallax}
    >
      <div
        ref={sceneRef}
        aria-hidden="true"
        className="aromia-scene-macro absolute -inset-3 transition-transform duration-300 ease-out"
      />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(120,95,60,.18)_0%,transparent_46%,rgba(120,95,60,.05)_100%)] dark:bg-[linear-gradient(0deg,rgba(14,12,10,.52)_0%,transparent_44%,rgba(14,12,10,.2)_100%)]" />

      <div className="absolute left-6 top-6 z-[2] flex items-center gap-3 font-plex text-[9px] uppercase tracking-[.18em] text-ink/55 lg:left-10 lg:top-8">
        <span>Aromia</span>
        <span className="h-px w-7 bg-current opacity-40" />
        <span>Discovery / 01</span>
      </div>

      {HERO_NOTES.map((note) => (
        <a
          key={note.label}
          href="#indice-olfativo"
          className={`aromia-note group absolute z-[1] ${note.mobile ? "flex" : "hidden sm:flex"} cursor-pointer items-center gap-[9px] ${
            note.reverse ? "flex-row-reverse" : ""
          } ${note.className}`}
        >
          <span className="aromia-note-dot h-[5px] w-[5px] flex-none rounded-full transition-shadow" />
          <span className="aromia-note-line h-px w-[22px] flex-none transition-all group-hover:w-8 sm:w-[26px]" />
          <span className="font-plex text-[9px] uppercase tracking-[.16em] text-ink transition-colors [text-shadow:0_1px_8px_rgba(251,248,243,.8)] sm:text-[10px] dark:[text-shadow:0_1px_8px_rgba(14,12,10,.75)]">
            {note.label}
          </span>
        </a>
      ))}

      <div className="relative z-[1] max-w-[980px] px-6 pb-12 sm:pb-16 lg:px-10 lg:pb-20">
        <p className={EYEBROW}>La autoridad editorial que además vende</p>
        <h1 className="mt-5 max-w-[12ch] font-display text-[46px] font-semibold leading-[.94] tracking-[-.03em] text-ink sm:text-[58px] lg:text-[96px]">
          No fabricamos perfumes.
          <br />
          <em className="font-medium text-gold-contrast">Revelamos identidades.</em>
        </h1>
        <div className="mt-6 flex max-w-[720px] flex-col gap-6 border-t border-ink/15 pt-5 sm:flex-row sm:items-end sm:justify-between dark:border-paper/15">
          <p className="max-w-[430px] font-sans text-[15px] leading-relaxed text-ink/80">
            Reseñas honestas, comparadas y sin ruido — para encontrar la fragancia que realmente te
            representa.
          </p>
          <div className="flex shrink-0 flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link href="/catalogo">Explorar catálogo</Link>
            </Button>
            <Link
              href="/quiz"
              className="nav-link font-sans text-sm text-ink transition hover:text-gold-contrast"
            >
              Encontrar mi perfume →
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
