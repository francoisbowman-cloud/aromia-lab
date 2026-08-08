#!/usr/bin/env node
// Consolidación Fase 2 — Paso 5. Une, en una capa NUEVA y separada, tres
// fuentes que ya existen en el repo:
//   1. Los 5 reportes de reports/image-audits/<slug>.json (result +
//      operational_review), producidos por la corrida real del piloto
//      (scripts/audit-image-pilot.mjs) y su reconciliación local
//      (scripts/reconcile-image-audit-review-flags.mjs).
//   2. reports/image-audits/_summary.json (operational_review_v2).
//   3. El resumen real de Cowork (license_status, dimensiones, notas),
//      leído de data/image-inventory.csv tal como está hoy en el
//      working tree — Cowork ya lo editó ahí, sin commit; este script
//      SOLO LEE ese archivo, nunca lo escribe.
//
// No modifica ninguno de los archivos de entrada. Genera:
//   - reports/image-audits/consolidated-pilot.json
//   - reports/image-audits/consolidated-pilot.md
//   - data/image-inventory.audit-proposal.csv (propuesta, reescrita con la
//     decisión consolidada — el oficial data/image-inventory.csv NO se toca)
//
// No llama a la API de OpenAI. No invoca scripts/images/optimize.mjs. No
// modifica imagen_url en ningún lado.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseCsv } from "csv-parse/sync";
import { stringify as stringifyCsv } from "csv-stringify/sync";

const SCRIPTS_DIR = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = join(SCRIPTS_DIR, "..");
const CONFIG_PATH = join(REPO_ROOT, "config", "image-audit-pilot.json");
const REPORTS_DIR = join(REPO_ROOT, "reports", "image-audits");
const SUMMARY_PATH = join(REPORTS_DIR, "_summary.json");
const OFFICIAL_INVENTORY_CSV = join(REPO_ROOT, "data", "image-inventory.csv");
const PROPOSAL_INVENTORY_CSV = join(REPO_ROOT, "data", "image-inventory.audit-proposal.csv");
const CONSOLIDATED_JSON = join(REPORTS_DIR, "consolidated-pilot.json");
const CONSOLIDATED_MD = join(REPORTS_DIR, "consolidated-pilot.md");

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

const config = loadJson(CONFIG_PATH);
const summary = loadJson(SUMMARY_PATH);

