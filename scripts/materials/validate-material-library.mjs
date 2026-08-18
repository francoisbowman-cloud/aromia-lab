import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const dir = resolve(root, "assets/aromia-materials");
const csvPath = resolve(dir, "materials.csv");
const manifestPath = resolve(dir, "manifest.json");
const aliasesPath = resolve(dir, "aliases.json");
const requireBinaries = process.argv.includes("--require-binaries") || process.env.MATERIAL_LIBRARY_REQUIRE_BINARIES === "1";

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

function warn(message) {
  console.warn(`material-library: WARN ${message}`);
}

const rows = parseCsv(readFileSync(csvPath, "utf8"));
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const aliases = existsSync(aliasesPath) ? JSON.parse(readFileSync(aliasesPath, "utf8")) : {};
const ids = new Set();
const manifestById = new Map((manifest.assets ?? []).map((asset) => [asset.id, asset]));
let binariesVerified = 0;
let binariesMissing = 0;

const canonicalId = (id) => aliases[id] ?? id;

for (const row of rows) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.id)) fail(`invalid id: ${row.id}`);
  const id = canonicalId(row.id);
  if (ids.has(id)) fail(`duplicate canonical id: ${id}`);
  ids.add(id);
  if (id !== row.id) warn(`${row.id} is a compatibility alias for canonical id ${id}`);

  if (!/^assets\/aromia-materials\/files\/[a-z0-9-]+\.(webp|png)$/.test(row.relative_path)) fail(`${row.id}: invalid relative_path`);

  const asset = manifestById.get(id);
  if (!asset) {
    fail(`${row.id}: canonical asset ${id} missing from manifest.json`);
    continue;
  }
  if (asset.file !== row.file) fail(`${row.id}: manifest file mismatch`);
  if (asset.relative_path !== row.relative_path) fail(`${row.id}: manifest path mismatch`);
  if (asset.canonical_product_identity !== false) fail(`${row.id}: material cannot be canonical product identity`);
  if (!/^[a-f0-9]{64}$/.test(asset.sha256)) fail(`${row.id}: invalid manifest sha256`);

  const absolute = resolve(root, row.relative_path);
  if (!existsSync(absolute)) {
    binariesMissing += 1;
    if (requireBinaries) fail(`${row.id}: missing binary ${row.relative_path}`);
    continue;
  }

  const bytes = readFileSync(absolute);
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== asset.sha256) fail(`${row.id}: sha256 mismatch`);
  if (Number(asset.bytes) !== bytes.byteLength) fail(`${row.id}: byte-size mismatch`);
  binariesVerified += 1;
}

for (const asset of manifest.assets ?? []) {
  if (!ids.has(asset.id)) fail(`${asset.id}: manifest asset missing from materials.csv`);
}

if (!process.exitCode) {
  if (binariesMissing && !requireBinaries) warn(`${binariesMissing} binaries are not present in this checkout; metadata collaboration remains valid. Run with --require-binaries for release/integrity validation.`);
  console.log(`material-library: PASS metadata=${rows.length} binaries_verified=${binariesVerified} binaries_missing=${binariesMissing} strict=${requireBinaries}`);
}
