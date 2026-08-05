"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Article } from "@/lib/types";
import { ArticleMetaRail } from "./ArticleMetaRail";

const PageFlipReader = dynamic(
  () => import("./PageFlipReader").then((mod) => mod.PageFlipReader),
  { ssr: false },
);

export function ArticleReadingView({ article }: { article: Article }) {
  const [readerOpen, setReaderOpen] = useState(false);

  return (
    <>
      <ArticleMetaRail article={article} onOpenReader={() => setReaderOpen(true)} />
      {readerOpen ? (
        <PageFlipReader article={article} onClose={() => setReaderOpen(false)} />
      ) : null}
    </>
  );
}
