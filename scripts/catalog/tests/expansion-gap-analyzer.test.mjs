import test from "node:test";
import assert from "node:assert/strict";
import { analyzeCatalogGaps, brandGapBonus, serializableGapReport } from "../expansion-gap-analyzer.mjs";
import { scoreCandidate } from "../expansion-engine.mjs";

test("gap analyzer measures coverage and missingness", () => {
  const analysis = analyzeCatalogGaps([
    { brand: "A", gender: "masculino", family: "woody", concentration: "EDP" },
    { brand: "A", gender: "femenino", family: "pending", concentration: "EDT" },
    { brand: "B", gender: "unisex", family: "amber", concentration: "EDP" },
  ]);
  assert.equal(analysis.total_rows, 3);
  assert.equal(analysis.distinct_brands, 2);
  assert.equal(analysis.missing.family, 1);
});

test("new brand receives stronger coverage bonus than saturated brand", () => {
  const analysis = analyzeCatalogGaps([{ brand: "A" }, { brand: "A" }, { brand: "A" }, { brand: "B" }]);
  assert.equal(brandGapBonus({ brand: "C" }, analysis), 12);
  assert.equal(brandGapBonus({ brand: "B" }, analysis), 6);
  assert.equal(brandGapBonus({ brand: "A" }, analysis), 0);
  assert.ok(scoreCandidate({ brand: "C", priority: 50 }, "NEW", analysis) > scoreCandidate({ brand: "A", priority: 50 }, "NEW", analysis));
});

test("serializable report removes Map internals", () => {
  const report = serializableGapReport(analyzeCatalogGaps([{ brand: "A" }]));
  assert.equal("brandCounts" in report, false);
  assert.deepEqual(report.brands, [{ key: "a", count: 1 }]);
});
