import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { Pool, type PoolClient } from "pg";

type RawRow = Record<string, string>;

type SourceRow = {
  slug: string;
  name: string;
  brand: string;
  concentration: string | null;
  gender: "masculino" | "femenino" | "unisex";
  family: string | null;
  subfamily: string | null;
  launchYear: number | null;
  perfumer: string | null;
  country: string | null;
  description: string | null;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  accords: string[];
  priceSegment: "económico" | "medio" | "premium" | "lujo" | null;
  sourceUrl: string | null;
  imageUrl: string | null;
  dataConfidence: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  catalogSource: "batch-001" | "batch-002";
  notesStatus: "published" | null;
};

const EXPECTED_BATCH_001 = 25;
const EXPECTED_BATCH_002 = 50;
const EXPECTED_TOTAL = 75;
const VALID_GENDERS = new Set(["masculino", "femenino", "unisex"]);
const VALID_PRICE_SEGMENTS = new Set(["económico", "medio", "premium", "lujo"]);

function clean(value: unknown): string | null {
  const text = String(value ?? "").trim();
  if (!text || text.toLowerCase() === "pending") return null;
  return text;
}

function splitList(value: unknown): string[] {
  const text = clean(value);
  if (!text) return [];
  return text.split(";").map((item) => item.trim()).filter(Boolean);
}

function normalizePriceSegment(value: unknown): SourceRow["priceSegment"] {
  const text = clean(value)?.toLowerCase();
  if (!text) return null;
  const normalized = text === "economico" ? "económico" : text;
  return VALID_PRICE_SEGMENTS.has(normalized) ? (normalized as SourceRow["priceSegment"]) : null;
}

function parseLaunchYear(value: unknown): number | null {
  const text = clean(value);
  if (!text) return null;
  const year = Number(text);
  return Number.isInteger(year) && year >= 1800 && year <= 2100 ? year : null;
}

function readBatch(relativePath: string, catalogSource: SourceRow["catalogSource"]): SourceRow[] {
  const absolutePath = resolve(process.cwd(), relativePath);
  const rows = parse(readFileSync(absolutePath, "utf8"), {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  }) as RawRow[];

  return rows.map((row, index) => {
    const gender = clean(row.gender);
    if (!gender || !VALID_GENDERS.has(gender)) {
      throw new Error(`${catalogSource} row ${index + 2}: invalid gender ${JSON.stringify(row.gender)}`);
    }

    const topNotes = splitList(row.top_notes);
    const middleNotes = splitList(row.middle_notes ?? row.heart_notes);
    const baseNotes = splitList(row.base_notes);
    const accords = splitList(row.accords);
    const hasPublishedNotes = topNotes.length + middleNotes.length + baseNotes.length + accords.length > 0;

    const slug = clean(row.slug);
    const name = clean(row.name);
    const brand = clean(row.brand);
    if (!slug || !name || !brand) {
      throw new Error(`${catalogSource} row ${index + 2}: slug/name/brand are required`);
    }

    return {
      slug,
      name,
      brand,
      concentration: clean(row.concentration),
      gender: gender as SourceRow["gender"],
      family: clean(row.family),
      subfamily: clean(row.subfamily),
      launchYear: parseLaunchYear(row.launch_year),
      perfumer: clean(row.perfumer),
      country: clean(row.country),
      description: clean(row.description),
      topNotes,
      middleNotes,
      baseNotes,
      accords,
      priceSegment: normalizePriceSegment(row.price_segment),
      sourceUrl: clean(row.source_url),
      imageUrl: clean(row.image_url),
      dataConfidence: clean(row.data_confidence),
      seoTitle: clean(row.seo_title),
      seoDescription: clean(row.seo_description),
      catalogSource,
      notesStatus: hasPublishedNotes ? "published" : null,
    };
  });
}

