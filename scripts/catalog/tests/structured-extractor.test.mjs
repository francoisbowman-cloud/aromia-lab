import test from "node:test";
import assert from "node:assert/strict";
import { extractJsonLd, productJsonLd, extractExplicitNotes, extractExplicitMetadata, extractPageEvidence, stripHtml } from "../structured-extractor.mjs";

test("extracts Product JSON-LD without executing scripts", () => {
  const html = `<html><script type="application/ld+json">{"@type":"Product","name":"Amber Moon","brand":{"@type":"Brand","name":"Maison Test"},"description":"Warm amber"}</script></html>`;
  assert.equal(extractJsonLd(html).length, 1);
  assert.equal(productJsonLd(html).name, "Amber Moon");
});

test("explicit top-heart-base labels become PYRAMID", () => {
  const html = `<div>Top notes: Bergamot, Lemon Heart notes: Iris, Jasmine Base notes: Cedar, Musk Ingredients:</div>`;
  const notes = extractExplicitNotes(html);
  assert.equal(notes.structure, "PYRAMID");
  assert.match(notes.top_notes, /Bergamot/);
  assert.match(notes.middle_notes, /Iris/);
  assert.match(notes.base_notes, /Cedar/);
});

test("flat notes remain FLAT and are never promoted into a pyramid", () => {
  const notes = extractExplicitNotes(`<p>Fragrance notes: Juniper berry, cedar, tonka bean, jasmine Details</p>`);
  assert.equal(notes.structure, "FLAT");
  assert.equal(notes.top_notes, "");
  assert.match(notes.accords, /Juniper/);
});

test("absence of explicit labels stays UNKNOWN", () => {
  const notes = extractExplicitNotes(`<p>A mysterious woody fragrance inspired by a night in Paris.</p>`);
  assert.equal(notes.structure, "UNKNOWN");
});

test("Eau de Parfum is EDP, never generic Parfum", () => {
  const html = `<meta property="og:title" content="Amber Moon Eau de Parfum"><p>Related: Amber Moon Parfum</p>`;
  assert.equal(extractExplicitMetadata(html, "https://brand.test/products/amber-moon-eau-de-parfum").concentration, "EDP");
});

test("explicit audience and launch metadata are extracted without guessing", () => {
  const html = `<meta property="og:title" content="Amber Moon Eau de Toilette for Men"><meta property="og:description" content="Launched in 2022. Olfactory family: Woody Aromatic">`;
  const meta = extractExplicitMetadata(html, "https://brand.test/men/amber-moon");
  assert.equal(meta.gender, "masculino");
  assert.equal(meta.concentration, "EDT");
  assert.equal(meta.launch_year, "2022");
  assert.equal(meta.family, "Woody Aromatic");
});

test("page evidence combines meta, JSON-LD and explicit notes conservatively", () => {
  const html = `<meta property="og:title" content="Amber Moon Eau de Parfum"><script type="application/ld+json">{"@type":"Product","name":"Amber Moon","brand":{"name":"Maison Test"}}</script><main>Top: Bergamot Heart: Iris Base: Cedar Ingredients:</main>`;
  const row = extractPageEvidence(html, "https://brand.test/products/amber-moon");
  assert.equal(row.source_url, "https://brand.test/products/amber-moon");
  assert.equal(row.structured_brand, "Maison Test");
  assert.equal(row.notes_structure, "PYRAMID");
  assert.equal(row.concentration, "EDP");
  assert.equal(stripHtml("<b>Hello</b> &amp; world"), "Hello & world");
});
