import test from "node:test";
import assert from "node:assert/strict";
import { identityEvidence } from "../expansion-harvest-v2.mjs";

function evidence(title, structured = "") {
  return { title, structured_product_name: structured };
}

test("rejects Gucci Guilty Pour Homme when source is Guilty Pour Femme", () => {
  const result = identityEvidence(
    { brand: "Gucci", name: "Guilty Pour Homme" },
    evidence("Gucci Guilty Pour Femme Gift Set", "Gucci Guilty Pour Femme"),
    "https://www.gucci.com/beauty/gucci-guilty-pour-femme-gift-set",
  );
  assert.equal(result.confirmed, false);
  assert.equal(result.conflictingGender, true);
});

test("rejects nearby Dolce & Gabbana product when candidate is K", () => {
  const result = identityEvidence(
    { brand: "Dolce & Gabbana", name: "K by Dolce & Gabbana" },
    evidence("Dolce&Gabbana Devotion Eau de Parfum Refill", "Devotion Eau de Parfum"),
    "https://www.dolcegabbana.com/beauty/devotion-eau-de-parfum-refill",
  );
  assert.equal(result.confirmed, false);
  assert.equal(result.productHits.includes("k"), false);
});

test("rejects Light Blue generic page for Light Blue Forever Pour Homme", () => {
  const result = identityEvidence(
    { brand: "Dolce & Gabbana", name: "Light Blue Forever Pour Homme" },
    evidence("Light Blue Eau de Parfum", "Light Blue Eau de Parfum"),
    "https://www.dolcegabbana.com/beauty/light-blue-eau-de-parfum",
  );
  assert.equal(result.confirmed, false);
  assert.ok(result.coverage < 0.8);
});

test("accepts exact product identity on an official product page", () => {
  const result = identityEvidence(
    { brand: "Tom Ford", name: "Noir Extreme" },
    evidence("Noir Extreme Eau de Parfum | TOM FORD", "Noir Extreme Eau de Parfum"),
    "https://www.tomfordbeauty.com/products/noir-extreme-eau-de-parfum",
  );
  assert.equal(result.confirmed, true);
  assert.equal(result.coverage, 1);
});

test("single-letter product identity must match as a whole word", () => {
  const good = identityEvidence(
    { brand: "Dolce & Gabbana", name: "K by Dolce & Gabbana" },
    evidence("K by Dolce&Gabbana Eau de Parfum", "K by Dolce&Gabbana"),
    "https://www.dolcegabbana.com/beauty/k-by-dolce-gabbana",
  );
  assert.equal(good.confirmed, true);
});
