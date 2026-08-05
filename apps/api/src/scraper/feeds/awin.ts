import { parse } from "csv-parse/sync";
import type { FeedProduct } from "../types";

// Datafeed CSV estándar de Awin (Douglas, Primor) — documentado en
// https://developer.awin.com/apidocs/product-data-feeds. Columnas usadas:
// brand_name, product_name, search_price, currency, aw_deep_link,
// merchant_image_url. Sin credenciales reales todavía para validar contra
// un feed real — el parseo en sí (formato CSV documentado) tiene
// confianza alta, la URL de descarga exacta hay que confirmarla cuando
// Brey tenga el token de Awin.
export async function fetchAwinFeed(merchantId: string, apiToken: string): Promise<FeedProduct[]> {
  const url = `https://productdata.awin.com/datafeed/download/apikey/${apiToken}/language/es/fid/${merchantId}/format/csv/delimiter/%2C/compression/none/`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Feed de Awin respondió ${res.status} para merchant ${merchantId}`);
  }

  const csv = await res.text();
  const rows: Record<string, string>[] = parse(csv, {
    columns: true,
    skip_empty_lines: true,
  });

  return rows
    .map((row) => ({
      marca: row.brand_name ?? "",
      nombre: row.product_name ?? "",
      precio: Number(row.search_price) || 0,
      moneda: row.currency || "EUR",
      link: row.aw_deep_link ?? "",
      imagenUrl: row.merchant_image_url || undefined,
    }))
    .filter((p) => p.marca && p.nombre && p.precio > 0 && p.link);
}
