import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { inspectLocalVisualAsset, validateVisualAssetPath } from "./visualEvidence";

async function withFixture(run: (root: string, bytes: Buffer, escapeAsset: string) => Promise<void>) {
  const root = mkdtempSync(join(tmpdir(), "aromia-visual-evidence-"));
  try {
    const images = join(root, "apps", "web", "public", "editorial-v1");
    mkdirSync(images, { recursive: true });
    const bytes = await sharp({ create: { width: 12, height: 9, channels: 3,
      background: { r: 80, g: 120, b: 40 } } }).png().toBuffer();
    writeFileSync(join(images, "bergamot.png"), bytes);
    writeFileSync(join(root, "private.png"), bytes);
    writeFileSync(join(images, "wrong.png"), Buffer.from("not actually an image"));
    let escapeAsset = "/editorial-v1/escape.png";
    try {
      symlinkSync(join(root, "private.png"), join(images, "escape.png"));
    } catch (error) {
      // Windows accounts without symlink privilege: a directory junction pointing outside
      // the public root exercises the same realpath confinement. Other errors propagate.
      if ((error as NodeJS.ErrnoException).code !== "EPERM" || process.platform !== "win32") throw error;
      mkdirSync(join(root, "outside"));
      writeFileSync(join(root, "outside", "escape.png"), bytes);
      symlinkSync(join(root, "outside"), join(images, "linked"), "junction");
      escapeAsset = "/editorial-v1/linked/escape.png";
    }
    await run(root, bytes, escapeAsset);
  } finally { rmSync(root, { recursive: true, force: true }); }
}
describe("local visual evidence inspection", () => {
  it("calculates the SHA from real image bytes without granting approval", async () => {
    await withFixture(async (root, bytes) => {
      const record = await inspectLocalVisualAsset(root, "/editorial-v1/bergamot.png");
      expect(record.width).toBe(12);
      expect(record.height).toBe(9);
      expect(record.format).toBe("png");
      expect(record.bytes).toBe(bytes.length);
      expect(record.bytesSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(record.publication).toBe("blocked");
      expect(record.identityVerified).toBe(false);
      expect(record.rightsVerified).toBe(false);
      expect(record.visualQualityVerified).toBe(false);
      writeFileSync(join(root, "apps/web/public/editorial-v1/bergamot.png"), Buffer.from("changed"));
      await expect(inspectLocalVisualAsset(root, "/editorial-v1/bergamot.png")).rejects.toThrow("invalid_visual_asset_content");
    });
  });
  it("denies traversal, absolute filesystem paths, encoded segments and remote sources", async () => {
    for (const path of ["https://example.org/x.png", "//evil.test/x.png", "/../private.png",
      "/x/./b.png", "/x/../b.png", "/x/%2e%2e/y.png", "file:///etc/passwd",
      "/image.svg", "/image.png?size=20", "/image.png#fragment", "/x\\bad.png"]) {
      expect(() => validateVisualAssetPath(path)).toThrow("invalid_visual_asset_path");
    }
    await withFixture(async (root, _bytes, escapeAsset) => {
      await expect(inspectLocalVisualAsset(root, escapeAsset)).rejects.toThrow("invalid_visual_asset_path");
      await expect(inspectLocalVisualAsset(root, "/editorial-v1/missing.png")).rejects.toThrow("visual_asset_unavailable");
      await expect(inspectLocalVisualAsset(root, "/editorial-v1/wrong.png")).rejects.toThrow("invalid_visual_asset_content");
    });
  });
});
