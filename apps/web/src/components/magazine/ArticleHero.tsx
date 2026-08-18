import type { Article } from "@/lib/types";
import { CATEGORIA_LABEL } from "@/lib/magazineCategories";

export function ArticleHero({ article }: { article: Article }) {
  const hasImage = Boolean(article.imagen_portada_url);

  return (
    <section
      className="relative flex min-h-[500px] items-end overflow-hidden lg:min-h-[620px]"
      style={hasImage ? { backgroundImage: `linear-gradient(105deg,rgba(0,0,0,.14),rgba(0,0,0,.68)), url(${article.imagen_portada_url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      {!hasImage ? <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#d3b47a,#6c4525_45%,#15110d)]" /> : null}
      <div className="mx-auto w-full max-w-[1180px] px-6 pb-14 text-white lg:px-10 lg:pb-20">
        <p className="font-sans text-[11px] uppercase tracking-[.18em] text-[#e0c591]">{CATEGORIA_LABEL[article.categoria]}</p>
        <h1 className="mt-5 max-w-[920px] font-display text-[clamp(44px,6vw,80px)] leading-[.96] tracking-[-.035em]">{article.titulo}</h1>
        {article.meta_description ? <p className="mt-7 max-w-[680px] text-base leading-8 text-white/85 md:text-[18px]">{article.meta_description}</p> : null}
      </div>
    </section>
  );
}
