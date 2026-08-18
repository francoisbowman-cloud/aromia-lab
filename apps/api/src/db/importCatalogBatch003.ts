import "dotenv/config";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { Pool, type PoolClient } from "pg";

type RawRow = Record<string, string>;
type Gender = "masculino" | "femenino" | "unisex";

type SourceRow = {
  slug: string; name: string; brand: string; concentration: string | null; gender: Gender;
  family: string | null; subfamily: string | null; launchYear: number | null; perfumer: string | null;
  country: string | null; description: string | null; topNotes: string[]; middleNotes: string[];
  baseNotes: string[]; accords: string[]; priceSegment: "económico" | "medio" | "premium" | "lujo" | null;
  sourceUrl: string; imageUrl: string | null; dataConfidence: "high"; seoTitle: string | null; seoDescription: string | null;
};

const BATCH_PATH = "catalog/imports/batch-003.csv";
const BATCH_SOURCE = "batch-003";
const EXPECTED_ROWS = 10;
const ACCEPTED_ARTIFACT_SHA256 = "e97833db0a7555c67cd7a84342fdca844efc1ae876fcdeabfa4512611a2ad32b";
const VALID_GENDERS = new Set<Gender>(["masculino", "femenino", "unisex"]);
const VALID_PRICE_SEGMENTS = new Set(["económico", "medio", "premium", "lujo"]);

