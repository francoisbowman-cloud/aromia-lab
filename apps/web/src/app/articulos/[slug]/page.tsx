import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticuloBySlug, getPerfumes } from "@/lib/api";

const CATEGORIA_LABEL: Record<string, string> = {
  resena: "Reseña",
  guia: "Guía",
  analisis: "Análisis",
  academia: "Academia",
  tendencias: "Tendencias",
};

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

export default async function ArticuloPage({ params }: { params: { slug: string } }) {
  const articulo = await getArticuloBySlug(params.slug);
  if (!articulo) notFound();

  const perfumesMencionados =
    articulo.perfumes_relacionados.length > 0
      ? (await getPerfumes()).filter((p) => articulo.perfumes_relacionados.includes(p.id))
      : [];

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 p-6 lg:p-10">
      <div>
        <p className="font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast">
          {CATEGORIA_LABEL[articulo.categoria] ?? articulo.categoria}
        </p>
        <h1 className="mt-2 font-display text-[32px] font-semibold leading-tight text-ink lg:text-[40px]">
          {articulo.titulo}
        </h1>
      </div>

      {articulo.contenido_html ? (
        <article
          className="prose prose-neutral max-w-none font-display text-ink prose-headings:font-display prose-headings:text-ink prose-p:text-ink prose-a:text-gold-contrast"
          dangerouslySetInnerHTML={{ __html: articulo.contenido_html }}
        />
      ) : null}

      {perfumesMencionados.length > 0 ? (
        <div className="border-t border-line pt-6">
          <p className="font-sans text-[11px] uppercase tracking-[.1em] text-muted">
            Perfumes mencionados en este artículo
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {perfumesMencionados.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/perfumes/${p.slug}`}
                  className="rounded-full border border-line px-4 py-2 font-sans text-sm text-ink transition hover:border-gold"
                >
                  {p.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </main>
  );
}
