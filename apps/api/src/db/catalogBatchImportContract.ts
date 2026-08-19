import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";

export type RawRow = Record<string, string>;
export type Gender = "masculino" | "femenino" | "unisex";
export type PriceSegment = "económico" | "medio" | "premium" | "lujo";

export type ImportManifest = {
  batch_id: string;
  expected_rows: number;
  artifact_sha256: string;
  quality_status: "AUTO_READY";
  source_verified: true;
  data_confidence: "high";
  catalog_relation: "NEW";
  notes_status: "published";
};

export type SourceRow = {
  slug: string;
  name: string;
  brand: string;
  concentration: string | null;
  gender: Gender;
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
  priceSegment: PriceSegment | null;
  sourceUrl: string;
  imageUrl: string | null;
  dataConfidence: "high";
  seoTitle: string | null;
  seoDescription: string | null;
};

const BATCH_PATTERN = /^batch-\d{3}$/;
const VALID_GENDERS = new Set<Gender>(["masculino", "femenino", "unisex"]);
const VALID_PRICE_SEGMENTS = new Set<PriceSegment>(["económico", "medio", "premium", "lujo"]);

export function normalizeBatchId(value: unknown): string {
  const batchId = String(value ?? "").trim();
  if (!BATCH_PATTERN.test(batchId)) throw new Error(`invalid catalog batch id: ${batchId || "missing"}`);
  return batchId;
}

function clean(value: unknown): string | null {
  const text = String(value ?? "").trim();
  if (!text || ["pending", "null", "undefined", "n/a"].includes(text.toLowerCase())) return null;
  return text;
}

function splitList(value: unknown): string[] {
  const text = clean(value);
  return text ? text.split(";").map((item) => item.trim()).filter(Boolean) : [];
}

function parseLaunchYear(value: unknown): number | null {
  const text = clean(value);
  if (!text) return null;
  const year = Number(text);
  if (!Number.isInteger(year) || year < 1800 || year > 2100) throw new Error(`invalid launch_year ${JSON.stringify(value)}`);
  return year;
}

function normalizePriceSegment(value: unknown): PriceSegment | null {
  const text = clean(value)?.toLowerCase();
  if (!text) return null;
  const normalized = text === "economico" ? "económico" : text;
  if (!VALID_PRICE_SEGMENTS.has(normalized as PriceSegment)) throw new Error(`invalid price_segment ${JSON.stringify(value)}`);
  return normalized as PriceSegment;
}

function validateManifest(raw: unknown, batchId: string): ImportManifest {
  if (!raw || typeof raw !== "object") throw new Error("catalog import manifest must be an object");
  const m = raw as Partial<ImportManifest>;
  if (m.batch_id !== batchId) throw new Error(`manifest batch_id mismatch: expected ${batchId}, got ${String(m.batch_id)}`);
  if (!Number.isInteger(m.expected_rows) || Number(m.expected_rows) <= 0) throw new Error("manifest expected_rows must be a positive integer");
  if (!/^[a-f0-9]{64}$/.test(String(m.artifact_sha256 ?? ""))) throw new Error("manifest artifact_sha256 must be a lowercase SHA-256 hex digest");
  if (m.quality_status !== "AUTO_READY") throw new Error("manifest quality_status must be AUTO_READY");
  if (m.source_verified !== true) throw new Error("manifest source_verified must be true");
  if (m.data_confidence !== "high") throw new Error("manifest data_confidence must be high");
  if (m.catalog_relation !== "NEW") throw new Error("manifest catalog_relation must be NEW");
  if (m.notes_status !== "published") throw new Error("manifest notes_status must be published");
  return m as ImportManifest;
}

export function loadBatchDefinition(batchIdInput: unknown, rootDir = process.cwd()): {
  batchId: string;
  manifest: ImportManifest;
  rows: SourceRow[];
  slugs: string[];
  sha256: string;
  csvPath: string;
  manifestPath: string;
} {
  const batchId = normalizeBatchId(batchIdInput);
  const csvPath = resolve(rootDir, "catalog", "imports", `${batchId}.csv`);
  const manifestPath = resolve(rootDir, "catalog", "imports", `${batchId}.manifest.json`);
  const manifest = validateManifest(JSON.parse(readFileSync(manifestPath, "utf-8")), batchId);
  const bytes = readFileSync(csvPath);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (sha256 !== manifest.artifact_sha256) throw new Error(`${batchId} artifact hash mismatch: expected ${manifest.artifact_sha256}, got ${sha256}`);

  const raw = parse(bytes, { columns: true, skip_empty_lines: true, relax_column_count: false, trim: true }) as RawRow[];
  if (raw.length !== manifest.expected_rows) throw new Error(`${batchId} expected ${manifest.expected_rows} rows, got ${raw.length}`);

  const rows = raw.map((row, index): SourceRow => {
    const line = index + 2;
    if (String(row.quality_status).trim() !== manifest.quality_status) throw new Error(`row ${line}: quality_status must be ${manifest.quality_status}`);
    if ((String(row.source_verified).trim().toLowerCase() === "true") !== manifest.source_verified) throw new Error(`row ${line}: source_verified must be true`);
    if (String(row.data_confidence).trim().toLowerCase() !== manifest.data_confidence) throw new Error(`row ${line}: data_confidence must be high`);
    if (String(row.catalog_relation).trim() !== manifest.catalog_relation) throw new Error(`row ${line}: catalog_relation must be NEW`);
    if (String(row.notes_status).trim() !== manifest.notes_status) throw new Error(`row ${line}: notes_status must be published`);

    const slug = clean(row.slug);
    const name = clean(row.name);
    const brand = clean(row.brand);
    const sourceUrl = clean(row.source_url);
    const gender = clean(row.gender) as Gender | null;
    if (!slug || !name || !brand || !sourceUrl) throw new Error(`row ${line}: slug/name/brand/source_url are required`);
    if (!gender || !VALID_GENDERS.has(gender)) throw new Error(`row ${line}: invalid gender ${JSON.stringify(row.gender)}`);

    const topNotes = splitList(row.top_notes);
    const middleNotes = splitList(row.middle_notes);
    const baseNotes = splitList(row.base_notes);
    if (!topNotes.length || !middleNotes.length || !baseNotes.length) throw new Error(`row ${line}: complete note pyramid required`);

    return {
      slug,
      name,
      brand,
      concentration: clean(row.concentration),
      gender,
      family: clean(row.family),
      subfamily: clean(row.subfamily),
      launchYear: parseLaunchYear(row.launch_year),
      perfumer: clean(row.perfumer),
      country: clean(row.country),
      description: clean(row.description),
      topNotes,
      middleNotes,
      baseNotes,
      accords: splitList(row.accords),
      priceSegment: normalizePriceSegment(row.price_segment),
      sourceUrl,
      imageUrl: clean(row.image_url),
      dataConfidence: "high",
      seoTitle: clean(row.seo_title),
      seoDescription: clean(row.seo_description),
    };
  });

  const slugs = rows.map((row) => row.slug);
  if (new Set(slugs).size !== manifest.expected_rows) throw new Error(`${batchId} contains duplicate slugs`);
  return { batchId, manifest, rows, slugs, sha256, csvPath, manifestPath };
}
