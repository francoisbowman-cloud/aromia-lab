"use client";

import { useEffect } from "react";

/**
 * Tratamiento 2.5D de todo el sitio: profundidad por capas sin librerías.
 *
 * Marcas que cualquier componente de servidor puede usar (solo atributos):
 *  - [data-depth-stage]  escena: expone --px/--py (puntero, -1..1) y --sy
 *                        (posición en el viewport, -1..1) a sus capas .d25-layer.
 *  - [data-tilt]         tarjeta que se inclina hacia el puntero (--rx/--ry) y
 *                        recibe un brillo que sigue al cursor (--mx/--my).
 *  - [data-depth-reveal] entra con elevación al hacer scroll.
 *
 * Nada de esto se activa con prefers-reduced-motion, y el contenido es visible
 * sin JS: el estado oculto de reveal solo existe bajo html[data-depth="on"].
 */
export function DepthEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let teardown: (() => void) | undefined;
    let cancelled = false;
    // Se arranca después de hidratar: escribir estilos antes provocaría un desajuste (React #418).
    const begin = () => {
      if (cancelled) return;
      teardown = start();
    };
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(begin, { timeout: 2500 });
      else window.setTimeout(begin, 600);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      teardown?.();
    };
  }, []);

  return null;
}

function start() {
    const root = document.documentElement;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    root.dataset.depth = "on";

    const clamp = (value: number) => Math.max(-1, Math.min(1, value));
    const visibleStages = new Set<HTMLElement>();
    let frame = 0;
    const pending = new Map<HTMLElement, Record<string, string>>();

    const flush = () => {
      frame = 0;
      pending.forEach((vars, el) => {
        for (const [name, value] of Object.entries(vars)) el.style.setProperty(name, value);
      });
      pending.clear();
    };
    const queue = (el: HTMLElement, vars: Record<string, string>) => {
      pending.set(el, { ...(pending.get(el) ?? {}), ...vars });
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const updateScroll = () => {
      const half = window.innerHeight / 2;
      visibleStages.forEach((stage) => {
        const rect = stage.getBoundingClientRect();
        queue(stage, { "--sy": clamp((rect.top + rect.height / 2 - half) / (half + rect.height / 2)).toFixed(3) });
      });
    };

    const stageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) visibleStages.add(el);
        else visibleStages.delete(el);
      });
      updateScroll();
    }, { rootMargin: "20% 0px" });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });

    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-depth-stage]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        stageObserver.observe(el);
      });
      document.querySelectorAll<HTMLElement>("[data-depth-reveal]").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        revealObserver.observe(el);
      });
    };
    scan();

    let scanFrame = 0;
    const mutations = new MutationObserver(() => {
      if (scanFrame) return;
      scanFrame = requestAnimationFrame(() => { scanFrame = 0; scan(); });
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = event.target as Element | null;
      const stage = target?.closest<HTMLElement>("[data-depth-stage]");
      if (stage) {
        const rect = stage.getBoundingClientRect();
        queue(stage, {
          "--px": clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2).toFixed(3),
          "--py": clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2).toFixed(3),
        });
      }
      const card = target?.closest<HTMLElement>("[data-tilt]");
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        queue(card, {
          "--rx": ((x - 0.5) * 8).toFixed(2),
          "--ry": ((0.5 - y) * 8).toFixed(2),
          "--mx": `${(x * 100).toFixed(1)}%`,
          "--my": `${(y * 100).toFixed(1)}%`,
        });
      }
    };
    const onLeave = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!(target instanceof HTMLElement)) return;
      if (target.matches("[data-depth-stage]")) queue(target, { "--px": "0", "--py": "0" });
      if (target.matches("[data-tilt]")) queue(target, { "--rx": "0", "--ry": "0" });
    };

    if (finePointer) {
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave as EventListener, { capture: true, passive: true });
    }
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });

    return () => {
      delete root.dataset.depth;
      stageObserver.disconnect();
      revealObserver.disconnect();
      mutations.disconnect();
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave as EventListener, { capture: true });
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      if (frame) cancelAnimationFrame(frame);
      if (scanFrame) cancelAnimationFrame(scanFrame);
    };
}