// Resolución humana de Sauvage EDP — HISTORIAL (se conserva completo por
// trazabilidad de auditoría, no se borra la versión anterior):
//
//   v1 (Brey, 2026-08-05): "verificó personalmente que tanto la imagen como
//   el enlace de origen corresponden a Sauvage EDP" — esta resolución quedó
//   SUPERADA. Al inspeccionar el archivo real (descarga directa de
//   catalogImageUrl, 2026-08-06) la caja dice textualmente "EAU DE
//   TOILETTE — Vaporisateur Spray" en toda su superficie visible; no
//   aparece "Eau de Parfum" en ningún lugar de la imagen. Contradicción
//   confirmada por tres lecturas independientes (ChatGPT vía API, Cowork,
//   e inspección visual directa) — reportada a Brey, que la resolvió v2.
//
//   v2 (Brey, 2026-08-06): "Es un EDT, ajústalo." — confirma que la
//   IMAGEN es de la variante Sauvage EDT, no del producto de catálogo tal
//   como estaba nombrado entonces (Sauvage EDP).
//
//   v3 (Brey, 2026-08-06, mismo día — instrucción de cierre de Fase 2):
//   en vez de sustituir la imagen, se corrige el NOMBRE de catálogo de
//   "Sauvage EDP" a "Sauvage EDT" — la imagen, el enlace de Amazon, el
//   slug y el image_url se conservan todos sin cambios. Resolución
//   definitiva y vigente.
const SAUVAGE_HUMAN_VERIFICATION = {
  resolved: true,
  resolution_type: "human_verification",
  resolved_by: "Brey",
  recorded_at: new Date().toISOString(),
  statement:
    "Brey resolvió (2026-08-06) renombrar el producto de catálogo de 'Sauvage EDP' a 'Sauvage EDT' — la imagen, el enlace de Amazon, el slug ('sauvage-edp', sin cambios por rutas/SEO) y el image_url se conservan intactos. La clasificación D original de ChatGPT se originó en una expectativa de variante incorrecta (se esperaba EDP); con el nombre corregido, identidad e imagen coinciden.",
  resolution_history: [
    {
      version: "v1",
      recorded_at: "2026-08-05",
      statement: "Brey verificó personalmente que tanto la imagen como el enlace de origen corresponden a Sauvage EDP.",
      status: "superseded",
      superseded_reason: "Inspección visual directa del archivo (2026-08-06) mostró la caja con el texto 'EAU DE TOILETTE' — contradice v1.",
    },
    {
      version: "v2",
      recorded_at: "2026-08-06",
      statement: "Es un EDT, ajústalo. (Confirma que la imagen es Sauvage EDT, variante equivocada frente al nombre de catálogo 'Sauvage EDP' vigente en ese momento.)",
      status: "superseded",
      superseded_reason: "Reemplazada horas después por la instrucción de cierre de Fase 2: en vez de sustituir la imagen, se corrige el nombre de catálogo.",
    },
    {
      version: "v3",
      recorded_at: "2026-08-06",
      statement: "Renombrar el producto de 'Sauvage EDP' a 'Sauvage EDT'. Conservar imagen, enlace, slug e image_url.",
      status: "vigente",
    },
  ],
  identity_confirmed_as: "sauvage-edt-catalog-name-corrected",
  deferred_exception: false,
  blocks_pilot: false,
  blocks_final_sauvage_change: false,
  overrides: [
    "operational_review.requires_human_review (motivo variant_term_mismatch) queda resuelto: la duda de variante era real, pero se resuelve corrigiendo el nombre de catálogo, no sustituyendo la imagen.",
    "cowork license_status=unknown queda resuelto a favor de affiliate-approved: con el nombre corregido, identidad e imagen coinciden.",
  ],
  note:
    "La clasificación D original de ChatGPT (caja visible, recorte, Y duda de variante) se originó parcialmente en una expectativa de variante incorrecta. Los motivos técnicos independientes (caja en el encuadre) siguen siendo una imperfección visual conocida, pero por instrucción explícita no bloquean el avance general — Sauvage EDT queda 'conservar' con esa mejora pendiente para una ronda de pulido visual futura, no crítica.",
};

// Resolución humana de Baccarat Rouge 540 EDP (Brey, 2026-08-06): confirma
// que la variante es correctamente EDP — cierra el conflicto EDP/Extrait que
// ambas auditorías (ChatGPT y Cowork) habían mencionado de forma
// independiente sin poder resolverlo. Deja de ser "provisional".
const BACCARAT_HUMAN_VERIFICATION = {
  resolved: true,
  resolution_type: "human_verification",
  resolved_by: "Brey",
  recorded_at: new Date().toISOString(),
  statement: "Brey confirmó que Baccarat Rouge 540 EDP es correcta — el conflicto EDP/Extrait queda cerrado.",
  deferred_exception: false,
  blocks_pilot: false,
  blocks_final_change: false,
  overrides: [
    "operational_review.requires_human_review (motivo variant_term_mismatch: extrait_vs_expected_edp) queda resuelto para IDENTIDAD — no se reabre sin nueva evidencia.",
  ],
  note:
    "La verificación humana resuelve la duda de variante. La clasificación visual A y la recomendación 'usar tal cual' ya no son provisionales — quedan cerradas como conservar.",
};

