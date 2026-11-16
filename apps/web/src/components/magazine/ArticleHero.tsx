import Image from "next/image";
import type { Article } from "@/lib/types";
import { CATEGORIA_LABEL } from "@/lib/magazineCategories";

export function ArticleHero({ article }: { article: Article }) {
  return <header className="ed-article-hero">
    <p className="ed-label">{CATEGORIA_LABEL[article.categoria]}</p>
    <h1>{article.titulo}</h1>
    {article.meta_description && <p>{article.meta_description}</p>}
    {article.imagen_portada_url && <div className="ed-article-photo"><Image src={article.imagen_portada_url} alt={article.titulo} fill priority sizes="(max-width: 700px) 100vw, 90vw" unoptimized={/^https?:/.test(article.imagen_portada_url)} style={{objectFit:"contain"}} /></div>}
  </header>;
}
