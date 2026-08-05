import { readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

export const SCRIPTS_DIR = fileURLToPath(new URL(".", import.meta.url));
export const REPO_ROOT = join(SCRIPTS_DIR, "..", "..");
export const PERFUMES_IMAGES_DIR = join(
  REPO_ROOT,
  "apps/web/public/images/perfumes"
);
export const LEGACY_OVL_DIR = join(REPO_ROOT, "apps/web/public/ovl");

export const IMAGE_EXTENSIONS = new Set([".webp", ".avif", ".png", ".jpg", ".jpeg"]);

/** Camina un directorio de forma recursiva. No sigue symlinks. Devuelve rutas absolutas. */
export function walk(dir) {
  let out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out = out.concat(walk(full));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

export function listImageFiles(dir) {
  return walk(dir).filter((f) => IMAGE_EXTENSIONS.has(extname(f).toLowerCase()));
}

export function fileSizeKb(path) {
  return statSync(path).size / 1024;
}

/** Parsea el patrón {slug}--{rol}--v{NN}--{ancho}x{alto}.{ext}. Devuelve null si no matchea. */
export function parseDerivativeName(filename) {
  const m = filename.match(
    /^([a-z0-9-]+)--(catalog|editorial)--v(\d{2})--(\d+)x(\d+)\.(webp|avif|png)$/
  );
  if (!m) return null;
  const [, slug, role, version, width, height, format] = m;
  return {
    slug,
    role,
    version: Number(version),
    width: Number(width),
    height: Number(height),
    format,
  };
}

export function log(msg) {
  process.stdout.write(msg + "\n");
}

export function warn(msg) {
  process.stderr.write("⚠ " + msg + "\n");
}

export function fail(msg) {
  process.stderr.write("✖ " + msg + "\n");
}

export function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

export const DRY_RUN = hasFlag("dry-run");