function clean(value: unknown): string | null {
  const text = String(value ?? "").trim();
  if (!text || ["pending", "null", "undefined", "n/a"].includes(text.toLowerCase())) return null;
  return text;
}
function splitList(value: unknown): string[] { const text = clean(value); return text ? text.split(";").map((item) => item.trim()).filter(Boolean) : []; }
function parseLaunchYear(value: unknown): number | null {
  const text = clean(value); if (!text) return null; const year = Number(text);
  if (!Number.isInteger(year) || year < 1800 || year > 2100) throw new Error(`invalid launch_year ${JSON.stringify(value)}`); return year;
}
function normalizePriceSegment(value: unknown): SourceRow["priceSegment"] {
  const text = clean(value)?.toLowerCase(); if (!text) return null; const normalized = text === "economico" ? "económico" : text;
  if (!VALID_PRICE_SEGMENTS.has(normalized)) throw new Error(`invalid price_segment ${JSON.stringify(value)}`); return normalized as SourceRow["priceSegment"];
}
function loadBatch(): { rows: SourceRow[]; slugs: string[]; sha256: string } {
  const absolute = resolve(process.cwd(), BATCH_PATH); const bytes = readFileSync(absolute);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (sha256 !== ACCEPTED_ARTIFACT_SHA256) throw new Error(`batch-003 artifact hash mismatch: expected ${ACCEPTED_ARTIFACT_SHA256}, got ${sha256}`);
  const raw = parse(bytes, { columns: true, skip_empty_lines: true, relax_column_count: false, trim: true }) as RawRow[];
  if (raw.length !== EXPECTED_ROWS) throw new Error(`batch-003 expected ${EXPECTED_ROWS} rows, got ${raw.length}`);
  const rows = raw.map((row, index): SourceRow => {
    const line = index + 2;
    if (String(row.quality_status).trim() !== "AUTO_READY") throw new Error(`row ${line}: quality_status must be AUTO_READY`);
    if (String(row.source_verified).trim().toLowerCase() !== "true") throw new Error(`row ${line}: source_verified must be true`);
    if (String(row.data_confidence).trim().toLowerCase() !== "high") throw new Error(`row ${line}: data_confidence must be high`);
    if (String(row.catalog_relation).trim() !== "NEW") throw new Error(`row ${line}: catalog_relation must be NEW`);
    if (String(row.notes_status).trim() !== "published") throw new Error(`row ${line}: notes_status must be published`);
    const slug = clean(row.slug), name = clean(row.name), brand = clean(row.brand), sourceUrl = clean(row.source_url), gender = clean(row.gender) as Gender | null;
    if (!slug || !name || !brand || !sourceUrl) throw new Error(`row ${line}: slug/name/brand/source_url are required`);
    if (!gender || !VALID_GENDERS.has(gender)) throw new Error(`row ${line}: invalid gender ${JSON.stringify(row.gender)}`);
    const topNotes = splitList(row.top_notes), middleNotes = splitList(row.middle_notes), baseNotes = splitList(row.base_notes);
    if (!topNotes.length || !middleNotes.length || !baseNotes.length) throw new Error(`row ${line}: complete note pyramid required`);
    return { slug, name, brand, concentration: clean(row.concentration), gender, family: clean(row.family), subfamily: clean(row.subfamily), launchYear: parseLaunchYear(row.launch_year), perfumer: clean(row.perfumer), country: clean(row.country), description: clean(row.description), topNotes, middleNotes, baseNotes, accords: splitList(row.accords), priceSegment: normalizePriceSegment(row.price_segment), sourceUrl, imageUrl: clean(row.image_url), dataConfidence: "high", seoTitle: clean(row.seo_title), seoDescription: clean(row.seo_description) };
  });
  const slugs = rows.map((row) => row.slug); if (new Set(slugs).size !== EXPECTED_ROWS) throw new Error("batch-003 contains duplicate slugs");
  return { rows, slugs, sha256 };
}
async function insertRow(client: PoolClient, row: SourceRow) {
  await client.query(`INSERT INTO perfumes (slug,nombre,marca,genero,familia_olfativa,concentracion,notas_salida,notas_corazon,notas_fondo,accords,precio_referencia,moneda,categoria_precio,imagen_url,link_afiliado,descripcion_corta,activo,estado,source_url,data_confidence,notes_status,catalog_source,subfamilia_olfativa,launch_year,perfumer,country,seo_title,seo_description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NULL,NULL,$11,$12,NULL,$13,true,'publicado',$14,$15,'published',$16,$17,$18,$19,$20,$21,$22)`, [row.slug,row.name,row.brand,row.gender,row.family,row.concentration,row.topNotes,row.middleNotes,row.baseNotes,row.accords,row.priceSegment,row.imageUrl,row.description,row.sourceUrl,row.dataConfidence,BATCH_SOURCE,row.subfamily,row.launchYear,row.perfumer,row.country,row.seoTitle,row.seoDescription]);
}
async function importBatch(client: PoolClient, rows: SourceRow[], slugs: string[], sha256: string) {
  const beforeTotal = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes")).rows[0].n);
  const beforePublished = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes WHERE activo=true AND estado='publicado'")).rows[0].n);
  const existingRows = await client.query<{ slug: string }>("SELECT slug FROM perfumes WHERE slug = ANY($1::text[])", [slugs]);
  if (existingRows.rows.length) throw new Error(`preflight rejected existing slugs: ${existingRows.rows.map((row) => row.slug).join(", ")}`);
  console.log(JSON.stringify({ phase:"preflight",batch:BATCH_SOURCE,artifact_sha256:sha256,beforeTotal,beforePublished,candidateRows:rows.length,existingSlugs:0 }, null, 2));
  await client.query("BEGIN");
  try {
    for (const row of rows) await insertRow(client,row);
    const target = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes WHERE catalog_source=$1 AND slug = ANY($2::text[])",[BATCH_SOURCE,slugs])).rows[0].n);
    if (target !== EXPECTED_ROWS) throw new Error(`transaction verification expected ${EXPECTED_ROWS} batch rows, got ${target}`);
    const afterTotalTx = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes")).rows[0].n);
    if (afterTotalTx !== beforeTotal + EXPECTED_ROWS) throw new Error(`transaction total expected ${beforeTotal + EXPECTED_ROWS}, got ${afterTotalTx}`);
    await client.query("COMMIT");
  } catch (error) { await client.query("ROLLBACK"); throw error; }
  const afterTotal = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes")).rows[0].n);
  const afterPublished = Number((await client.query("SELECT COUNT(*)::int AS n FROM perfumes WHERE activo=true AND estado='publicado'")).rows[0].n);
  const imported = (await client.query("SELECT slug,marca,nombre,activo,estado,catalog_source FROM perfumes WHERE catalog_source=$1 ORDER BY slug",[BATCH_SOURCE])).rows;
  if (afterTotal !== beforeTotal + EXPECTED_ROWS || afterPublished !== beforePublished + EXPECTED_ROWS || imported.length !== EXPECTED_ROWS) throw new Error(`post-commit verification failed: totals ${beforeTotal}->${afterTotal}, published ${beforePublished}->${afterPublished}, batchRows=${imported.length}`);
  console.log(JSON.stringify({ phase:"committed",batch:BATCH_SOURCE,artifact_sha256:sha256,inserted:EXPECTED_ROWS,beforeTotal,afterTotal,beforePublished,afterPublished,imported }, null, 2));
}
async function rollbackBatch(client: PoolClient, slugs: string[], sha256: string) {
  if (process.env.ALLOW_BATCH_003_ROLLBACK !== "yes") throw new Error("rollback requires ALLOW_BATCH_003_ROLLBACK=yes");
  const rows = (await client.query<{slug:string;catalog_source:string}>("SELECT slug,catalog_source FROM perfumes WHERE slug = ANY($1::text[]) ORDER BY slug",[slugs])).rows;
  if (rows.length !== EXPECTED_ROWS || rows.some((row) => row.catalog_source !== BATCH_SOURCE)) throw new Error(`rollback preflight refused: expected exactly ${EXPECTED_ROWS} rows owned by ${BATCH_SOURCE}, got ${rows.length}`);
  await client.query("BEGIN");
  try { const deleted = await client.query("DELETE FROM perfumes WHERE catalog_source=$1 AND slug = ANY($2::text[])",[BATCH_SOURCE,slugs]); if (deleted.rowCount !== EXPECTED_ROWS) throw new Error(`rollback expected ${EXPECTED_ROWS} deletes, got ${deleted.rowCount}`); await client.query("COMMIT"); }
  catch (error) { await client.query("ROLLBACK"); throw error; }
  console.log(JSON.stringify({phase:"rolled_back",batch:BATCH_SOURCE,artifact_sha256:sha256,deleted:EXPECTED_ROWS},null,2));
}
async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required"); const {rows,slugs,sha256}=loadBatch(); const action=process.env.CATALOG_IMPORT_ACTION ?? "import";
  if (!new Set(["import","rollback"]).has(action)) throw new Error(`unsupported CATALOG_IMPORT_ACTION=${action}`);
  const pool=new Pool({connectionString:process.env.DATABASE_URL}); const client=await pool.connect();
  try { if (action === "rollback") await rollbackBatch(client,slugs,sha256); else await importBatch(client,rows,slugs,sha256); }
  finally { client.release(); await pool.end(); }
}
main().catch((error)=>{ console.error("CATALOG_BATCH_003_FAILED",error); process.exit(1); });
