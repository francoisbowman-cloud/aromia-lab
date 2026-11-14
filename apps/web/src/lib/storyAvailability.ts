import { notFound } from "next/navigation";
import { getArticuloBySlug } from "./api";
import type { SubBatch01Slug } from "./subBatch01Slugs";

export async function getStoryMarkdown(slug: SubBatch01Slug): Promise<string> {
  const article = await getArticuloBySlug(slug, { throwOnUnavailable: true });
  if (!article?.contenido_markdown) notFound();
  return article.contenido_markdown;
}
