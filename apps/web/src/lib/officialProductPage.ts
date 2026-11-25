export function officialProductPage(slug: string, concentration?: string | null) {
  if (slug === "black-afgano") return "https://nasomatto.com/es/products/black-afgano";
  if (slug === "acqua-di-gio-edt") return "https://www.giorgioarmanibeauty-usa.com/fragrances/mens-cologne/acqua-di-gio/acqua-di-gio-eau-de-toilette/A005.html?geo=false";
  if (slug === "chance-eau-tendre") {
    const variant = String(concentration ?? "").trim().toLowerCase();
    if (variant === "edt" || variant === "eau de toilette")
      return "https://www.chanel.com/us/fragrance/p/126320/chance-eau-tendre-eau-de-toilette-spray/";
    if (variant === "edp" || variant === "eau de parfum")
      return "https://www.chanel.com/us/fragrance/p/126260/chance-eau-tendre-eau-de-parfum-spray/";
    return null; // Unknown concentration is not evidence for the EDP bottle.
  }
  return null;
}

