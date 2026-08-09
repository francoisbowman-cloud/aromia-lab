import test from "node:test";
import assert from "node:assert/strict";
import { mapConcurrent, summarizeHarvest, harvestCandidate, identityEvidence } from "../expansion-harvest.mjs";

test("mapConcurrent preserves input order", async () => {
  const result = await mapConcurrent([3,1,2], 2, async (n) => { await new Promise((r) => setTimeout(r, n)); return n * 2; });
  assert.deepEqual(result, [6,2,4]);
});

test("harvest summary separates page discovery, notes and publication fields", () => {
  const report = summarizeHarvest([
    { harvest_status: "HARVESTED", notes_structure: "PYRAMID", image_url: "https://img/a.webp", description: "A", amazon_url: "https://amazon/a" },
    { harvest_status: "HARVESTED", notes_structure: "UNKNOWN", source_does_not_publish_notes: "true", image_url: "", description: "B", amazon_url: "https://amazon/b" },
    { harvest_status: "NOT_FOUND", notes_structure: "UNKNOWN" },
  ]);
  assert.equal(report.harvested, 2);
  assert.equal(report.explicit_notes, 1);
  assert.equal(report.verified_source_no_notes, 1);
  assert.equal(report.image_complete, 1);
  assert.equal(report.description_complete, 2);
  assert.equal(report.harvested_rate, 2/3);
});

test("official product URL participates in identity confirmation", () => {
  const identity = identityEvidence(
    { brand: "Givenchy", name: "Gentleman Réserve Privée" },
    { title: "", structured_product_name: "" },
    "https://brand.test/gentleman-reserve-privee-F10100159.html",
  );
  assert.equal(identity.confirmed, true);
  assert.ok(identity.coverage >= 0.6);
});

test("brand-only official page cannot confirm a specific identity", () => {
  const identity = identityEvidence(
    { brand: "Bvlgari", name: "Man in Black" },
    { title: "Bvlgari Heritage", structured_product_name: "" },
    "https://brand.test/bvlgari-heritage/romaness",
  );
  assert.equal(identity.confirmed, false);
});

test("harvest fallbacks never query non-official hosts when sitemap has no match", async () => {
  const requested = [];
  const fetchImpl = async (url) => {
    requested.push(url);
    const isRobots = url.endsWith("robots.txt");
    const isSitemap = url.endsWith("sitemap.xml");
    const isLanding = url === "https://brand.test" || url === "https://brand.test/";
    const ok = isRobots || isSitemap || isLanding;
    return {
      ok,
      status: ok ? 200 : 404,
      url,
      headers: { get: () => isSitemap ? "text/xml" : "text/html" },
      text: async () => isRobots
        ? "Sitemap: https://brand.test/sitemap.xml"
        : isSitemap
          ? "<urlset><url><loc>https://brand.test/collections/gifts</loc></url></urlset>"
          : "<a href='/fragrances'>Fragrances</a>",
    };
  };
  const result = await harvestCandidate({ candidate_id: "x", brand: "Brand", name: "Amber Moon", concentration: "EDP", official_domain: "brand.test" }, { fetchImpl, timeoutMs: 1000 });
  assert.notEqual(result.harvest_status, "HARVESTED");
  assert.ok(requested.length > 0);
  assert.ok(requested.every((url) => new URL(url).hostname === "brand.test"));
  assert.equal(result.source_url, "");
});

test("verified official product page without note labels records source_does_not_publish_notes", async () => {
  const productUrl = "https://brand.test/products/amber-moon-eau-de-parfum";
  const pages = new Map([
    ["https://brand.test/robots.txt", "Sitemap: https://brand.test/sitemap.xml"],
    ["https://brand.test/sitemap.xml", `<urlset><url><loc>${productUrl}</loc></url></urlset>`],
    [productUrl, `<meta property="og:title" content="Amber Moon Eau de Parfum"><meta property="og:description" content="Warm amber fragrance"><meta property="og:image" content="https://cdn.brand.test/amber.webp"><script type="application/ld+json">{"@type":"Product","name":"Amber Moon","audience":{"audienceType":"Unisex"}}</script>`],
  ]);
  const fetchImpl = async (url) => ({ ok: pages.has(url), status: pages.has(url) ? 200 : 404, url, headers: { get: () => "text/html" }, text: async () => pages.get(url) ?? "" });
  const result = await harvestCandidate({ candidate_id: "x", brand: "Brand", name: "Amber Moon", concentration: "EDP", official_domain: "brand.test" }, { fetchImpl, timeoutMs: 1000 });
  assert.equal(result.harvest_status, "HARVESTED");
  assert.equal(result.source_does_not_publish_notes, "true");
  assert.equal(result.image_url, "https://cdn.brand.test/amber.webp");
  assert.match(result.amazon_url, /amazon\.com\/s\?/);
});