function parseCoworkRow(slug) {
  if (!existsSync(OFFICIAL_INVENTORY_CSV)) return null;
  const raw = readFileSync(OFFICIAL_INVENTORY_CSV, "utf-8");
  const records = parseCsv(raw, { columns: true, skip_empty_lines: true });
  const row = records.find((r) => r.perfume_slug === slug && r.image_role === config.imageRole);
  if (!row) return null;
  return {
    license_status: row.license_status,
    original_width: row.original_width,
    original_height: row.original_height,
    background_type: row.background_type,
    product_crop: row.product_crop,
    visual_quality: row.visual_quality,
    notes: row.notes,
  };
}

// Estados de acción para el cierre de Fase 2 (instrucción de Brey,
// 2026-08-06): Aventus y Black Opium quedan "conservar_temporalmente" —
// el defecto visual sigue documentado, pero no se busca fuente nueva ni
// se bloquea el avance general por él. Sauvage se decide
// programáticamente más abajo según SAUVAGE_HUMAN_VERIFICATION.
const PROPOSED_ACTION = {
  aventus: "conservar_temporalmente",
  "baccarat-rouge-540-edp": "conservar",
  "black-opium-edp": "conservar_temporalmente",
  "erba-pura": "conservar",
};

function buildDecision(perfumeCfg, report, coworkRow) {
  const slug = perfumeCfg.slug;
  const result = report.result;
  const opReview = report.operational_review;
  const chatgptClassification = result.classification;
  const chatgptTrafficLight = report.traffic_light;
  const opTrafficLight = opReview.traffic_light;

  const conflicts = [];

  // Conflicto genérico: Cowork aprobó (affiliate-approved) un caso que
  // ChatGPT marcó D, o viceversa — evaluaron con criterios distintos
  // (Cowork: licencia/dimensiones/técnico; ChatGPT: fidelidad de marca +
  // reglas no negociables de encuadre de Aromia), así que la discrepancia
  // no implica que uno esté "equivocado", pero sí que falta decisión humana.
  if (coworkRow) {
    if (coworkRow.license_status === "affiliate-approved" && chatgptClassification === "D") {
      conflicts.push(
        "Cowork aprobó la imagen (affiliate-approved, criterios de licencia/dimensiones/técnico) pero ChatGPT la clasificó D (criterios de fidelidad de marca y/o reglas no negociables de encuadre de catálogo Aromia) — evaluaron dimensiones distintas del mismo activo, no es un desacuerdo directo pero sí requiere decisión humana sobre cuál criterio prevalece."
      );
    }
    if (coworkRow.license_status === "unknown" && (chatgptClassification === "A" || chatgptClassification === "B")) {
      conflicts.push(
        "Cowork dejó license_status=unknown (duda de identidad/variante) mientras ChatGPT aprobó la imagen (A/B) — ambas auditorías coinciden en la señal de alerta de variante aunque discrepen en la clasificación final."
      );
    }
  }

  if (opReview.variant_term_mismatch) {
    conflicts.push(
      `Ambigüedad de variante: el texto de la propia respuesta del modelo menciona '${opReview.incompatible_variant_codes.join(", ")}' junto al frasco/caja, mientras el nombre de catálogo declara '${opReview.expected_variant_code ?? "edp (implícito)"}'.`
    );
  }

  let operationalStatus = opReview.requires_human_review ? "requires_human_review" : "no_review_required";
  let proposedAction = PROPOSED_ACTION[slug] ?? null;
  let approvalCondition = null;
  let reasonSummary = null;
  let humanResolution = null;

  if (slug === "sauvage-edp") {
    humanResolution = SAUVAGE_HUMAN_VERIFICATION;
    // Resolución final (Brey, 2026-08-06, cierre de Fase 2): en vez de
    // sustituir la imagen, se corrige el NOMBRE de catálogo de "Sauvage
    // EDP" a "Sauvage EDT". Imagen, enlace de Amazon, slug e image_url se
    // conservan sin cambios. Ya no requiere fuente nueva.
    operationalStatus = "human_resolved_catalog_name_corrected";
    proposedAction = "conservar";
    approvalCondition =
      "Ya aprobado con el nombre corregido — usar tal cual (imagen, enlace y slug sin cambios). Pendiente no bloqueante: la caja aparece en el encuadre (mismo tipo de imperfección visual que Black Opium) — queda para una ronda de pulido visual futura, no bloquea el catálogo.";
    reasonSummary =
      "El nombre de catálogo 'Sauvage EDP' era incorrecto — se corrigió a 'Sauvage EDT' (Brey, 2026-08-06). La clasificación D original de ChatGPT se originó en parte en esa expectativa de variante equivocada; con el nombre corregido, identidad e imagen coinciden. Imagen, enlace de Amazon, slug e image_url se conservan sin cambios.";
    conflicts.push(
      "RESUELTO (Brey, 2026-08-06): la ambigüedad EDT/EDP detectada por las tres lecturas (ChatGPT, Cowork, inspección visual directa) se cierra corrigiendo el nombre de catálogo a 'Sauvage EDT', no sustituyendo la imagen. Historial completo de las 3 versiones de esta resolución en human_resolution.resolution_history."
    );
  } else if (slug === "baccarat-rouge-540-edp") {
    humanResolution = BACCARAT_HUMAN_VERIFICATION;
    operationalStatus = "human_verified_no_issues_remain";
    approvalCondition = "Ya aprobado — usar tal cual, sin cambios pendientes.";
    reasonSummary =
      "Clasificación visual A (alta fidelidad de frasco/tapa/etiqueta). El conflicto de variante EDP/Extrait que ambas auditorías mencionaron de forma independiente queda CERRADO por verificación humana (Brey, 2026-08-06) — ya no es provisional.";
    conflicts.push(
      "RESUELTO por verificación humana (Brey, 2026-08-06): la ambigüedad EDP/Extrait detectada por ambas auditorías (ChatGPT vía API y Cowork) no aplica — la variante es correctamente EDP, confirmado."
    );
  } else if (slug === "aventus") {
    operationalStatus = "deferred_non_blocking";
    approvalCondition =
      "Instrucción de cierre de Fase 2 (Brey, 2026-08-06): conservar la imagen y el enlace de Amazon actuales por ahora, sin buscar fuente nueva ni bloquear el avance general. El defecto de fidelidad de marca (etiqueta de papel plana vs. placa metálica grabada real de Creed Aventus) queda documentado como imperfección visual conocida, pendiente para una ronda de pulido visual futura.";
    reasonSummary =
      "ChatGPT detectó que la etiqueta no coincide con el diseño real del frasco — un defecto de fidelidad de marca que Cowork no evaluó (su brief cubre licencia/dimensiones/calidad técnica, no fidelidad de diseño). Por instrucción explícita, no se prioriza en este cierre de fase.";
  } else if (slug === "black-opium-edp") {
    operationalStatus = "deferred_non_blocking";
    approvalCondition =
      "Instrucción de cierre de Fase 2 (Brey, 2026-08-06): conservar la imagen y el enlace de Amazon actuales por ahora, sin buscar fuente nueva ni bloquear el avance general. La composición (caja visible en el encuadre) sigue violando una regla no negociable de catálogo Aromia, pero queda documentada como imperfección visual conocida, pendiente para una ronda de pulido futura.";
    reasonSummary =
      "El frasco es auténtico y la variante coincide (Cowork confirma 'Eau de Parfum' en la etiqueta). La composición viola una regla no negociable de catálogo (caja visible), pero por instrucción explícita no se prioriza en este cierre de fase.";
  } else if (slug === "erba-pura") {
    approvalCondition = "Ya aprobado — usar tal cual, sin cambios pendientes.";
    reasonSummary =
      "Ambas auditorías (ChatGPT y Cowork) coinciden en alta fidelidad y calidad técnica, sin hallazgos de identidad, variante ni composición.";
  }

  return {
    perfume_slug: slug,
    perfume_name: perfumeCfg.name,
    brand: perfumeCfg.brand,
    visual_classification: {
      source: "chatgpt_api_pilot_run_2026-08-05",
      classification: chatgptClassification,
      traffic_light_original: chatgptTrafficLight,
      traffic_light_operational: opTrafficLight,
      confidence: result.confidence,
      recommendation: result.recommendation,
    },
    cowork_result: coworkRow
      ? {
          source: "cowork_summary_relayed_in_chat_2026-08-05_reflected_in_data_image-inventory.csv_uncommitted",
          license_status: coworkRow.license_status,
          original_width: coworkRow.original_width,
          original_height: coworkRow.original_height,
          background_type: coworkRow.background_type,
          product_crop: coworkRow.product_crop,
          visual_quality: coworkRow.visual_quality,
          notes: coworkRow.notes,
        }
      : null,
    operational_status: operationalStatus,
    proposed_action: proposedAction,
    confidence_level: result.confidence,
    conflicts,
    approval_condition: approvalCondition,
    reason_summary: reasonSummary,
    human_resolution: humanResolution,
  };
}

