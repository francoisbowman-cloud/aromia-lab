import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { deduplicateBatch } from "../deduplicate.mjs";

function tmpCsv(content) {
  const dir = mkdtempSync(join(tmpdir(), "aromia-catalog-test-"));
  const file = join(dir, "batch.normalized.csv");
  writeFileSync(file, content, "utf-8");
  return file;
}

const HEADER = "id,slug,brand,name,concentration,image_url";

function row(id, slug, brand, name, concentration, imageUrl) {
  return [id, slug, brand, name, concentration, imageUrl].join(",");
}

test("Sauvage EDT / EDP / Parfum / Elixir son productos distintos, no se fusionan", () => {
  const file = tmpCsv(
    `${HEADER}\n` +
      row("1", "sauvage-edt", "Dior", "Sauvage", "EDT", "https://x/1.jpg") + "\n" +
      row("2", "sauvage-edp", "Dior", "Sauvage", "EDP", "https://x/2.jpg") + "\n" +
      row("3", "sauvage-parfum", "Dior", "Sauvage", "Parfum", "https://x/3.jpg") + "\n" +
      row("4", "sauvage-elixir", "Dior", "Sauvage", "Elixir", "https://x/4.jpg") + "\n"
  );
  const { summary } = deduplicateBatch(file);
  assert.equal(summary.kept, 4);
  assert.equal(summary.needsReviewConflicts, 0);
  assert.equal(summary.rejectedExactDuplicates, 0);
  assert.equal(summary.variantFamiliesDetected, 1);
  assert.deepEqual(summary.variantConflicts[0].concentrations, ["EDP", "EDT", "Elixir", "Parfum"]);
});

test("fila 100% idéntica (salvo id) se rechaza automáticamente (reject_exact_duplicate)", () => {
  const file = tmpCsv(
    `${HEADER}\n` +
      row("1", "sauvage-edt", "Dior", "Sauvage", "EDT", "https://x/1.jpg") + "\n" +
      row("2", "sauvage-edt", "Dior", "Sauvage", "EDT", "https://x/1.jpg") + "\n"
  );
  const { summary } = deduplicateBatch(file);
  assert.equal(summary.rejectedExactDuplicates, 1);
  assert.equal(summary.decisions[1].decision, "reject_exact_duplicate");
});

test("misma brand+name+concentration con datos distintos -> needs_review_conflict, no se auto-resuelve", () => {
  const file = tmpCsv(
    `${HEADER}\n` +
      row("1", "sauvage-edt", "Dior", "Sauvage", "EDT", "https://x/1.jpg") + "\n" +
      row("2", "sauvage-edt-2", "Dior", "Sauvage", "EDT", "https://x/DIFFERENT.jpg") + "\n"
  );
  const { summary } = deduplicateBatch(file);
  assert.equal(summary.decisions[0].decision, "keep");
  assert.equal(summary.decisions[1].decision, "needs_review_conflict");
  assert.equal(summary.needsReviewConflicts, 1);
});

test("fila única (sin duplicados) -> keep", () => {
  const file = tmpCsv(`${HEADER}\n${row("1", "unico", "Chanel", "Bleu", "EDT", "https://x/1.jpg")}\n`);
  const { summary } = deduplicateBatch(file);
  assert.equal(summary.decisions[0].decision, "keep");
});
