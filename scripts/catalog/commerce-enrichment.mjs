export function buildAmazonSearchUrl({ brand, name, concentration, associateTag = "" }) {
  const q = [brand, name, concentration, "perfume"].filter(Boolean).join(" ").trim();
  if (!q) return "";
  const params = new URLSearchParams({ k: q });
  if (associateTag) params.set("tag", associateTag);
  return `https://www.amazon.com/s?${params.toString()}`;
}

export function affiliateStatus(associateTag) {
  return String(associateTag ?? "").trim() ? "active" : "pending";
}

export function publicationMetadata(row, { associateTag = process.env.AROMIA_AMAZON_ASSOCIATE_TAG || "" } = {}) {
  const brand = String(row.brand ?? "").trim();
  const name = String(row.name ?? "").trim();
  const concentration = String(row.concentration ?? "").trim();
  const description = String(row.description ?? row.page_description ?? "").trim();
  const seoTitle = String(row.seo_title ?? row.page_title ?? `${brand} ${name} ${concentration}`).trim();
  const seoDescription = String(row.seo_description ?? description).trim().slice(0, 180);
  const imageUrl = String(row.image_url ?? "").trim();
  return {
    description,
    seo_title: seoTitle,
    seo_description: seoDescription,
    image_url: imageUrl,
    image_source: String(row.image_source ?? row.source_url ?? "").trim(),
    amazon_url: buildAmazonSearchUrl({ brand, name, concentration, associateTag }),
    affiliate_status: affiliateStatus(associateTag),
    visual_quality: imageUrl ? "medium" : "not-audited",
  };
}

export function publicationGaps(row) {
  const required = ["description", "seo_title", "seo_description", "image_url", "image_source", "amazon_url"];
  return required.filter((field) => !String(row[field] ?? "").trim());
}
