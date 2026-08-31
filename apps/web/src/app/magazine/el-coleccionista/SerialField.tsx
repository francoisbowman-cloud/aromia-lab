"use client";

import { useEffect, useRef, useState } from "react";

/**
 * S-02 · Campo serial que se comprime — STORY_SPECIFIC (con fuerte sospecha de
 * no promoverse nunca). Local a "El Coleccionista": representa un catálogo
 * abierto que sigue creciendo.
 *
 * Primera banda: nombres actuales VERIFICADOS de la línea Le Male. Bandas
 * siguientes: líneas sin nombres, progresivamente comprimidas, saliéndose por
 * la derecha. El caption obligatorio declara que las líneas vacías no son un
 * dato — sin ese caption, el gesto miente.
 *
 * Motion (§9): única animación de la página. Las cuatro bandas aparecen
 * escalonadas (opacidad, 170ms entre bandas) al entrar en viewport.
 * `prefers-reduced-motion` deja las cuatro bandas completas y estáticas.
 */

const VERIFIED_FIRST_BAND = [
  "Le Male",
  "Le Male Le Parfum",
  "Le Male Elixir",
  "Le Male Elixir Absolu",
];

export function SerialField() {
  const ref = useRef<HTMLDivElement | null>(null);
  // Banda 0 (nombres verificados) siempre visible — es el contenido real y no
  // debe depender de JS. Solo se escalonan las bandas vacías 1–3, que además
  // son las que narran la multiplicación.
  const [shown, setShown] = useState<boolean[]>([true, false, false, false]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setShown([true, true, true, true]);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        [1, 2, 3].forEach((i, k) => {
          window.setTimeout(() => {
            setShown((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }, (k + 1) * 170);
        });
      },
      { threshold: 0.25 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="cx-serial" ref={ref} aria-label="La familia Le Male, y su continuación">
      {[0, 1, 2, 3].map((band) => (
        <div
          key={band}
          data-band={band}
          className={`cx-serial-band ed-stagger-item${shown[band] ? " is-in" : ""}`}
        >
          {band === 0 ? (
            <span>{VERIFIED_FIRST_BAND.join("   ·   ")}</span>
          ) : (
            <span aria-hidden="true" className="cx-serial-fill" />
          )}
        </div>
      ))}
    </div>
  );
}
