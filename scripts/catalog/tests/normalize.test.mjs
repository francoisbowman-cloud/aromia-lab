import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { normalizeBatch } from "../normalize.mjs";

function tmpCsv(content) {
  const dir = mkdtempSync(join(tmpdir(), "aromia-catalog-test-"));
  const file = join(dir, "batch.csv");
  writeFileSync(file, content, "utf-8");
  return file;
}

const HEADER =
  "id,slug,brand,name,concentration,gender,family,subfamily,launch_year,perfumer,country,description,top_notes,heart_notes,base_notes,accords,season,occasion,longevity,sillage,price_segment,amazon_url,source_url,image_url,image_source,affiliate_status,source_verified,data_confidence,visual_quality,review_status,seo_title,seo_description,status,created_at,updated_at";

function row(overrides = {}) {
  const base = {
    id: "cw-001", slug: "", brand: "dior", name: "Sauvage", concentration: "eau de toilette",
    gender: " Male ", family: "amaderada-aromatica", subfamily: "", launch_year: "2015",
    perfumer: "", country: "", description: "", topNotes: "bergamota;bergamota;pimienta",
    heartNotes: "geranio", baseNotes: "ambroxan", accords: "", season: "", occasion: "",
    longevity: "", sillage: "", price: "", amazon: "", source: "https://source.example/x",
    image: "https://img.example/x.jpg", imgSrc: "", affiliate: "", verified: "", confidence: "",
    quality: "", review: "", seoTitle: "", seoDesc: "", status: "draft", createdAt: "", updatedAt: "",
  };
  const f = { ...base, ...overrides };
  return [
    f.id, f.slug, f.brand, f.name, f.concentration, f.gender, f.family, f.subfamily, f.launch_year,
    f.perfumer, f.country, f.description, f.topNotes, f.heartNotes, f.baseNotes, f.accords, f.season,
    f.occasion, f.longevity, f.sillage, f.price, f.amazon, f.source, f.image, f.imgSrc, f.affiliate,
    f.verified, f.confidence, f.quality, f.review, f.seoTitle, f.seoDesc, f.status, f.createdAt, f.updatedAt,
  ].join(",");
}

test("genera slug desde brand+name+concentration cuando viene vacío", () => {
  const file = tmpCsv(`${HEADER}\n${row()}\n`);
  const { normalizedRows } = normalizeBatch(file);
  assert.equal(normalizedRows[0].slug, "dior-sauvage-edt");
});

test("no sobrescribe un slug ya informado", () => {
  const file = tmpCsv(`${HEADER}\n${row({ slug: "mi-slug-custom" })}\n`);
  const { normalizedRows } = normalizeBatch(file);
  assert.equal(normalizedRows[0].slug, "mi-slug-custom");
});

test("dos slugs generados en el mismo batch no colisionan", () => {
  const file = tmpCsv(`${HEADER}\n${row({ id: "a" })}\n${row({ id: "b" })}\n`);
  const { normalizedRows } = normalizeBatch(file);
  assert.notEqual(normalizedRows[0].slug, normalizedRows[1].slug);
});

test("alias de concentración conocido se normaliza a forma canónica", () => {
  const file = tmpCsv(`${HEADER}\n${row({ concentration: "eau de toilette" })}\n`);
  const { normalizedRows } = normalizeBatch(file);
  assert.equal(normalizedRows[0].concentration, "EDT");
});

test("concentración desconocida se conserva tal cual (no se inventa)", () => {
  const file = tmpCsv(`${HEADER}\n${row({ concentration: "mystery-juice" })}\n`);
  const { normalizedRows, trace } = normalizeBatch(file);
  assert.equal(normalizedRows[0].concentration, "mystery-juice");
  assert.ok(trace.changes[0].fields.some((f) => f.reason.includes("no reconocida")));
});

test("family/subfamily NO se title-casean (convención lowercase-hyphenated de Aromia)", () => {
  const file = tmpCsv(`${HEADER}\n${row({ family: "AMADERADA-AROMATICA" })}\n`);
  const { normalizedRows } = normalizeBatch(file);
  assert.equal(normalizedRows[0].family, "AMADERADA-AROMATICA");
});

test("brand en minúsculas-todo se re-capitaliza; mixed-case se conserva intacto", () => {
  const file = tmpCsv(`${HEADER}\n${row({ brand: "dior" })}\n${row({ id: "b", brand: "YSL" })}\n`);
  const { normalizedRows } = normalizeBatch(file);
  assert.equal(normalizedRows[0].brand, "Dior");
  assert.equal(normalizedRows[1].brand, "YSL");
});

test("items duplicados dentro de una lista se remueven", () => {
  const file = tmpCsv(`${HEADER}\n${row({ topNotes: "bergamota;bergamota;pimienta" })}\n`);
  const { normalizedRows } = normalizeBatch(file);
  assert.equal(normalizedRows[0].top_notes, "bergamota;pimienta");
});

test("created_at/updated_at ausentes se completan con timestamp de procesamiento", () => {
  const file = tmpCsv(`${HEADER}\n${row()}\n`);
  const { normalizedRows } = normalizeBatch(file);
  assert.ok(normalizedRows[0].created_at.length > 0);
  assert.equal(normalizedRows[0].updated_at, normalizedRows[0].created_at);
});

test("cada cambio queda trazado en el trace con from/to/reason", () => {
  const file = tmpCsv(`${HEADER}\n${row({ brand: "dior" })}\n`);
  const { trace } = normalizeBatch(file);
  assert.equal(trace.rowsChanged, 1);
  assert.ok(trace.changes[0].fields.every((f) => "from" in f && "to" in f && "reason" in f));
});
