import type { Metadata } from "next";
import Link from "next/link";
import { getArticuloBySlug } from "@/lib/api";
import { ArticleHero } from "@/components/magazine/ArticleHero";
import { ArticleReadingView } from "@/components/magazine/ArticleReadingView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const articulo = await getArticuloBySlug(params.slug);
  if (!articulo) return {};

  return {
    title: articulo.meta_title ?? articulo.titulo,
    description: articulo.meta_description ?? undefined,
    openGraph: {
      title: articulo.meta_title ?? articulo.titulo,
      description: articulo.meta_description ?? undefined,
      images: articulo.imagen_portada_url ? [articulo.imagen_portada_url] : undefined,
    },
  };
}

export default async function MagazineArticlePage({ params }: { params: { slug: string } }) {
  const articulo = await getArticuloBySlug(params.slug);

  if (!articulo) {
    return (
      <main>
        <div className="border-b border-line">
          <div className="mx-auto flex h-[66px] max-w-[1440px] items-center px-6 lg:px-10">
            <Link href="/magazine" className="font-sans text-[12px] uppercase tracking-[.12em]">
              ← Volver al Magazine
            </Link>
          </div>
        </div>
        <div className="flex min-h-[360px] flex-col items-center justify-center gap-5 px-6 text-center">
          <p className="font-sans text-[15px] text-muted">Este artículo no está disponible.</p>
          <Link
            href="/magazine"
            className="font-sans text-[12px] uppercase tracking-[.12em] text-gold-contrast"
          >
            Volver al Magazine
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="border-b border-line">
        <div className="mx-auto flex h-[66px] max-w-[1440px] items-center justify-between px-6 lg:px-10">
          <Link href="/magazine" className="font-sans text-[12px] uppercase tracking-[.12em]">
            ← Volver al Magazine
          </Link>
        </div>
      </div>

      <ArticleHero article={articulo} />

      <section className="mx-auto max-w-[1180px] px-6 py-10 lg:px-10 lg:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(220px,.55fr)_minmax(0,1.45fr)] lg:gap-20">
          <ArticleReadingView article={articulo} />
          {articulo.contenido_html ? (
            <article
              className="prose prose-neutral max-w-[760px] font-display text-[19px] leading-[1.75] text-ink prose-headings:font-display prose-headings:text-ink prose-p:text-ink prose-blockquote:border-gold prose-blockquote:text-ink md:text-[22px]"
              dangerouslySetInnerHTML={{ __html: articulo.contenido_html }}
            />
          ) : null}
        </div>
      </section>
    </main>
  );
}
