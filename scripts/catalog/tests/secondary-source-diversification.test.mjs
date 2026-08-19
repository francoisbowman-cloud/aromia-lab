import test from "node:test";
import assert from "node:assert/strict";
import { extractNotes, isTrustedSecondaryUrl, parseSearchLinks } from "../secondary-discovery.mjs";

test("trusted secondary allowlist accepts Parfumo and Basenotes but rejects arbitrary hosts", () => {
  assert.equal(isTrustedSecondaryUrl("https://www.parfumo.com/Perfumes/Xerjoff/torino21"), true);
  assert.equal(isTrustedSecondaryUrl("https://basenotes.com/fragrances/join-the-club-torino21-by-xerjoff.26186193"), true);
  assert.equal(isTrustedSecondaryUrl("https://example.com/torino21"), false);
});

test("search link parser discovers governed alternatives in addition to Fragrantica", () => {
  const html = '<a href="https://www.parfumo.com/Perfumes/Xerjoff/torino21">P</a><a href="https://basenotes.com/fragrances/join-the-club-torino21-by-xerjoff.26186193">B</a>';
  const links = parseSearchLinks(html);
  assert.equal(links.length, 2);
  assert.match(links[0], /parfumo/);
  assert.match(links[1], /basenotes/);
});

test("Basenotes-style Head/Heart/Base text yields a complete pyramid", () => {
  const parsed = extractNotes("Torino21 fragrance notes Head mint; lemon; basil; thyme; Heart blackcurrant; jasmine; lavender; rosemary; Base musk; verbena; Latest Reviews");
  assert.equal(parsed.notes_structure, "PYRAMID");
  assert.equal(parsed.top_notes, "mint;lemon;basil;thyme");
  assert.equal(parsed.middle_notes, "blackcurrant;jasmine;lavender;rosemary");
  assert.equal(parsed.base_notes, "musk;verbena");
});

test("Parfumo-style fragrance pyramid yields a complete pyramid", () => {
  const parsed = extractNotes("Fragrance Pyramid Top Notes Top Notes Mint; Lemon; Basil; Thyme; Heart Notes Heart Notes Blackcurrant; Jasmine; Lavender; Rosemary; Base Notes Base Notes Musk; Vervain; Ratings");
  assert.equal(parsed.notes_structure, "PYRAMID");
  assert.equal(parsed.top_notes, "Mint;Lemon;Basil;Thyme");
  assert.equal(parsed.middle_notes, "Blackcurrant;Jasmine;Lavender;Rosemary");
  assert.equal(parsed.base_notes, "Musk;Vervain");
});
