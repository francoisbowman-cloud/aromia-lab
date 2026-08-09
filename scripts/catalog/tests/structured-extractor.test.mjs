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

test("explicit multilingual note labels remain structured, never inferred", () => {
  const french = extractExplicitNotes(`<div>Notes de tête : Bergamote Notes de cœur : Jasmin Notes de fond : Cèdre Ingrédients:</div>`);
  assert.equal(french.structure, "PYRAMID");
  assert.match(french.top_notes, /Bergamote/);
  const spanish = extractExplicitNotes(`<div>Notas de salida: Limón Notas de corazón: Rosa Notas de fondo: Almizcle Ingredientes:</div>`);
  assert.equal(spanish.structure, "PYRAMID");
  assert.match(spanish.base_notes, /Almizcle/);
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

test("hyphenated official URL is explicit concentration evidence", () => {
  assert.equal(extractExplicitMetadata(`<meta property="og:title" content="Amber Moon">`, "https://brand.test/fragrance/amber-moon-eau-de-parfum").concentration, "EDP");
  assert.equal(extractExplicitMetadata(`<meta property="og:title" content="Amber Moon">`, "https://brand.test/fragrance/amber-moon-eau-de-toilette").concentration, "EDT");
});

test("explicit audience and launch metadata are extracted without guessing", () => {
  const html = `<meta property="og:title" content="Amber Moon Eau de Toilette for Men"><meta property="og:description" content="Launched in 2022. Olfactory family: Woody Aromatic">`;
  const meta = extractExplicitMetadata(html, "https://brand.test/men/amber-moon");
  assert.equal(meta.gender, "masculino");
  assert.equal(meta.concentration, "EDT");
  assert.equal(meta.launch_year, "2022");
  assert.equal(meta.family, "Woody Aromatic");
});

test("Product JSON-LD audience is accepted as explicit gender evidence", () => {
  const html = `<script type="application/ld+json">{"@type":"Product","name":"Amber Moon","audience":{"@type":"PeopleAudience","audienceType":"Women"}}</script><meta property="og:title" content="Amber Moon Eau de Parfum">`;
  const row = extractPageEvidence(html, "https://brand.test/amber-moon-eau-de-parfum");
  assert.equal(row.gender, "femenino");
});

test("female and unisex cues remain explicit and separate", () => {
  const female = extractExplicitMetadata(`<meta property="og:title" content="Rose Sky Eau de Parfum for Women">`, "https://brand.test/women/rose-sky");
  const unisex = extractExplicitMetadata(`<meta property="og:title" content="Shared Woods Eau de Parfum"><meta property="og:description" content="A gender-neutral fragrance">`, "https://brand.test/shared-woods");
  assert.equal(female.gender, "femenino");
  assert.equal(unisex.gender, "unisex");
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
