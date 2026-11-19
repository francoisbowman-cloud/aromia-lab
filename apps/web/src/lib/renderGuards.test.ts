import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Source-level guards for two defects found with a real browser (editorial-render-audit):
// both are invisible to unit tests of logic, so the class names themselves are pinned.
// vitest runs with cwd = apps/web (same as CI).
const read = (rel: string) => readFileSync(resolve(process.cwd(), rel), "utf8");

describe("article body colours follow the theme tokens", () => {
  const page = read("src/app/magazine/[slug]/page.tsx");
  const prose = /className="(prose [^"]*)"/.exec(page)?.[1] ?? "";

  it("links and captions use theme tokens, not Typography's fixed greys", () => {
    // Without these, links were rgb(23,23,23) on a near-black page in dark mode (1.05:1)
    // and captions a fixed #737373 (4.35:1 light, 3.95:1 dark).
    expect(prose).toContain("prose-a:text-ink");
    expect(prose).toContain("prose-figcaption:text-muted");
  });
});

describe("loading states reserve a full screen so the footer cannot jump into view", () => {
  // A short fallback leaves the footer inside the viewport; when the real content arrives
  // the footer moves (measured layout shift 0.2-0.3). 100svh keeps it below the fold.
  for (const file of [
    "src/app/loading.tsx",
    "src/app/magazine/loading.tsx",
    "src/app/magazine/[slug]/loading.tsx",
    "src/app/catalogo/[slug]/loading.tsx",
  ]) {
    it(`${file} reserves min-h-[100svh]`, () => {
      expect(read(file)).toContain("min-h-[100svh]");
    });
  }
});

describe("paged reader exposes modal semantics", () => {
  it("keeps role=dialog, aria-modal and the AA-contrast kicker colour", () => {
    const reader = read("src/components/magazine/PageFlipReader.tsx");
    expect(reader).toContain('role="dialog"');
    expect(reader).toContain('aria-modal="true"');
    expect(reader).not.toContain("#8d7144"); // 4.15:1 on #f8f3e8; #866b41 is 4.53:1
  });
});