function main() {
  const timestamp = new Date().toISOString();
  const decisions = [];

  for (const perfumeCfg of config.perfumes) {
    const reportPath = join(REPORTS_DIR, `${perfumeCfg.slug}.json`);
    const report = loadJson(reportPath);
    const coworkRow = parseCoworkRow(perfumeCfg.slug);
    decisions.push(buildDecision(perfumeCfg, report, coworkRow));
  }

  const consolidated = {
    generated_at: timestamp,
    generated_by: "scripts/consolidate-image-audit-pilot.mjs",
    inputs: {
      individual_reports: config.perfumes.map((p) => `reports/image-audits/${p.slug}.json`),
      summary: "reports/image-audits/_summary.json",
      operational_review_layer: "operational_review (dentro de cada reporte individual)",
      cowork_source:
        "data/image-inventory.csv (working tree actual, editado por Cowork sin commit — leído tal cual, no modificado por este script)",
      sauvage_resolution_source: "instrucción textual de Brey en el chat, 2026-08-05",
    },
    no_new_api_calls: true,
    official_inventory_untouched: true,
    official_inventory_applied_to_production: false,
    decisions,
  };

  writeFileSync(CONSOLIDATED_JSON, JSON.stringify(consolidated, null, 2) + "\n");

  const md = buildMarkdown(consolidated);
  writeFileSync(CONSOLIDATED_MD, md);

  writeProposalCsv(decisions);

  process.stdout.write("Consolidación completada. Ninguna llamada a la API fue realizada.\n");
  process.stdout.write(`  - ${CONSOLIDATED_JSON}\n`);
  process.stdout.write(`  - ${CONSOLIDATED_MD}\n`);
  process.stdout.write(`  - ${PROPOSAL_INVENTORY_CSV}\n`);
}

