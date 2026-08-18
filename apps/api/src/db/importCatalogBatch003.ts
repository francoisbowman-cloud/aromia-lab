import "dotenv/config";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { Pool, type PoolClient } from "pg";

type RawRow = Record<string, string>;

type SourceRow = {
  slug: string;
  name: string;
  brand: string;
  concentration: string;
  gender: "masculino" | "femenino" | "unisex";
  family: string | null;
  launchYear: number | null;
  perfumer: string | null;
  country: string | null;
  description: string | null;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  accords: string[];
  sourceUrl: string;
  imageUrl: string | null;
  dataConfidence: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

const BATCH_PATH = "catalog/imports/batch-003.csv";
const EXPECTED_ROWS = 10;
const EXPECTED_SHA256 = "e97833db0a7555c67cd7a84342fdca844efc1ae876fcdeabfa4512611a2ad32b";
const CATALOG_SOURCE = "batch-003";
const VALID_GENDERS = new Set(["masculino", "femenino", "unisex"]);

function clean(value: unknown): string | null {
  const text = String(value ?? "").trim();
  if (!text || ["pending", "null", "undefined", "n/a"].includes(text.toLowerCase())) return null;
  return text;
}

function splitList(value: unknown): string[] {
  const text = clean(value);
  return text ? text.split(";").map((item) => item.trim()).filter(Boolean) : [];
}

function parseYear(value: unknown): number | null {
  const text = clean(value);
  if (!text) return null;
  const year = Number(text);
  if (!Number.isInteger(year) || year < 1800 || year > 2100) throw new Error(`invalid launch year: ${text}`);
  return year;
}

function loadBatch(): SourceRow[] {
  const path = resolve(process.cwd(), BATCH_PATH);
  const bytes = readFileSync(path);
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== EXPECTED_SHA256) {
    throw new Error(`batch-003 artifact hash mismatch: expected ${EXPECTED_SHA256}, got ${digest}`);
  }

  const rawRows = parse(bytes.toString("utf8"), {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: false,
    trim: true,
  }) as RawRow[];

  if (rawRows.length !== EXPECTED_ROWS) throw new Error(`batch-003 expected ${EXPECTED_ROWS} rows, got ${rawRows.length}`);

  const rows = rawRows.map((row, index) => {
    const label = `batch-003 row ${index + 2}`;
    const slug = clean(row.slug);
    const name = clean(row.name);
    const brand = clean(row.brand);
    const concentration = clean(row.concentration);
    const gender = clean(row.gender);
    const sourceUrl = clean(row.source_url);
    const confidence = clean(row.data_confidence);

    if (!slug || !name || !brand || !concentration || !gender || !sourceUrl || !confidence) {
      throw new Error(`${label}: slug/name/brand/concentration/gender/source_url/data_confidence are required`);
    }
    if (!VALID_GENDERS.has(gender)) throw new Error(`${label}: invalid gender ${gender}`);
    if (row.quality_status !== "AUTO_READY") throw new Error(`${label}: quality_status must be AUTO_READY`);
    if (String(row.source_verified).toLowerCase() !== "true") throw new Error(`${label}: source_verified must be true`);
    if (row.catalog_relation !== "NEW") throw new Error(`${label}: catalog_relation must be NEW`);

    const topNotes = splitList(row.top_notes);
    const middleNotes = splitList(row.middle_notes);
    const baseNotes = splitList(row.base_notes);
    if (!topNotes.length || !middleNotes.length || !baseNotes.length) {
      throw new Error(`${label}: complete top/middle/base note pyramid is required`);
    }

    return {
      slug,
      name,
      brand,
      concentration,
      gender: gender as SourceRow["gender"],
      family: clean(row.family),
      launchYear: parseYear(row.launch_year),
      perfumer: clean(row.perfumer),
      country: clean(row.country),
      description: clean(row.description),
      topNotes,
      middleNotes,
      baseNotes,
      accords: splitList(row.accords),
      sourceUrl,
      imageUrl: clean(row.image_url),
      dataConfidence: confidence,
      seoTitle: clean(row.seo_title),
      seoDescription: clean(row.seo_description),
    };
  });

  const slugs = rows.map((row) => row.slug);
  if (new Set(slugs).size !== EXPECTED_ROWS) throw new Error("batch-003 contains duplicate slugs");
  return rows;
}

async function insertRow(client: PoolClient, row: SourceRow) {
  await client.query(
    `INSERT INTO perfumes (
      slug, nombre, marca, genero, familia_olfativa, concentracion,
      notas_salida, notas_corazon, notas_fondo, accords,
      precio_referencia, moneda, categoria_precio, imagen_url, link_afiliado,
      descripcion_corta, activo, estado, source_url, data_confidence,
      notes_status, catalog_source, launch_year, perfumer, country,
      seo_title, seo_description
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
      NULL,NULL,NULL,$11,NULL,$12,true,'publicado',$13,$14,
      'published',$15,$16,$17,$18,$19,$20
    )`,
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
      row.imageUrl,
      row.description,
      row.sourceUrl,
      row.dataConfidence,
      CATALOG_SOURCE,
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
  const rows = loadBatch();
  const slugs = rows.map((row) => row.slug);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    const beforeTotal = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes")).rows[0].n);
    const beforePublished = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes WHERE activo=true AND estado='publicado'")).rows[0].n);
    const existing = await client.query<{ slug: string }>("SELECT slug FROM perfumes WHERE slug = ANY($1::text[])", [slugs]);

    console.log(JSON.stringify({
      phase: "preflight",
      artifactSha256: EXPECTED_SHA256,
      expectedRows: EXPECTED_ROWS,
      beforeTotal,
      beforePublished,
      alreadyExisting: existing.rows.map((row) => row.slug),
      productionWriteStarted: false,
    }, null, 2));

    if (existing.rowCount !== 0) {
      throw new Error(`batch-003 preflight refused: ${existing.rowCount} target slug(s) already exist`);
    }

    await client.query("BEGIN");
    for (const row of rows) await insertRow(client, row);

    const target = await client.query<{ slug: string; catalog_source: string }>(
      "SELECT slug, catalog_source FROM perfumes WHERE slug = ANY($1::text[]) ORDER BY slug",
      [slugs],
    );
    if (target.rowCount !== EXPECTED_ROWS || target.rows.some((row) => row.catalog_source !== CATALOG_SOURCE)) {
      throw new Error(`batch-003 transactional verification failed: expected ${EXPECTED_ROWS} batch-003 rows, got ${target.rowCount}`);
    }

    await client.query("COMMIT");

    const afterTotal = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes")).rows[0].n);
    const afterPublished = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes WHERE activo=true AND estado='publicado'")).rows[0].n);
    if (afterTotal !== beforeTotal + EXPECTED_ROWS || afterPublished !== beforePublished + EXPECTED_ROWS) {
      throw new Error(`batch-003 post-commit count mismatch: total ${beforeTotal}->${afterTotal}, published ${beforePublished}->${afterPublished}`);
    }

    console.log(JSON.stringify({
      phase: "committed",
      inserted: EXPECTED_ROWS,
      beforeTotal,
      afterTotal,
      beforePublished,
      afterPublished,
      catalogSource: CATALOG_SOURCE,
      artifactSha256: EXPECTED_SHA256,
      slugs: target.rows.map((row) => row.slug),
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
  console.error("CATALOG_BATCH_003_IMPORT_FAILED", error);
  process.exit(1);
});
