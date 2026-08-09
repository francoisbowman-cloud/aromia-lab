import test from "node:test";
import assert from "node:assert/strict";
import { mapConcurrent, summarizeHarvest, harvestCandidate, identityEvidence } from "../expansion-harvest.mjs";

test("mapConcurrent preserves input order", async () => {
  const result = await mapConcurrent([3,1,2], 2, async (n) => { await new Promise((r) => setTimeout(r, n)); return n * 2; });
  assert.deepEqual(result, [6,2,4]);
});

test("harvest summary separates page discovery from explicit notes extraction", () => {
  const report = summarizeHarvest([
    { harvest_status: "HARVESTED", notes_structure: "PYRAMID" },
    { harvest_status: "HARVESTED", notes_structure: "UNKNOWN" },
    { harvest_status: "NOT_FOUND", notes_structure: "UNKNOWN" },
  ]);
  assert.equal(report.harvested, 2);
  assert.equal(report.explicit_notes, 1);
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

test("harvest never falls back to non-official search when sitemap has no match", async () => {
  const fetchImpl = async (url) => ({ ok: true, status: 200, url, headers: { get: () => "text/xml" }, text: async () => url.endsWith("robots.txt") ? "Sitemap: https://brand.test/sitemap.xml" : "<urlset><url><loc>https://brand.test/collections/gifts</loc></url></urlset>" });
  const result = await harvestCandidate({ candidate_id: "x", brand: "Brand", name: "Amber Moon", concentration: "EDP", official_domain: "brand.test" }, { fetchImpl, timeoutMs: 1000 });
  assert.equal(result.harvest_status, "NOT_FOUND");
  assert.equal(result.source_url, "");
});
