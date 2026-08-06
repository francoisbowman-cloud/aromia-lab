#!/usr/bin/env node
// Ajuste puntual de requires_human_review sobre los 5 reportes YA generados
// por scripts/audit-image-pilot.mjs (corrida real del 2026-08-05).
//
// Este script NUNCA llama a la API de OpenAI — es validación local pura
// sobre reports/image-audits/*.json existentes.
//
// Por instrucción explícita de Brey (2026-08-05): no se tocan los
// resultados visuales originales de los 5 JSON (el objeto "result", ni los
// campos operativos que ya escribió la corrida real: traffic_light,
// requires_human_review, review_reason). Se agrega la decisión operativa
// nueva como una capa separada (`operational_review`) en cada archivo, y un
// resumen agregado (`operational_review_v2`) en _summary.json — nada se
// sobreescribe.
//
// Este script NUNCA:
//   - escribe en data/image-inventory.csv (el oficial);
//   - toca PERFUMES_INITIAL_50.csv (raíz ni apps/api/data/);
//   - invoca scripts/images/optimize.mjs;
//   - modifica imagen_url en ningún lado;
//   - hace requests de red.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPTS_DIR = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = join(SCRIPTS_DIR, "..");
const CONFIG_PATH = join(REPO_ROOT, "config", "image-audit-pilot.json");
const REPORTS_DIR = join(REPO_ROOT, "reports", "image-audits");
const SUMMARY_PATH = join(REPORTS_DIR, "_summary.json");

function log(msg) {
  process.stdout.write(msg + "\n");
}

