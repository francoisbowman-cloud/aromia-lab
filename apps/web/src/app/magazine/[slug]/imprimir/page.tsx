import Link from "next/link";
import { getArticuloBySlug } from "@/lib/api";
import { PrintableArticle } from "@/components/magazine/PrintableArticle";
import { PrintToolbar } from "@/components/magazine/PrintToolbar";

export const dynamic = "force-dynamic";

export default async function MagazineArticlePrintPage({
  params,
}: {
  params: { slug: string };
}) {
  const articulo = await getArticuloBySlug(params.slug);

  if (!articulo) {
    return (
      <main className="flex min-h-[360px] flex-col items-center justify-center gap-5 px-6 text-center">
        <p className="font-sans text-[15px] text-muted">Este artículo no está disponible.</p>
        <Link
          href="/magazine"
          className="font-sans text-[12px] uppercase tracking-[.12em] text-gold-contrast"
        >
          Volver al Magazine
        </Link>
      </main>
    );
  }

  return (
    <main>
      <PrintToolbar slug={articulo.slug} />
      <PrintableArticle article={articulo} />
    </main>
  );
}
