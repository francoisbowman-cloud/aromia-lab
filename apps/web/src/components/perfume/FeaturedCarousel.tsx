"use client";

import { useEffect, useRef } from "react";
import type { Perfume } from "@/lib/types";
import { PerfumeCard } from "./PerfumeCard";

const AUTOPLAY_MS = 4500;

/**
 * Carrusel horizontal con scroll-snap nativo (sin librería externa — no hace
 * falta más que scroll-snap + dos botones) para "Reseñas destacadas" de Home.
 * `PerfumeCard` se reutiliza tal cual — el carrusel solo cambia el layout que
 * lo envuelve, no la tarjeta. Avanza solo cada `AUTOPLAY_MS`, en loop, y se
 * pausa mientras el usuario tiene el mouse encima o interactúa a mano.
 */
export function FeaturedCarousel({ perfumes }: { perfumes: Perfume[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  const scrollByStep = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>("[data-carousel-item]");
    const step = item ? item.offsetWidth + 24 : el.clientWidth * 0.85;
    const atEnd = direction === 1 && el.scrollLeft + el.clientWidth >= el.scrollWidth - step / 2;
    const atStart = direction === -1 && el.scrollLeft <= step / 2;
    if (atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (atStart) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
      return;
    }
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  useEffect(() => {
    if (perfumes.length <= 1) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) scrollByStep(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfumes.length]);

  return (
    <div
      className="relative"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div
        ref={scrollerRef}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 pb-1"
      >
        {perfumes.map((perfume) => (
          <div
            key={perfume.slug}
            data-carousel-item
            className="w-[80%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]"
          >
            <PerfumeCard perfume={perfume} variant="featured" />
          </div>
        ))}
      </div>

      {perfumes.length > 3 ? (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Reseñas anteriores"
            onClick={() => scrollByStep(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition hover:border-gold hover:text-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-4 w-4">
              <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Siguientes reseñas"
            onClick={() => scrollByStep(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition hover:border-gold hover:text-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-4 w-4">
              <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