function loadJson(path, label) {
  if (!existsSync(path)) {
    process.stderr.write(`✖ ${label} no encontrado en ${path}\n`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(path, "utf-8"));
}

const config = loadJson(CONFIG_PATH, "config/image-audit-pilot.json");

function normalizeText(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

// Variantes de concentración que puede mencionar el modelo, independientes
// del "EDP"/"EDT" que ya trae el nombre del perfume en config.
const VARIANT_DEFS = [
  { code: "edt", patterns: [/\bedt\b/i, /eau de toilette/i] },
  { code: "edp", patterns: [/\bedp\b/i, /eau de parfum/i] },
  { code: "extrait", patterns: [/\bextrait\b/i, /extrait de parfum/i] },
  { code: "elixir", patterns: [/\belixir\b/i] },
];

function getExpectedVariantCode(perfumeName) {
  if (/\bedp\b/i.test(perfumeName)) return "edp";
  if (/\bedt\b/i.test(perfumeName)) return "edt";
  if (/extrait/i.test(perfumeName)) return "extrait";
  if (/elixir/i.test(perfumeName)) return "elixir";
  return null; // sin variante explícita en el nombre (ej. Aventus, Erba Pura)
}

function mentionedVariantCodes(blob) {
  return VARIANT_DEFS.filter((d) => d.patterns.some((p) => p.test(blob))).map((d) => d.code);
}

// Frases que indican duda explícita de identidad/variante persistente, más
// allá de mencionar simplemente un término de concentración.
const EXPLICIT_DOUBT_PATTERNS = [
  /no se puede (confirmar|verificar|determinar)/i,
  /no (es posible|queda claro) determinar/i,
  /persiste (la )?duda/i,
  /no est(a|á) claro/i,
];

function buildBlob(record) {
  const r = record.result;
  const parts = [
    r.classification_reason,
    ...r.evaluations.map((e) => e.finding),
    ...r.specific_answers.flatMap((qa) => [qa.question, qa.answer]),
    r.recommendation,
    ...(r.risk_flags ?? []),
  ];
  return normalizeText(parts.join(" \n "));
}

function computeOperationalReview(perfumeCfg, record) {
  const expectedCode = getExpectedVariantCode(perfumeCfg.name);
  const blob = buildBlob(record);
  const mentioned = mentionedVariantCodes(blob);

  // Si el nombre no trae variante explícita (Aventus, Erba Pura), asumimos
  // EDP como default comercial del catálogo Aromia para ese perfume — solo
  // marcamos incompatibilidad si aparece un término DISTINTO de "edp".
  const incompatibleCodes = expectedCode
    ? mentioned.filter((c) => c !== expectedCode)
    : mentioned.filter((c) => c !== "edp");

  const variantTermMismatch = incompatibleCodes.length > 0;
  const explicitDoubtPhrase = EXPLICIT_DOUBT_PATTERNS.some((p) => p.test(blob));

  const classification = record.result.classification;
  const approvalWithDoubt =
    (classification === "A" || classification === "B") && (variantTermMismatch || explicitDoubtPhrase);

  // Conserva las razones ya detectadas por la corrida real (low_confidence /
  // variant_unverified) — no las descarta, las suma.
  const reasons = [];
  if (record.review_reason) reasons.push(record.review_reason);
  if (variantTermMismatch) {
    reasons.push(
      `variant_term_mismatch:${incompatibleCodes.join(",")}_vs_expected_${expectedCode ?? "edp(implicito)"}`
    );
  }
  if (explicitDoubtPhrase) reasons.push("explicit_doubt_phrase");
  if (approvalWithDoubt) reasons.push("approved_classification_with_persisting_variant_doubt");

  const requiresHumanReview = record.requires_human_review || variantTermMismatch || approvalWithDoubt;

  // Semáforo operativo: si hay duda de variante sobre una clasificación
  // aprobatoria (A/B), el semáforo pasa a amarillo aunque el semáforo
  // visual original (por clasificación) fuera verde — refleja que no está
  // listo para aprobación automática, sin decir que la imagen está mal.
  let trafficLightOverride = record.traffic_light;
  if (approvalWithDoubt && record.traffic_light === "verde") {
    trafficLightOverride = "amarillo";
  }

  return {
    generated_by: "scripts/reconcile-image-audit-review-flags.mjs",
    generated_at_note: "capa de decisión operativa v2 — no reemplaza result ni los campos originales de la corrida real",
    expected_variant_code: expectedCode,
    mentioned_variant_codes: mentioned,
    incompatible_variant_codes: incompatibleCodes,
    variant_term_mismatch: variantTermMismatch,
    explicit_doubt_phrase: explicitDoubtPhrase,
    approved_classification_with_variant_doubt: approvalWithDoubt,
    requires_human_review: requiresHumanReview,
    review_reasons: reasons,
    traffic_light: trafficLightOverride,
  };
}

function main() {
  const results = [];
  for (const perfumeCfg of config.perfumes) {
    const path = join(REPORTS_DIR, `${perfumeCfg.slug}.json`);
    const record = loadJson(path, `reports/image-audits/${perfumeCfg.slug}.json`);

    const operationalReview = computeOperationalReview(perfumeCfg, record);
    const updated = { ...record, operational_review: operationalReview };

    writeFileSync(path, JSON.stringify(updated, null, 2) + "\n");
    log(
      `${perfumeCfg.slug}: requires_human_review ${record.requires_human_review} -> ${operationalReview.requires_human_review}` +
        (operationalReview.review_reasons.length ? ` [${operationalReview.review_reasons.join(", ")}]` : "")
    );
    results.push({ slug: perfumeCfg.slug, operationalReview });
  }

  const summary = loadJson(SUMMARY_PATH, "reports/image-audits/_summary.json");
  summary.operational_review_v2 = {
    generated_by: "scripts/reconcile-image-audit-review-flags.mjs",
    note:
      "Capa operativa agregada tras corrida real — no modifica classifications/traffic_lights originales de arriba (esos siguen reflejando la salida cruda de la API). requires_human_review y traffic_light acá son la fuente operativa vigente.",
    requires_human_review: Object.fromEntries(
      results.map((r) => [r.slug, r.operationalReview.requires_human_review])
    ),
    review_reasons: Object.fromEntries(results.map((r) => [r.slug, r.operationalReview.review_reasons])),
    traffic_light: Object.fromEntries(results.map((r) => [r.slug, r.operationalReview.traffic_light])),
    cowork_report: null,
    cowork_report_note: "pendiente — no consolidar hasta recibir el informe real de Cowork (Paso 2 del plan).",
  };
  writeFileSync(SUMMARY_PATH, JSON.stringify(summary, null, 2) + "\n");
  log("\n_summary.json: agregada clave operational_review_v2 (nada más modificado).");
}

main();
