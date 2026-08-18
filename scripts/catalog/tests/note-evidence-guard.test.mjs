import test from "node:test";
import assert from "node:assert/strict";
import { isPlausibleNoteValue, sanitizeExtractedNotes } from "../note-evidence-guard.mjs";
import { requireVerifiedNotesUnavailability, sanitizeReadinessEvidence } from "../expansion-enrich-v2.mjs";
import { extractExplicitNotes } from "../structured-extractor.mjs";

test("rejects Gucci-style prose captured between note labels", () => {
  assert.equal(isPlausibleNoteValue("of Lemon and piquant Pink Pepper leads into a"), false);
  assert.equal(isPlausibleNoteValue("Patchouli reveals its rich, leathery and woody facets. Here, the scent is presented in a three-piece gift set"), false);
});

test("rejects UI and performance copy masquerading as notes", () => {
  assert.equal(isPlausibleNoteValue("Scroll to the top"), false);
  assert.equal(isPlausibleNoteValue("Musks Perfume sillage Middle volume but long lasting"), false);
});

test("rejects a product title captured as a note", () => {
  assert.equal(isPlausibleNoteValue("Fahrenheit men", { title: "Fahrenheit Eau de Toilette - Men" }), false);
});

test("rejects embedded tier labels inside a captured tier", () => {
  assert.equal(isPlausibleNoteValue("abedul; ámbar; benjuí; las Notas de Fondo son madera de gaiac; vetiver"), false);
});

test("rejects truncated residue from a shorter tier-label prefix", () => {
  assert.equal(isPlausibleNoteValue("n Salbei-Essenz aus Frankreich, Kardamom-Essenz aus Guatemala"), false);
});

test("localized tier parser prefers Kopfnoten over the shorter Kopfnote prefix", () => {
  const notes = extractExplicitNotes(`
    <h4>Kopfnoten</h4><p>Salbei-Essenz aus Frankreich, Kardamom-Essenz aus Guatemala</p>
    <h4>Herznoten</h4><p>Narzissen-Absolue, Vetiver-Essenz</p>
    <h4>Basisnoten</h4><p>Zedernholz-Essenz, Sandelholz-Essenz</p>
    <h4>Ingredients</h4>
  `);
  assert.equal(notes.structure, "PYRAMID");
  assert.equal(notes.top_notes, "Salbei-Essenz aus Frankreich, Kardamom-Essenz aus Guatemala");
  assert.equal(notes.middle_notes, "Narzissen-Absolue, Vetiver-Essenz");
  assert.equal(notes.base_notes, "Zedernholz-Essenz, Sandelholz-Essenz");
});

test("accepts concise note names and explicit lists", () => {
  assert.equal(isPlausibleNoteValue("Green Pear"), true);
  assert.equal(isPlausibleNoteValue("Bergamot, lemon, pink pepper"), true);
  assert.equal(isPlausibleNoteValue("madera de gaiac; vetiver; cedro; almizcle; musgo; pachulí; haba tonka; vainilla"), true);
});

test("sanitization recomputes the structure fail-closed", () => {
  const result = sanitizeExtractedNotes({
    title: "Example Eau de Parfum",
    notes_structure: "PYRAMID",
    top_notes: "Scroll to the top",
    middle_notes: "Rose, jasmine",
    base_notes: "A vanilla note envelops all these elements with a soft and spicy accord in the",
    accords: "",
  });
  assert.equal(result.top_notes, "");
  assert.equal(result.middle_notes, "Rose, jasmine");
  assert.equal(result.base_notes, "");
  assert.equal(result.notes_structure, "PARTIAL");
});

test("readiness boundary re-sanitizes note evidence added by secondary enrichment", () => {
  const result = sanitizeReadinessEvidence({
    brand: "Orto Parisi",
    name: "Terroni",
    page_title: "Terroni Parfum",
    top_notes: "",
    middle_notes: "abedul; ámbar; benjuí; las Notas de Fondo son madera de gaiac; vetiver; cedro",
    base_notes: "madera de gaiac; vetiver; cedro; almizcle",
    accords: "",
    notes_structure: "PARTIAL",
  });
  assert.equal(result.middle_notes, "");
  assert.equal(result.base_notes, "madera de gaiac; vetiver; cedro; almizcle");
  assert.equal(result.notes_structure, "PARTIAL");
});

test("UNKNOWN extraction cannot auto-claim that the source publishes no notes", () => {
  const guarded = requireVerifiedNotesUnavailability({
    notes_structure: "UNKNOWN",
    source_does_not_publish_notes: "true",
  });
  assert.equal(guarded.source_does_not_publish_notes, "false");
  assert.equal(guarded.notes_unavailability_guard, "unverified_claim_downgraded_to_unresolved");
});

test("explicitly verified note unavailability remains supported", () => {
  const guarded = requireVerifiedNotesUnavailability({
    notes_structure: "UNKNOWN",
    source_does_not_publish_notes: "true",
    notes_unavailability_verified: "true",
  });
  assert.equal(guarded.source_does_not_publish_notes, "true");
});
