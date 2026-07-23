import type { Article } from "@/lib/types";
import { CATEGORIA_LABEL } from "@/lib/magazineCategories";
import { splitHtmlBlocks } from "@/lib/splitHtmlBlocks";

export function PrintableArticle({ article }: { article: Article }) {
  const blocks = splitHtmlBlocks(article.contenido_html);
  const fecha = new Date(article.publicado_en).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="printable-article mx-auto my-6 min-h-[297mm] w-[210mm] max-w-full bg-white p-6 text-[#18140f] shadow-[0_18px_60px_rgba(0,0,0,.16)] sm:p-[22mm_20mm]">
      <section
        className="flex min-h-[242mm] flex-col justify-end border-b border-[#b68a44] pb-8 sm:pb-[20mm]"
        style={{ breakAfter: "always" }}
      >
        <p className="font-sans text-[10pt] uppercase tracking-[.14em] text-[#8d7144]">
          AROMIA · MAGAZINE · {CATEGORIA_LABEL[article.categoria].toUpperCase()}
        </p>
        <h1 className="mt-auto max-w-full font-display text-[28pt] leading-[.97] tracking-[-.02em] sm:max-w-[150mm] sm:text-[48pt]">
          {article.titulo}
        </h1>
        {article.meta_description ? (
          <p className="mt-8 max-w-full font-display text-[13pt] leading-7 text-[#675d52] sm:max-w-[135mm] sm:text-[17pt] sm:leading-8">
            {article.meta_description}
          </p>
        ) : null}
        <div className="mt-14 flex justify-between border-t border-[#b68a44] pt-5 font-sans text-[11px] uppercase tracking-[.1em]">
          <span>{article.autor ?? "Aromia"}</span>
          <span>{fecha}</span>
        </div>
      </section>

      <article className="font-display text-[11pt] leading-[1.65] sm:text-[12pt]">
        {blocks.map((block, i) => (
          <section key={i} dangerouslySetInnerHTML={{ __html: block.html }} />
        ))}
      </article>
    </div>
  );
}
