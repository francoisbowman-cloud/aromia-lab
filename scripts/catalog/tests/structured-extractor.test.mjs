import test from "node:test";
import assert from "node:assert/strict";
import { extractJsonLd, productJsonLd, extractExplicitNotes, extractPageEvidence, stripHtml } from "../structured-extractor.mjs";

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

test("page evidence combines meta, JSON-LD and explicit notes conservatively", () => {
  const html = `<meta property="og:title" content="Amber Moon Eau de Parfum"><script type="application/ld+json">{"@type":"Product","name":"Amber Moon","brand":{"name":"Maison Test"}}</script><main>Top: Bergamot Heart: Iris Base: Cedar Ingredients:</main>`;
  const row = extractPageEvidence(html, "https://brand.test/products/amber-moon");
  assert.equal(row.source_url, "https://brand.test/products/amber-moon");
  assert.equal(row.structured_brand, "Maison Test");
  assert.equal(row.notes_structure, "PYRAMID");
  assert.equal(stripHtml("<b>Hello</b> &amp; world"), "Hello & world");
});
