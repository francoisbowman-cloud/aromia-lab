import "dotenv/config";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { Pool } from "pg";

type RawRow = Record<string, string>;

const BATCH_PATH = resolve(process.cwd(), "catalog/imports/batch-003.csv");
const EXPECTED_SHA256 = "e97833db0a7555c67cd7a84342fdca844efc1ae876fcdeabfa4512611a2ad32b";
const EXPECTED_ROWS = 10;
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

function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");

  const raw = readFileSync(BATCH_PATH);
  const digest = sha256(raw);
  if (digest !== EXPECTED_SHA256) throw new Error(`batch-003 artifact hash mismatch: ${digest}`);

  const rows = parse(raw, { columns: true, skip_empty_lines: true, trim: true }) as RawRow[];
  if (rows.length !== EXPECTED_ROWS) throw new Error(`batch-003 expected ${EXPECTED_ROWS} rows, got ${rows.length}`);

  const slugs = rows.map((row, index) => {
    const slug = clean(row.slug);
    const brand = clean(row.brand);
    const name = clean(row.name);
    const gender = clean(row.gender);
    if (!slug || !brand || !name) throw new Error(`row ${index + 2}: slug/brand/name required`);
    if (!gender || !VALID_GENDERS.has(gender)) throw new Error(`row ${index + 2}: invalid gender`);
    if (row.quality_status !== "AUTO_READY" || row.catalog_relation !== "NEW" || row.source_verified !== "true" || row.data_confidence !== "high") {
      throw new Error(`row ${index + 2}: release contract not satisfied`);
    }
    if (!clean(row.source_url)) throw new Error(`row ${index + 2}: provenance required`);
    if (!splitList(row.top_notes).length || !splitList(row.middle_notes).length || !splitList(row.base_notes).length) {
      throw new Error(`row ${index + 2}: complete note pyramid required`);
    }
    return slug;
  });

  if (new Set(slugs).size !== EXPECTED_ROWS) throw new Error("batch-003 contains duplicate slugs");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();
  try {
    const beforeTotal = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes")).rows[0].n);
    const beforePublished = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes WHERE activo=true AND estado='publicado'")).rows[0].n);
    const collisions = (await client.query<{ slug: string }>("SELECT slug FROM perfumes WHERE slug = ANY($1::text[])", [slugs])).rows.map((row) => row.slug);
    if (collisions.length) throw new Error(`preflight slug collision: ${collisions.join(", ")}`);

    console.log(JSON.stringify({ phase: "preflight", artifactSha256: digest, beforeTotal, beforePublished, sourceRows: rows.length, collisions: 0 }, null, 2));

    await client.query("BEGIN");
    for (const row of rows) {
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
          'published',$16,$17,$18,$19,$20,$21,$22
        )`,
        [
          row.slug,
          row.name,
          row.brand,
          row.gender,
          clean(row.family),
          clean(row.concentration),
          splitList(row.top_notes),
          splitList(row.middle_notes),
          splitList(row.base_notes),
          splitList(row.accords),
          clean(row.price_segment),
          clean(row.image_url),
          clean(row.description),
          clean(row.source_url),
          clean(row.data_confidence),
          CATALOG_SOURCE,
          clean(row.subfamily),
          clean(row.launch_year) ? Number(row.launch_year) : null,
          clean(row.perfumer),
          clean(row.country),
          clean(row.seo_title),
          clean(row.seo_description),
        ],
      );
    }

    const inserted = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes WHERE catalog_source=$1 AND slug = ANY($2::text[])", [CATALOG_SOURCE, slugs])).rows[0].n);
    if (inserted !== EXPECTED_ROWS) throw new Error(`transaction verification expected ${EXPECTED_ROWS}, got ${inserted}`);

    await client.query("COMMIT");

    const afterTotal = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes")).rows[0].n);
    const afterPublished = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes WHERE activo=true AND estado='publicado'")).rows[0].n);
    if (afterTotal !== beforeTotal + EXPECTED_ROWS || afterPublished !== beforePublished + EXPECTED_ROWS) {
      throw new Error(`post-commit count mismatch: total ${beforeTotal}->${afterTotal}, published ${beforePublished}->${afterPublished}`);
    }

    console.log(JSON.stringify({ phase: "committed", artifactSha256: digest, inserted: EXPECTED_ROWS, beforeTotal, afterTotal, beforePublished, afterPublished, catalogSource: CATALOG_SOURCE, rollback: "npm --prefix apps/api exec tsx src/db/rollbackBatch003.ts" }, null, 2));
  } catch (error) {
    try { await client.query("ROLLBACK"); } catch {}
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("BATCH_003_IMPORT_FAILED", error);
  process.exit(1);
});
