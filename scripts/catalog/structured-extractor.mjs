function decodeEntities(text) {
  return String(text ?? "")
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

export function stripHtml(html) {
  return decodeEntities(String(html ?? "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ").trim();
}

export function extractMeta(html, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i"),
  ];
  for (const re of patterns) { const m = String(html ?? "").match(re); if (m) return decodeEntities(m[1]).trim(); }
  return "";
}

export function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(String(html ?? ""))) !== null) {
    try {
      const parsed = JSON.parse(decodeEntities(m[1]).trim());
      if (Array.isArray(parsed)) blocks.push(...parsed); else blocks.push(parsed);
    } catch {}
  }
  const flattened = [];
  for (const item of blocks) {
    if (item && Array.isArray(item["@graph"])) flattened.push(...item["@graph"]);
    else flattened.push(item);
  }
  return flattened.filter(Boolean);
}

export function productJsonLd(html) {
  return extractJsonLd(html).find((x) => {
    const type = x?.["@type"];
    return type === "Product" || (Array.isArray(type) && type.includes("Product"));
  }) ?? null;
}

function cleanListText(value) {
  return String(value ?? "").replace(/\s+/g, " ").replace(/^[\s:–—-]+|[\s.;]+$/g, "").trim();
}

function explicitTier(text, labels, nextLabels) {
  const start = labels.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const next = nextLabels.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const re = new RegExp(`(?:${start})\\s*(?:notes?)?\\s*[:\\-–—]?\\s*(.{1,220}?)(?=(?:${next})\\s*(?:notes?)?\\s*[:\\-–—]?|$)`, "i");
  const m = text.match(re);
  return m ? cleanListText(m[1]) : "";
}

export function extractExplicitNotes(html) {
  const text = stripHtml(html);
  const top = explicitTier(text, ["top", "head", "opening"], ["heart", "middle", "base", "dry down", "drydown"]);
  const middle = explicitTier(text, ["heart", "middle"], ["base", "dry down", "drydown"]);
  const base = explicitTier(text, ["base", "dry down", "drydown"], ["ingredients", "details", "size", "how to use"]);
  if (top || middle || base) return { structure: [top,middle,base].every(Boolean) ? "PYRAMID" : "PARTIAL", top_notes: top, middle_notes: middle, base_notes: base, accords: "" };
  const flatPatterns = [/(?:key\s+notes|fragrance\s+notes|olfactive\s+notes|olfactory\s+notes|notes)\s*[:\-–—]\s*(.{3,220}?)(?=(?:ingredients|details|size|how to use|$))/i];
  for (const re of flatPatterns) { const m = text.match(re); if (m) return { structure: "FLAT", top_notes: "", middle_notes: "", base_notes: "", accords: cleanListText(m[1]) }; }
  return { structure: "UNKNOWN", top_notes: "", middle_notes: "", base_notes: "", accords: "" };
}

export function extractExplicitMetadata(html, url = "") {
  const text = stripHtml(html);
  const searchable = `${url} ${extractMeta(html, "og:title")} ${extractMeta(html, "og:description")} ${text.slice(0, 12000)}`;
  let gender = "";
  const men = /\b(for|pour)\s+(men|him|homme)|\bmens?\s+(fragrance|perfume|parfum)|\/men(?:\/|-|$)/i.test(searchable);
  const women = /\b(for|pour)\s+(women|her|femme)|\bwomens?\s+(fragrance|perfume|parfum)|\/women(?:\/|-|$)/i.test(searchable);
  const unisex = /\bunisex\b|gender[- ]?neutral/i.test(searchable);
  if (unisex || (men && women)) gender = "unisex";
  else if (men) gender = "masculino";
  else if (women) gender = "femenino";

  let concentration = "";
  const concentrationPatterns = [
    ["Extrait", /\b(extrait(?: de parfum)?|perfume extract)\b/i],
    ["Elixir", /\belixir\b/i],
    ["Parfum", /\bparfum\b/i],
    ["EDP", /\b(eau de parfum|edp)\b/i],
    ["EDT", /\b(eau de toilette|edt)\b/i],
    ["EDC", /\b(eau de cologne|edc)\b/i],
  ];
  for (const [value, re] of concentrationPatterns) { if (re.test(searchable)) { concentration = value; break; } }

  const yearMatch = searchable.match(/\b(?:launched|introduced|created|released|since)\s+(?:in\s+)?((?:19|20)\d{2})\b/i);
  const launch_year = yearMatch?.[1] ?? "";
  const perfumerMatch = searchable.match(/\b(?:perfumer|perfume[r]?|nose)\s*[:\-–—]\s*([A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\s+[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){1,4})/);
  const perfumer = perfumerMatch?.[1] ?? "";
  const familyMatch = searchable.match(/\b(?:olfactive|olfactory|fragrance)\s+family\s*[:\-–—]\s*([^.;|]{3,80})/i);
  const family = cleanListText(familyMatch?.[1] ?? "");
  return { gender, concentration, launch_year, perfumer, family };
}

export function extractPageEvidence(html, url) {
  const product = productJsonLd(html);
  const title = extractMeta(html, "og:title") || product?.name || "";
  const description = extractMeta(html, "og:description") || product?.description || "";
  const brand = typeof product?.brand === "string" ? product.brand : product?.brand?.name ?? "";
  const notes = extractExplicitNotes(html);
  const metadata = extractExplicitMetadata(html, url);
  return {
    source_url: url,
    title: cleanListText(title),
    description: cleanListText(stripHtml(description)),
    structured_product_name: cleanListText(product?.name ?? ""),
    structured_brand: cleanListText(brand),
    notes_structure: notes.structure,
    ...notes,
    ...metadata,
    evidence_method: product ? "official_html+jsonld" : "official_html",
  };
}