async function ensureSchema(client: PoolClient) {
  await client.query(`
    ALTER TABLE perfumes
      ALTER COLUMN familia_olfativa DROP NOT NULL,
      ALTER COLUMN precio_referencia DROP NOT NULL,
      ALTER COLUMN moneda DROP NOT NULL,
      ALTER COLUMN categoria_precio DROP NOT NULL,
      ALTER COLUMN imagen_url DROP NOT NULL,
      ALTER COLUMN link_afiliado DROP NOT NULL;
  `);

  await client.query(`
    ALTER TABLE perfumes
      ADD COLUMN IF NOT EXISTS source_url TEXT,
      ADD COLUMN IF NOT EXISTS data_confidence TEXT,
      ADD COLUMN IF NOT EXISTS notes_status TEXT,
      ADD COLUMN IF NOT EXISTS catalog_source TEXT,
      ADD COLUMN IF NOT EXISTS accords TEXT[] NOT NULL DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS subfamilia_olfativa TEXT,
      ADD COLUMN IF NOT EXISTS launch_year INTEGER,
      ADD COLUMN IF NOT EXISTS perfumer TEXT,
      ADD COLUMN IF NOT EXISTS country TEXT,
      ADD COLUMN IF NOT EXISTS seo_title TEXT,
      ADD COLUMN IF NOT EXISTS seo_description TEXT;
  `);
}

