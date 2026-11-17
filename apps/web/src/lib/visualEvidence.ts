// Server-only, read-only inspection of existing raster assets in apps/web/public.
// This does not fetch remote images, establish product identity, prove rights or approve release.
import { createHash } from "node:crypto";
import { readFileSync, realpathSync, statSync } from "node:fs";
import { resolve, relative, isAbsolute, sep } from "node:path";
import sharp from "sharp";

const EXT = /\.(png|jpe?g|webp|avif|gif)$/i;
const MAX_BYTES = 25 * 1024 * 1024;
const within = (base: string, target: string) => {
  const rel = relative(base, target);
  return rel !== "" && rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
};

// Exact site-local public URL, not filesystem input, URL-encoded path, remote URL or a data URI.
export function validateVisualAssetPath(value: unknown): string {
  if (typeof value !== "string" || value.length > 512 ||
      !/^\/[a-zA-Z0-9_./-]+$/.test(value) || !EXT.test(value) ||
      value.includes("//") || value.split("/").some(part => part === "." || part === "..")) {
    throw new Error("invalid_visual_asset_path");
  }
  return value;
}

export async function inspectLocalVisualAsset(root: string, candidate: unknown) {
  const url = validateVisualAssetPath(candidate);
  const publicRoot = resolve(root, "apps/web/public");
  const target = resolve(publicRoot, `.${url}`);
  if (!within(publicRoot, target)) throw new Error("invalid_visual_asset_path");
  let bytes: Buffer;
  try {
    const realRoot = realpathSync(publicRoot);
    const realTarget = realpathSync(target);
    if (!within(realRoot, realTarget)) throw new Error("invalid_visual_asset_path");
    const info = statSync(realTarget);
    if (!info.isFile() || info.size <= 0 || info.size > MAX_BYTES) throw new Error("invalid_visual_asset_size");
    bytes = readFileSync(realTarget);
    if (bytes.length !== info.size) throw new Error("visual_asset_changed_during_inspection");
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("invalid_visual_asset")) throw error;
    throw new Error("visual_asset_unavailable");
  }
  let metadata: sharp.Metadata;
  try {
    metadata = await sharp(bytes, { failOn: "error", limitInputPixels: 60_000_000 }).metadata();
  } catch {
    throw new Error("invalid_visual_asset_content");
  }
  if (!metadata.width || !metadata.height ||
      !["png","jpeg","webp","avif","gif"].includes(metadata.format ?? "")) {
    throw new Error("invalid_visual_asset_content");
  }
  const bytesSha256 = createHash("sha256").update(bytes).digest("hex");
  return {
    url,
    bytesSha256,
    bytes: bytes.length,
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
    publication: "blocked" as const,
    identityVerified: false as const,
    rightsVerified: false as const,
    visualQualityVerified: false as const,
  };
}
