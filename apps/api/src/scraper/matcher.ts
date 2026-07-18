import { pool } from "../db/pool";
import type { FeedProduct } from "./types";

interface PerfumeCandidate {
  id: number;
  nombre: string;
  marca: string;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Match por marca exacta (normalizada) + solapamiento de tokens del
// nombre — los feeds de afiliados suelen agregar tamaño/concentración al
// nombre del producto ("Sauvage Eau de Parfum 100ml") que el catálogo de
// Aromia no tiene, así que una coincidencia exacta de string no sirve.
export async function matchProductToPerfume(product: FeedProduct): Promise<number | null> {
  const { rows } = await pool.query<PerfumeCandidate>(
    `SELECT id, nombre, marca FROM perfumes WHERE marca ILIKE $1`,
    [`%${product.marca}%`],
  );
  if (rows.length === 0) return null;

  const targetNombre = normalize(product.nombre);
  const targetMarca = normalize(product.marca);

  let best: { id: number; score: number } | null = null;
  for (const row of rows) {
    if (normalize(row.marca) !== targetMarca) continue;

    const rowTokens = normalize(row.nombre).split(" ").filter(Boolean);
    if (rowTokens.length === 0) continue;

    const matchedTokens = rowTokens.filter((t) => targetNombre.includes(t));
    const score = matchedTokens.length / rowTokens.length;

    if (score >= 0.7 && (!best || score > best.score)) {
      best = { id: row.id, score };
    }
  }

  return best?.id ?? null;
}
