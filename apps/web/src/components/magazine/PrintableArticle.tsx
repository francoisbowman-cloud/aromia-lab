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
    <div className="printable-article mx-auto my-6 min-h-[297mm] w-[210mm] max-w-full bg-white p-[22mm_20mm] text-[#18140f] shadow-[0_18px_60px_rgba(0,0,0,.16)]">
      <section
        className="flex min-h-[242mm] flex-col justify-end border-b border-[#b68a44] pb-[20mm]"
        style={{ breakAfter: "always" }}
      >
        <p className="font-sans text-[10pt] uppercase tracking-[.14em] text-[#8d7144]">
          AROMIA · MAGAZINE · {CATEGORIA_LABEL[article.categoria].toUpperCase()}
        </p>
        <h1 className="mt-auto max-w-[150mm] font-display text-[48pt] leading-[.97] tracking-[-.02em]">
          {article.titulo}
        </h1>
        {article.meta_description ? (
          <p className="mt-8 max-w-[135mm] font-display text-[17pt] leading-8 text-[#675d52]">
            {article.meta_description}
          </p>
        ) : null}
        <div className="mt-14 flex justify-between border-t border-[#b68a44] pt-5 font-sans text-[11px] uppercase tracking-[.1em]">
          <span>{article.autor ?? "Aromia"}</span>
          <span>{fecha}</span>
        </div>
      </section>

      <article className="font-display text-[12pt] leading-[1.65]">
        {blocks.map((block, i) => (
          <section key={i} dangerouslySetInnerHTML={{ __html: block.html }} />
        ))}
      </article>
    </div>
  );
}
