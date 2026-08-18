import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const dir = resolve(root, "assets/aromia-materials");
const csvPath = resolve(dir, "materials.csv");
const manifestPath = resolve(dir, "manifest.json");

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",");
  return lines.filter(Boolean).map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((key, index) => [key, values[index] ?? ""]));
  });
}

function fail(message) {
  console.error(`material-library: ${message}`);
  process.exitCode = 1;
}

const rows = parseCsv(readFileSync(csvPath, "utf8"));
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const ids = new Set();
const manifestById = new Map((manifest.assets ?? []).map((asset) => [asset.id, asset]));

for (const row of rows) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.id)) fail(`invalid id: ${row.id}`);
  if (ids.has(row.id)) fail(`duplicate id: ${row.id}`);
  ids.add(row.id);

  if (row.canonical_product_identity !== "false") fail(`${row.id}: canonical_product_identity must be false`);
  if (row.approved_for_product_identity !== "false") fail(`${row.id}: approved_for_product_identity must be false`);
  if (row.provenance_required_for_note_claim !== "true") fail(`${row.id}: provenance gate must remain true`);

  const absolute = resolve(root, row.relative_path);
  if (!existsSync(absolute)) {
    fail(`${row.id}: missing binary ${row.relative_path}`);
    continue;
  }
  const digest = createHash("sha256").update(readFileSync(absolute)).digest("hex");
  if (digest !== row.sha256) fail(`${row.id}: sha256 mismatch`);

  const manifestAsset = manifestById.get(row.id);
  if (!manifestAsset) fail(`${row.id}: missing from manifest.json`);
  if (manifestAsset && manifestAsset.file !== row.file) fail(`${row.id}: manifest file mismatch`);
}

for (const asset of manifest.assets ?? []) {
  if (!ids.has(asset.id)) fail(`${asset.id}: manifest asset missing from materials.csv`);
}

if (!process.exitCode) console.log(`material-library: PASS (${rows.length} governed assets)`);
