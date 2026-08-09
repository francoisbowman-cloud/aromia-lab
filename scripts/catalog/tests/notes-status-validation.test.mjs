import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateBatch } from "../validate.mjs";

function csvRow(notesStatus, top = "", middle = "", base = "", accords = "") {
  return [
    "id,brand,name,concentration,gender,source_url,status,notes_status,top_notes,middle_notes,base_notes,accords",
    `x,Brand,Alpha,EDP,unisex,https://brand.example/alpha,draft,${notesStatus},${top},${middle},${base},${accords}`,
    "",
  ].join("\n");
}

test("confirmed source_does_not_publish is valid with UNKNOWN note structure", () => {
  const dir = mkdtempSync(join(tmpdir(), "aromia-notes-status-"));
  const path = join(dir, "notes-unpublished.csv");
  try {
    writeFileSync(path, csvRow("source_does_not_publish"), "utf-8");
    const { report } = validateBatch(path);
    assert.equal(report.errorRows, 0);
    assert.equal(report.rows[0].noteStructure, "UNKNOWN");
    assert.equal(report.rows[0].notesStatus, "source_does_not_publish");
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("unresolved UNKNOWN notes still fail", () => {
  const dir = mkdtempSync(join(tmpdir(), "aromia-notes-status-"));
  const path = join(dir, "notes-unresolved.csv");
  try {
    writeFileSync(path, csvRow("unresolved"), "utf-8");
    const { report } = validateBatch(path);
    assert.equal(report.errorRows, 1);
    assert.ok(report.rows[0].issues.some((i) => i.code === "no_notes_information"));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("source_does_not_publish cannot coexist with published notes", () => {
  const dir = mkdtempSync(join(tmpdir(), "aromia-notes-status-"));
  const path = join(dir, "notes-conflict.csv");
  try {
    writeFileSync(path, csvRow("source_does_not_publish", "bergamot"), "utf-8");
    const { report } = validateBatch(path);
    assert.equal(report.errorRows, 1);
    assert.ok(report.rows[0].issues.some((i) => i.code === "notes_status_conflict"));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
