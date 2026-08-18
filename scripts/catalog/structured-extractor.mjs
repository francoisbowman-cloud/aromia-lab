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

function imageFromProduct(product) {
  const image = product?.image;
  if (typeof image === "string") return image;
  if (Array.isArray(image)) {
    for (const item of image) {
      if (typeof item === "string") return item;
      if (item?.url) return item.url;
      if (item?.contentUrl) return item.contentUrl;
    }
  }
  if (image?.url) return image.url;
  if (image?.contentUrl) return image.contentUrl;
  return "";
}

function explicitTier(text, labels, nextLabels) {
  const start = labels.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const next = nextLabels.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const re = new RegExp(`(?:${start})\\s*(?:notes?|noten|notas?)?\\s*[:\\-–—]?\\s*(.{1,220}?)(?=(?:${next})\\s*(?:notes?|noten|notas?)?\\s*[:\\-–—]?|$)`, "i");
  const m = text.match(re);
  return m ? cleanListText(m[1]) : "";
}

export function extractExplicitNotes(html) {
  const text = stripHtml(html);
  const topLabels = ["top", "head", "opening", "notes de tête", "note de tête", "notas de salida", "nota de salida", "note di testa", "kopfnote", "kopfnoten"];
  const heartLabels = ["heart", "middle", "notes de cœur", "note de cœur", "notes de coeur", "note de coeur", "notas de corazón", "nota de corazón", "notas de corazon", "nota de corazon", "note di cuore", "herznote", "herznoten"];
  const baseLabels = ["base", "dry down", "drydown", "notes de fond", "note de fond", "notas de fondo", "nota de fondo", "note di fondo", "basisnote", "basisnoten"];
  const terminalLabels = ["ingredients", "ingrédients", "ingredientes", "ingredienti", "details", "détails", "detalles", "size", "taille", "how to use"];
  const top = explicitTier(text, topLabels, [...heartLabels, ...baseLabels]);
  const middle = explicitTier(text, heartLabels, baseLabels);
  const base = explicitTier(text, baseLabels, terminalLabels);
  if (top || middle || base) return { structure: [top,middle,base].every(Boolean) ? "PYRAMID" : "PARTIAL", top_notes: top, middle_notes: middle, base_notes: base, accords: "" };
  const flatPatterns = [
    /(?:key\s+notes|fragrance\s+notes|olfactive\s+notes|olfactory\s+notes|notes olfactives|notes clés|notas olfativas|notas clave|note olfattive|duftnoten|notes)\s*[:\-–—]\s*(.{3,220}?)(?=(?:ingredients|ingrédients|ingredientes|ingredienti|details|détails|detalles|size|taille|how to use|$))/i,
  ];
  for (const re of flatPatterns) { const m = text.match(re); if (m) return { structure: "FLAT", top_notes: "", middle_notes: "", base_notes: "", accords: cleanListText(m[1]) }; }
  return { structure: "UNKNOWN", top_notes: "", middle_notes: "", base_notes: "", accords: "" };
}

function concentrationFrom(text) {
  const normalized = decodeURIComponent(String(text ?? "")).replace(/[_+\-/]+/g, " ");
  const patterns = [
    ["Extrait", /\b(extrait(?: de parfum)?|perfume extract)\b/i],
    ["Elixir", /\belixir\b/i],
    ["EDP", /\b(eau de parfum|edp)\b/i],
    ["EDT", /\b(eau de toilette|edt)\b/i],
    ["EDC", /\b(eau de cologne|edc)\b/i],
    ["Parfum", /\bparfum\b/i],
  ];
  for (const [value, re] of patterns) if (re.test(normalized)) return value;
  return "";
}

function audienceFromProduct(product) {
  const audience = product?.audience;
  const raw = typeof audience === "string"
    ? audience
    : Array.isArray(audience)
      ? audience.map((x) => typeof x === "string" ? x : x?.audienceType ?? x?.name ?? "").join(" ")
      : audience?.audienceType ?? audience?.name ?? "";
  return String(raw ?? "");
}

