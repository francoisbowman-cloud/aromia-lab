"use client";

import { useEffect, useMemo, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import type { Article } from "@/lib/types";
import { paginateArticle } from "@/lib/paginateArticle";

function usePrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface PageFlipInstance {
  pageFlip(): { flipNext(): void; flipPrev(): void } | undefined;
}

export function PageFlipReader({
  article,
  onClose,
}: {
  article: Article;
  onClose: () => void;
}) {
  const bookRef = useRef<PageFlipInstance | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const pages = useMemo(() => paginateArticle(article.contenido_html), [article.contenido_html]);
  const fecha = new Date(article.publicado_en).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // Modal behaviour: move focus in, keep it inside, lock page scroll, and hand focus
  // back to whatever opened the reader when it closes.
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (opener && opener.isConnected) opener.focus();
    };
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") bookRef.current?.pageFlip()?.flipNext();
      if (e.key === "ArrowLeft") bookRef.current?.pageFlip()?.flipPrev();
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'),
        ).filter((el) => !el.hasAttribute("disabled"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (!dialogRef.current.contains(active)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Lector de ${article.titulo}`}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(5,4,3,.94)] p-6"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="fixed right-6 top-5 font-sans text-[13px] uppercase tracking-[.12em] text-white"
      >
        Cerrar ✕
      </button>

      <div className="relative flex h-[min(90dvh,880px)] w-[min(94vw,560px)] items-center justify-center">
        <HTMLFlipBook
          ref={bookRef}
          startPage={0}
          size="stretch"
          width={440}
          height={660}
          minWidth={280}
          maxWidth={560}
          minHeight={420}
          maxHeight={880}
          drawShadow
          flippingTime={reducedMotion ? 1 : 700}
          usePortrait
          startZIndex={30}
          autoSize={false}
          maxShadowOpacity={0.5}
          showCover={false}
          mobileScrollSupport={false}
          clickEventForward
          useMouseEvents
          swipeDistance={30}
          showPageCorners
          disableFlipByClick={false}
          className="mx-auto"
          style={{}}
        >
          <div className="flex h-full flex-col justify-between bg-[#f8f3e8] p-[clamp(28px,4vw,58px)] text-[#1b1712] shadow-[0_20px_70px_rgba(0,0,0,.3)]">
            <p className="font-sans text-[10px] uppercase tracking-[.18em] text-[#866b41]">
              AROMIA MAGAZINE
            </p>
            <div>
              <h2 className="font-display text-[clamp(32px,5vw,52px)] leading-[.95]">
                {article.titulo}
              </h2>
              <p className="mt-6 font-display text-[18px] text-[#756b60]">
                {[article.autor, fecha].filter(Boolean).join(" · ")}
              </p>
            </div>
            <p className="font-sans text-[10px] uppercase tracking-[.18em] text-[#866b41]">01</p>
          </div>

          {pages.map((page, i) => (
            <div
              key={i}
              className="flex h-full flex-col overflow-hidden bg-[#f8f3e8] p-[clamp(26px,4vw,54px)] text-[#1b1712] shadow-[0_20px_70px_rgba(0,0,0,.3)]"
            >
              <p className="font-sans text-[10px] uppercase tracking-[.18em] text-[#866b41]">
                {page.kicker}
              </p>
              <div className="mt-7 flex-1 overflow-y-auto font-display text-[16px] leading-7 [&_blockquote]:my-5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#b68a44] [&_blockquote]:pl-6 [&_blockquote]:text-[22px] [&_blockquote]:leading-[1.3] [&_h2]:mt-2 [&_h2]:text-[32px] [&_h2]:leading-none [&_p+p]:mt-4">
                {page.blocks.map((block, bi) => (
                  <div key={bi} dangerouslySetInnerHTML={{ __html: block.html }} />
                ))}
              </div>
            </div>
          ))}
        </HTMLFlipBook>

        <button
          type="button"
          onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
          aria-label="Página anterior"
          className="absolute left-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-black/50 text-white"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => bookRef.current?.pageFlip()?.flipNext()}
          aria-label="Página siguiente"
          className="absolute right-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-black/50 text-white"
        >
          →
        </button>
      </div>
    </div>
  );
}
