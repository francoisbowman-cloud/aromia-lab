"use client";

import { readingTimeMinutes } from "@/lib/readingTime";
import type { Article } from "@/lib/types";

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArticleMetaRail({
  article,
  onOpenReader,
}: {
  article: Article;
  onOpenReader: () => void;
}) {
  const minutos = readingTimeMinutes(article.contenido_html);

  return (
    <aside className="border-t border-line pt-5 lg:sticky lg:top-[96px] lg:self-start">
      <dl className="font-sans text-[12px] leading-7">
        {article.autor ? (
          <>
            <dt className="uppercase tracking-[.12em] text-muted">Autor</dt>
            <dd className="text-ink">{article.autor}</dd>
          </>
        ) : null}
        <dt className="mt-3 uppercase tracking-[.12em] text-muted">Fecha</dt>
        <dd className="text-ink">{formatFecha(article.publicado_en)}</dd>
        <dt className="mt-3 uppercase tracking-[.12em] text-muted">Lectura</dt>
        <dd className="text-ink">{minutos} minutos</dd>
      </dl>
      <div className="mt-8 grid gap-3">
        <button
          type="button"
          onClick={onOpenReader}
          className="inline-flex min-h-[48px] items-center justify-center bg-gold px-5 font-sans text-[13px] font-semibold uppercase tracking-[.02em] text-ink transition hover:-translate-y-px"
        >
          Iniciar lectura
        </button>
      </div>
    </aside>
  );
}

export function ArticleMetaRailSkeleton() {
  return (
    <aside className="border-t border-line pt-5" aria-busy="true">
      <div className="flex flex-col gap-2">
        <div className="h-3 w-16 animate-pulse rounded bg-soft" />
        <div className="h-4 w-24 animate-pulse rounded bg-soft" />
        <div className="mt-2 h-3 w-16 animate-pulse rounded bg-soft" />
        <div className="h-4 w-24 animate-pulse rounded bg-soft" />
      </div>
      <div className="mt-8 grid gap-3">
        <div className="h-12 animate-pulse rounded bg-soft" />
        <div className="h-12 animate-pulse rounded bg-soft" />
      </div>
    </aside>
  );
}
