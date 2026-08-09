import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { Pool, type PoolClient } from "pg";

type RawRow = Record<string, string>;

const EXPECTED_ROWS = 75;
const CSV_PATH = "catalog/expansion/published-enrichment/published-75-enriched.csv";

function clean(value: unknown): string | null {
  const text = String(value ?? "").trim();
  if (!text || ["pending", "not-audited", "no-applicable"].includes(text.toLowerCase())) return null;
  return text;
}

function splitList(value: unknown): string[] {
  const text = clean(value);
  return text ? text.split(";").map((x) => x.trim()).filter(Boolean) : [];
}

function readRows(): RawRow[] {
  const path = resolve(process.cwd(), CSV_PATH);
  return parse(readFileSync(path, "utf8"), { columns: true, skip_empty_lines: true, relax_column_count: true }) as RawRow[];
}

async function ensureColumns(client: PoolClient) {
  await client.query(`
    ALTER TABLE perfumes
      ADD COLUMN IF NOT EXISTS amazon_url TEXT,
      ADD COLUMN IF NOT EXISTS image_source TEXT,
      ADD COLUMN IF NOT EXISTS affiliate_status TEXT,
      ADD COLUMN IF NOT EXISTS visual_quality TEXT;
  `);
}

async function updateRow(client: PoolClient, row: RawRow) {
  const slug = clean(row.slug);
  if (!slug) throw new Error("row without slug");

  const top = splitList(row.top_notes);
  const middle = splitList(row.middle_notes ?? row.heart_notes);
  const base = splitList(row.base_notes);
  const accords = splitList(row.accords);

  const result = await client.query(
    `UPDATE perfumes SET
      descripcion_corta = COALESCE(NULLIF(descripcion_corta, ''), $2),
      genero = COALESCE(NULLIF(genero, ''), $3),
      familia_olfativa = COALESCE(NULLIF(familia_olfativa, ''), $4),
      subfamilia_olfativa = COALESCE(NULLIF(subfamilia_olfativa, ''), $5),
      concentracion = COALESCE(NULLIF(concentracion, ''), $6),
      launch_year = COALESCE(launch_year, $7),
      perfumer = COALESCE(NULLIF(perfumer, ''), $8),
      country = COALESCE(NULLIF(country, ''), $9),
      notas_salida = CASE WHEN COALESCE(cardinality(notas_salida), 0) = 0 AND cardinality($10::text[]) > 0 THEN $10::text[] ELSE notas_salida END,
      notas_corazon = CASE WHEN COALESCE(cardinality(notas_corazon), 0) = 0 AND cardinality($11::text[]) > 0 THEN $11::text[] ELSE notas_corazon END,
      notas_fondo = CASE WHEN COALESCE(cardinality(notas_fondo), 0) = 0 AND cardinality($12::text[]) > 0 THEN $12::text[] ELSE notas_fondo END,
      accords = CASE WHEN COALESCE(cardinality(accords), 0) = 0 AND cardinality($13::text[]) > 0 THEN $13::text[] ELSE accords END,
      imagen_url = COALESCE(NULLIF(imagen_url, ''), $14),
      image_source = COALESCE(NULLIF(image_source, ''), $15),
      amazon_url = COALESCE(NULLIF(amazon_url, ''), $16),
      affiliate_status = COALESCE(NULLIF(affiliate_status, ''), $17),
      visual_quality = COALESCE(NULLIF(visual_quality, ''), $18),
      seo_title = COALESCE(NULLIF(seo_title, ''), $19),
      seo_description = COALESCE(NULLIF(seo_description, ''), $20),
      source_url = COALESCE(NULLIF(source_url, ''), $21),
      actualizado_en = now()
    WHERE slug = $1`,
    [
      slug,
      clean(row.description), clean(row.gender), clean(row.family), clean(row.subfamily), clean(row.concentration),
      clean(row.launch_year) ? Number(row.launch_year) : null,
      clean(row.perfumer), clean(row.country), top, middle, base, accords,
      clean(row.image_url), clean(row.image_source), clean(row.amazon_url), clean(row.affiliate_status), clean(row.visual_quality),
      clean(row.seo_title), clean(row.seo_description), clean(row.source_url),
    ],
  );
  if (result.rowCount !== 1) throw new Error(`slug not updated exactly once: ${slug}`);
}

async function coverage(client: PoolClient, slugs: string[]) {
  return (await client.query(`
    SELECT
      COUNT(*) FILTER (WHERE slug = ANY($1::text[]) AND imagen_url IS NOT NULL AND imagen_url <> '')::int AS images,
      COUNT(*) FILTER (WHERE slug = ANY($1::text[]) AND amazon_url IS NOT NULL AND amazon_url <> '')::int AS amazon_links,
      COUNT(*) FILTER (WHERE slug = ANY($1::text[]) AND descripcion_corta IS NOT NULL AND descripcion_corta <> '')::int AS descriptions,
      COUNT(*) FILTER (WHERE slug = ANY($1::text[]) AND seo_title IS NOT NULL AND seo_title <> '')::int AS seo_titles,
      COUNT(*) FILTER (WHERE slug = ANY($1::text[]) AND seo_description IS NOT NULL AND seo_description <> '')::int AS seo_descriptions
    FROM perfumes`, [slugs])).rows[0];
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const rows = readRows();
  if (rows.length !== EXPECTED_ROWS) throw new Error(`expected ${EXPECTED_ROWS} rows, got ${rows.length}`);
  const slugs = rows.map((r) => clean(r.slug)).filter(Boolean) as string[];
  if (new Set(slugs).size !== EXPECTED_ROWS) throw new Error("published enrichment contains duplicate slugs");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await ensureColumns(client);

    const existing = await client.query("SELECT slug FROM perfumes WHERE slug = ANY($1::text[])", [slugs]);
    if (existing.rowCount !== EXPECTED_ROWS) throw new Error(`expected all ${EXPECTED_ROWS} published slugs to exist, got ${existing.rowCount}`);

    const before = await coverage(client, slugs);
    console.log(JSON.stringify({ phase: "preflight", target_rows: EXPECTED_ROWS, existing: existing.rowCount, before }, null, 2));

    for (const row of rows) await updateRow(client, row);

    const after = await coverage(client, slugs);
    if (Number(after.images) < Number(before.images)) throw new Error("image coverage regressed");
    if (Number(after.descriptions) < Number(before.descriptions)) throw new Error("description coverage regressed");
    if (Number(after.seo_titles) < Number(before.seo_titles)) throw new Error("SEO title coverage regressed");
    if (Number(after.seo_descriptions) < Number(before.seo_descriptions)) throw new Error("SEO description coverage regressed");

    await client.query("COMMIT");
    console.log(JSON.stringify({ phase: "committed", after }, null, 2));
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch {}
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("PUBLISHED_ENRICHMENT_UPDATE_FAILED", error);
  process.exit(1);
});