function genderFromExplicitAudience(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return "";
  if (/^(unisex|all genders|gender neutral|gender-neutral)$/.test(normalized)) return "unisex";
  if (/^(men|man|male|homme|hombre|uomo|masculin|masculino)$/.test(normalized)) return "masculino";
  if (/^(women|woman|female|femme|mujer|donna|féminin|feminin|femenino)$/.test(normalized)) return "femenino";
  return "";
}

export function extractExplicitMetadata(html, url = "", product = null) {
  const text = stripHtml(html);
  const title = extractMeta(html, "og:title");
  const description = extractMeta(html, "og:description");
  const jsonAudience = audienceFromProduct(product);
  const jsonCategory = typeof product?.category === "string" ? product.category : "";
  const primary = `${url} ${title} ${description} ${jsonAudience} ${jsonCategory}`;
  const searchable = `${primary} ${text.slice(0, 12000)}`;
  let gender = genderFromExplicitAudience(jsonAudience);
  if (!gender) {
    const men = /\b(for|pour|para)\s+(men|him|homme|hombre|uomo)|\bmens?\s+(fragrance|perfume|parfum)|\bhomme\b|\bmasculin\b|\bmasculino\b|\buomo\b|\/men(?:\/|-|$)/i.test(searchable);
    const women = /\b(for|pour|para)\s+(women|her|femme|mujer|donna)|\bwomens?\s+(fragrance|perfume|parfum)|\bfemme\b|\bféminin\b|\bfeminin\b|\bfemenino\b|\bdonna\b|\/women(?:\/|-|$)/i.test(searchable);
    const unisex = /\bunisex\b|gender[- ]?neutral|sans genre|senza genere/i.test(searchable);
    if (unisex || (men && women)) gender = "unisex";
    else if (men) gender = "masculino";
    else if (women) gender = "femenino";
  }

  const concentration = concentrationFrom(primary) || concentrationFrom(text.slice(0, 2500));
  const yearMatch = searchable.match(/\b(?:launched|introduced|created|released|since|lancé|lance|créé|cree|lanzado|creado|lanciato|creato)\s+(?:in|en|nel|in\s+the\s+year)?\s*((?:19|20)\d{2})\b/i);
  const launch_year = yearMatch?.[1] ?? "";
  const perfumerMatch = searchable.match(/\b(?:perfumer|nose|parfumeur|perfumista|naso)\s*[:\-–—]\s*([A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\s+[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){1,4})/);
  const perfumer = perfumerMatch?.[1] ?? "";
  const familyMatch = searchable.match(/\b(?:olfactive|olfactory|fragrance|famille olfactive|familia olfativa|famiglia olfattiva)\s*(?:family|famille|familia|famiglia)?\s*[:\-–—]\s*([^.;|]{3,80})/i);
  const family = cleanListText(familyMatch?.[1] ?? "");
  return { gender, concentration, launch_year, perfumer, family };
}

export function extractPageEvidence(html, url) {
  const product = productJsonLd(html);
  const title = extractMeta(html, "og:title") || product?.name || "";
  const description = extractMeta(html, "og:description") || product?.description || "";
  const brand = typeof product?.brand === "string" ? product.brand : product?.brand?.name ?? "";
  const imageUrl = extractMeta(html, "og:image") || imageFromProduct(product);
  const notes = extractExplicitNotes(html);
  const metadata = extractExplicitMetadata(html, url, product);
  return {
    source_url: url,
    title: cleanListText(title),
    description: cleanListText(stripHtml(description)),
    image_url: cleanListText(imageUrl),
    image_source: imageUrl ? url : "",
    seo_title: cleanListText(title),
    seo_description: cleanListText(stripHtml(description)),
    structured_product_name: cleanListText(product?.name ?? ""),
    structured_brand: cleanListText(brand),
    notes_structure: notes.structure,
    ...notes,
    ...metadata,
    evidence_method: product ? "official_html+jsonld" : "official_html",
  };
}
