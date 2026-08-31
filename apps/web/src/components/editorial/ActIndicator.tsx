"use client";

import { useEffect, useState } from "react";

/**
 * P-08 · Act Indicator — REUSABLE_PRIMITIVE
 *
 * Orientación narrativa continua; sustituye a la barra de progreso. Una etiqueta
 * Plex alimentada por IntersectionObserver sobre `section[data-act]`.
 *
 * Informa de DÓNDE ESTÁ EL ARGUMENTO, no de cuánto scroll queda. Entre 3 y 6
 * actos. Los nombres son de la historia (`Reconocer`, `Acumular`, `Soltar`),
 * nunca genéricos. Sin animación: cambia, no anima.
 *
 * Ancho mínimo reservado para evitar salto de layout al cambiar de etiqueta.
 */

export interface ActIndicatorProps {
  /** Selector de las secciones observadas. */
  selector?: string;
  /** Prefijo numérico opcional ("01 ", "02 "…) tomado del orden en el DOM. */
  numbered?: boolean;
  className?: string;
}

export function ActIndicator({
  selector = "section[data-act]",
  numbered = true,
  className,
}: ActIndicatorProps) {
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (sections.length === 0) return;

    const order = new Map(sections.map((el, i) => [el, i]));
    const visible = new Set<HTMLElement>();

    const render = () => {
      let top: HTMLElement | null = null;
      let topIndex = Infinity;
      visible.forEach((el) => {
        const i = order.get(el) ?? Infinity;
        if (i < topIndex) {
          topIndex = i;
          top = el;
        }
      });
      if (!top) return;
      const name = (top as HTMLElement).dataset.act ?? "";
      const n = numbered ? String(topIndex + 1).padStart(2, "0") + " " : "";
      setLabel(n + name);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target as HTMLElement);
          else visible.delete(e.target as HTMLElement);
        }
        render();
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector, numbered]);

  return (
    <span className={`ed-act-indicator${className ? ` ${className}` : ""}`}>
      {label}
    </span>
  );
}
