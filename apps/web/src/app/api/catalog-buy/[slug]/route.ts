import { getPerfumeBySlug } from "@/lib/api";
import { affiliateAmazonUrl, resolveAmazonCatalogProduct } from "@/lib/amazonCatalog.server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const perfume = await getPerfumeBySlug(params.slug);
  if (!perfume) return new Response("Not found", { status: 404 });

  const resolved = await resolveAmazonCatalogProduct(perfume);
  const fallback = affiliateAmazonUrl(perfume.link_afiliado) ?? affiliateAmazonUrl(perfume.amazon_url);
  const target = resolved?.productUrl ?? fallback;
  if (!target) return new Response("Amazon destination unavailable", { status: 404 });

  return Response.redirect(target, 302);
}