async function upsertRow(client: PoolClient, row: SourceRow) {
  await client.query(
    `INSERT INTO perfumes (
      slug, nombre, marca, genero, familia_olfativa, concentracion,
      notas_salida, notas_corazon, notas_fondo, accords,
      precio_referencia, moneda, categoria_precio, imagen_url, link_afiliado,
      descripcion_corta, activo, estado, source_url, data_confidence,
      notes_status, catalog_source, subfamilia_olfativa, launch_year,
      perfumer, country, seo_title, seo_description
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
      NULL,NULL,$11,$12,NULL,$13,true,'publicado',$14,$15,
      $16,$17,$18,$19,$20,$21,$22,$23
    )
    ON CONFLICT (slug) DO UPDATE SET
      nombre = EXCLUDED.nombre,
      marca = EXCLUDED.marca,
      genero = EXCLUDED.genero,
      familia_olfativa = COALESCE(EXCLUDED.familia_olfativa, perfumes.familia_olfativa),
      concentracion = COALESCE(EXCLUDED.concentracion, perfumes.concentracion),
      notas_salida = CASE WHEN cardinality(EXCLUDED.notas_salida) > 0 THEN EXCLUDED.notas_salida ELSE perfumes.notas_salida END,
      notas_corazon = CASE WHEN cardinality(EXCLUDED.notas_corazon) > 0 THEN EXCLUDED.notas_corazon ELSE perfumes.notas_corazon END,
      notas_fondo = CASE WHEN cardinality(EXCLUDED.notas_fondo) > 0 THEN EXCLUDED.notas_fondo ELSE perfumes.notas_fondo END,
      accords = CASE WHEN cardinality(EXCLUDED.accords) > 0 THEN EXCLUDED.accords ELSE perfumes.accords END,
      categoria_precio = COALESCE(EXCLUDED.categoria_precio, perfumes.categoria_precio),
      imagen_url = COALESCE(EXCLUDED.imagen_url, perfumes.imagen_url),
      descripcion_corta = COALESCE(EXCLUDED.descripcion_corta, perfumes.descripcion_corta),
      activo = true,
      estado = 'publicado',
      source_url = COALESCE(EXCLUDED.source_url, perfumes.source_url),
      data_confidence = COALESCE(EXCLUDED.data_confidence, perfumes.data_confidence),
      notes_status = COALESCE(EXCLUDED.notes_status, perfumes.notes_status),
      catalog_source = EXCLUDED.catalog_source,
      subfamilia_olfativa = COALESCE(EXCLUDED.subfamilia_olfativa, perfumes.subfamilia_olfativa),
      launch_year = COALESCE(EXCLUDED.launch_year, perfumes.launch_year),
      perfumer = COALESCE(EXCLUDED.perfumer, perfumes.perfumer),
      country = COALESCE(EXCLUDED.country, perfumes.country),
      seo_title = COALESCE(EXCLUDED.seo_title, perfumes.seo_title),
      seo_description = COALESCE(EXCLUDED.seo_description, perfumes.seo_description),
      actualizado_en = now()`,
    [
      row.slug,
      row.name,
      row.brand,
      row.gender,
      row.family,
      row.concentration,
      row.topNotes,
      row.middleNotes,
      row.baseNotes,
      row.accords,
      row.priceSegment,
      row.imageUrl,
      row.description,
      row.sourceUrl,
      row.dataConfidence,
      row.notesStatus,
      row.catalogSource,
      row.subfamily,
      row.launchYear,
      row.perfumer,
      row.country,
      row.seoTitle,
      row.seoDescription,
    ],
  );
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

  const batch001 = readBatch("catalog/staging/batch-001-remediated.normalized.csv", "batch-001");
  const batch002 = readBatch("catalog/staging/batch-002.normalized.csv", "batch-002");

  if (batch001.length !== EXPECTED_BATCH_001) throw new Error(`batch-001 expected ${EXPECTED_BATCH_001}, got ${batch001.length}`);
  if (batch002.length !== EXPECTED_BATCH_002) throw new Error(`batch-002 expected ${EXPECTED_BATCH_002}, got ${batch002.length}`);

  const sourceRows = [...batch001, ...batch002];
  if (sourceRows.length !== EXPECTED_TOTAL) throw new Error(`expected ${EXPECTED_TOTAL} rows, got ${sourceRows.length}`);

  const slugs = sourceRows.map((row) => row.slug);
  const uniqueSlugs = new Set(slugs);
  if (uniqueSlugs.size !== EXPECTED_TOTAL) {
    const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
    throw new Error(`duplicate source slugs: ${[...new Set(duplicates)].join(", ")}`);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    const beforeTotal = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes")).rows[0].n);
    const beforePublished = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes WHERE activo=true AND estado='publicado'")).rows[0].n);
    const existingRows = await client.query<{ slug: string }>("SELECT slug FROM perfumes WHERE slug = ANY($1::text[])", [slugs]);
    const existing = new Set(existingRows.rows.map((row) => row.slug));

    console.log(JSON.stringify({ phase: "preflight", beforeTotal, beforePublished, sourceRows: sourceRows.length, sourceDistinctSlugs: uniqueSlugs.size, alreadyExisting: existing.size }, null, 2));

    await client.query("BEGIN");
    await ensureSchema(client);
    for (const row of sourceRows) await upsertRow(client, row);

    const targetCount = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes WHERE slug = ANY($1::text[])", [slugs])).rows[0].n);
    if (targetCount !== EXPECTED_TOTAL) throw new Error(`post-upsert target count expected ${EXPECTED_TOTAL}, got ${targetCount}`);

    await client.query("COMMIT");

    const afterTotal = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes")).rows[0].n);
    const afterPublished = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes WHERE activo=true AND estado='publicado'")).rows[0].n);
    const bySource = (await client.query("SELECT catalog_source, COUNT(*)::int AS count FROM perfumes WHERE catalog_source IN ('batch-001','batch-002') GROUP BY catalog_source ORDER BY catalog_source")).rows;
    const representative = (await client.query(
      `SELECT slug, activo, estado, catalog_source FROM perfumes
       WHERE slug IN ('chanel-no5-edp','eros-parfum') OR catalog_source='batch-002'
       ORDER BY catalog_source, slug LIMIT 7`,
    )).rows;

    console.log(JSON.stringify({
      phase: "committed",
      inserted: EXPECTED_TOTAL - existing.size,
      updated: existing.size,
      afterTotal,
      afterPublished,
      bySource,
      representative,
    }, null, 2));
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch {}
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("CATALOG_IMPORT_FAILED", error);
  process.exit(1);
});
