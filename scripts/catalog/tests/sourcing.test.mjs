import test from "node:test";
import assert from "node:assert/strict";
import { buildSourcingTargets, assessSourcingPool } from "../sourcing.mjs";

const current = [
  { marca: "A", nombre: "One EDT", genero: "masculino", categoria_precio: "medio" },
  { marca: "B", nombre: "Two EDP", genero: "masculino", categoria_precio: "premium" },
  { marca: "C", nombre: "Three EDP", genero: "femenino", categoria_precio: "lujo" },
  { marca: "D", nombre: "Four EDP", genero: "masculino", categoria_precio: "premium" },
  { marca: "E", nombre: "Five EDP", genero: "femenino", categoria_precio: "medio" },
  { marca: "F", nombre: "Six EDP", genero: "masculino", categoria_precio: "premium" },
  { marca: "G", nombre: "Seven EDP", genero: "masculino", categoria_precio: "premium" },
  { marca: "H", nombre: "Eight EDP", genero: "masculino", categoria_precio: "premium" },
];

test("zero-coverage price segment becomes top sourcing target", () => {
  const targets = buildSourcingTargets(current);
  const economical = targets.find((x) => x.dimension === "price_segment" && x.value === "económico");
  assert.ok(economical);
  assert.equal(economical.priority, 100);
  assert.equal(economical.reason, "ZERO_COVERAGE");
});

test("gender imbalance generates distribution target", () => {
  const targets = buildSourcingTargets(current);
  assert.ok(targets.some((x) => x.dimension === "gender" && x.value === "unisex" && x.reason === "DISTRIBUTION_GAP"));
});

test("pool assessment proves whether a sourcing target is actually covered", () => {
  const targets = [{ dimension: "price_segment", value: "económico", priority: 100, reason: "ZERO_COVERAGE" }];
  const assessment = assessSourcingPool([{ price_segment: "económico" }, { price_segment: "medio" }], targets);
  assert.equal(assessment[0].candidate_count, 1);
  assert.equal(assessment[0].satisfied_by_pool, true);
});
