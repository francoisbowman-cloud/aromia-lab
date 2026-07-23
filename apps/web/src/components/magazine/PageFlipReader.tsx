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

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") bookRef.current?.pageFlip()?.flipNext();
      if (e.key === "ArrowLeft") bookRef.current?.pageFlip()?.flipPrev();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(5,4,3,.94)] p-6">
      <button
        type="button"
        onClick={onClose}
        className="fixed right-6 top-5 font-sans text-[13px] uppercase tracking-[.12em] text-white"
      >
        Cerrar ✕
      </button>

      <div className="relative max-h-[calc(100dvh-3rem)] w-[min(1080px,94vw)] overflow-hidden">
        <HTMLFlipBook
          ref={bookRef}
          startPage={0}
          size="stretch"
          width={480}
          height={690}
          minWidth={280}
          maxWidth={800}
          minHeight={400}
          maxHeight={900}
          drawShadow
          flippingTime={reducedMotion ? 1 : 650}
          usePortrait
          startZIndex={30}
          autoSize
          maxShadowOpacity={0.3}
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
            <p className="font-sans text-[10px] uppercase tracking-[.18em] text-[#8d7144]">
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
            <p className="font-sans text-[10px] uppercase tracking-[.18em] text-[#8d7144]">01</p>
          </div>

          {pages.map((page, i) => (
            <div
              key={i}
              className="h-full overflow-hidden bg-[#f8f3e8] p-[clamp(28px,4vw,58px)] text-[#1b1712] shadow-[0_20px_70px_rgba(0,0,0,.3)]"
            >
              <p className="font-sans text-[10px] uppercase tracking-[.18em] text-[#8d7144]">
                {page.kicker}
              </p>
              <div className="mt-9 font-display text-[17px] leading-8 [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-[#b68a44] [&_blockquote]:pl-6 [&_blockquote]:text-[24px] [&_blockquote]:leading-[1.3] [&_h2]:mt-3 [&_h2]:text-[36px] [&_h2]:leading-none [&_p+p]:mt-5">
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