function buildMarkdown(consolidated) {
  const lines = [];
  lines.push("# Piloto de auditoría de imágenes — Fase 2 — Consolidación (Paso 5)");
  lines.push("");
  lines.push(`Generado: ${consolidated.generated_at}`);
  lines.push("");
  lines.push(
    "Este documento consolida, sin alterar ninguno de los resultados originales, tres fuentes: la auditoría vía API de ChatGPT (corrida real 2026-08-05), la capa `operational_review` de reconciliación local, y el resumen real de Cowork. Ninguna llamada nueva a la API fue realizada para generar este documento."
  );
  lines.push("");
  lines.push(
    "**Confirmaciones (cierre de Fase 2, 2026-08-06):** el único cambio hecho al inventario oficial (`data/image-inventory.csv`) en todo el piloto es la columna `perfume_name` de `sauvage-edp` (\"Sauvage EDP\" → \"Sauvage EDT\", por instrucción explícita de Brey) y su `license_status` derivado — nunca aplicado a producción por este script. Ningún `image_url`, `source_url`, slug ni enlace de afiliado fue modificado en ningún perfume. `scripts/images/optimize.mjs` no fue invocado."
  );
  lines.push("");

  for (const d of consolidated.decisions) {
    lines.push(`## ${d.perfume_name} (\`${d.perfume_slug}\`) — ${d.brand}`);
    lines.push("");
    lines.push(
      `- **Clasificación visual (ChatGPT):** ${d.visual_classification.classification} (semáforo original ${d.visual_classification.traffic_light_original}, semáforo operativo ${d.visual_classification.traffic_light_operational}), confianza ${d.visual_classification.confidence}. Recomendación original: "${d.visual_classification.recommendation}".`
    );
    if (d.cowork_result) {
      lines.push(
        `- **Resultado Cowork:** license_status=\`${d.cowork_result.license_status}\`, ${d.cowork_result.original_width}x${d.cowork_result.original_height}px, fondo ${d.cowork_result.background_type}, calidad visual ${d.cowork_result.visual_quality}.`
      );
    } else {
      lines.push("- **Resultado Cowork:** no encontrado en data/image-inventory.csv al momento de consolidar.");
    }
    lines.push(`- **Estado operativo:** ${d.operational_status}`);
    lines.push(`- **Acción propuesta:** ${d.proposed_action}`);
    lines.push(`- **Nivel de confianza:** ${d.confidence_level}`);
    lines.push(`- **Condición de aprobación:** ${d.approval_condition ?? "—"}`);
    lines.push(`- **Motivo resumido:** ${d.reason_summary ?? "—"}`);
    if (d.conflicts.length) {
      lines.push("- **Conflictos:**");
      for (const c of d.conflicts) lines.push(`  - ${c}`);
    } else {
      lines.push("- **Conflictos:** ninguno.");
    }
    if (d.human_resolution) {
      lines.push(`- **Resolución humana (${d.perfume_name}):**`);
      lines.push(`  - ${d.human_resolution.statement}`);
      lines.push(`  - deferred_exception: ${d.human_resolution.deferred_exception}`);
      lines.push(`  - blocks_pilot: ${d.human_resolution.blocks_pilot}`);
      lines.push(`  - ${d.human_resolution.note}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function writeProposalCsv(decisions) {
  if (!existsSync(OFFICIAL_INVENTORY_CSV)) {
    process.stderr.write("⚠ No se encontró data/image-inventory.csv — no se generó propuesta consolidada.\n");
    return;
  }
  const raw = readFileSync(OFFICIAL_INVENTORY_CSV, "utf-8");
  const records = parseCsv(raw, { columns: true, skip_empty_lines: true });

  for (const record of records) {
    const decision = decisions.find((d) => d.perfume_slug === record.perfume_slug);
    if (!decision || record.image_role !== config.imageRole) continue;

    const consolidatedNote = [
      `Consolidación piloto Fase 2 (${new Date().toISOString().slice(0, 10)}):`,
      `clasificación ChatGPT ${decision.visual_classification.classification}`,
      decision.cowork_result ? `Cowork ${decision.cowork_result.license_status}` : "Cowork sin dato",
      `acción propuesta: ${decision.proposed_action}`,
      decision.conflicts.length ? `conflictos: ${decision.conflicts.length}` : "sin conflictos",
    ].join(", ");

    record.notes = `${record.notes} ${consolidatedNote}.`;
    if (decision.human_resolution) {
      record.notes += ` RESOLUCIÓN HUMANA (${decision.human_resolution.resolved_by}): ${decision.human_resolution.statement} deferred_exception=${decision.human_resolution.deferred_exception}, blocks_pilot=${decision.human_resolution.blocks_pilot}.`;
    }
  }

  const columns = Object.keys(records[0]);
  const output = stringifyCsv(records, { header: true, columns });
  writeFileSync(PROPOSAL_INVENTORY_CSV, output);
}

main();
