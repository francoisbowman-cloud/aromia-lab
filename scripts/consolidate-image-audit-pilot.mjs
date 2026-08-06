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
//   IMAGEN es de la variante equivocada (Sauvage EDT), no del producto de
//   catálogo (Sauvage EDP). Esta es la resolución vigente.
const SAUVAGE_HUMAN_VERIFICATION = {
  resolved: true,
  resolution_type: "human_verification",
  resolved_by: "Brey",
  recorded_at: new Date().toISOString(),
  statement:
    "Brey confirmó (2026-08-06) que la imagen actual es de Sauvage EDT, no de Sauvage EDP — la imagen está mal, no el nombre de catálogo. Corrige la resolución anterior del 2026-08-05, que daba la imagen por correcta.",
  superseded_previous_resolution: {
    statement_v1: "Brey verificó personalmente que tanto la imagen como el enlace de origen corresponden a Sauvage EDP.",
    recorded_at_v1: "2026-08-05",
    superseded_reason: "Inspección visual directa del archivo (2026-08-06) mostró la caja con el texto 'EAU DE TOILETTE' — contradice v1. Reportado a Brey, quien corrigió la resolución.",
  },
  identity_confirmed_as: "sauvage-edt-wrong-image",
  deferred_exception: false,
  blocks_pilot: false,
  blocks_final_sauvage_change: false,
  overrides: [
    "operational_review.requires_human_review (motivo variant_term_mismatch) queda resuelto: la duda de variante era real — la imagen SÍ es EDT.",
    "cowork license_status=unknown por el mismo motivo de variante queda resuelto: license_status debe mantenerse en unknown/rechazado hasta reemplazar la fuente, no aprobarse.",
  ],
  note:
    "La imagen debe SUSTITUIRSE por una fuente real de Sauvage EDP (no alcanza con recortar la actual — el producto fotografiado es la variante equivocada). Mismo tipo de tratamiento que Aventus: sourcing de fuente nueva, no reprocesamiento de la existente.",
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

// Estados provisionales de acción pedidos explícitamente para este piloto.
// Sauvage se decide programáticamente más abajo según SAUVAGE_HUMAN_VERIFICATION,
// no se fija acá.
const PROPOSED_ACTION = {
  aventus: "sustituir",
  "baccarat-rouge-540-edp": "conservar",
  "black-opium-edp": "sustituir_o_reprocesar",
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
    // Corrección 2026-08-06: la imagen actual ES Sauvage EDT (confirmado por
    // Brey tras inspección directa), no una duda de identidad resuelta a
    // favor de EDP como se había registrado el 2026-08-05. La acción deja
    // de ser "reprocesar/recortar la fuente actual" (eso no arregla un
    // producto equivocado) y pasa a ser "sustituir por fuente nueva",
    // mismo tratamiento que Aventus.
    operationalStatus = "human_confirmed_wrong_variant_image";
    proposedAction = "sustituir";
    approvalCondition =
      "No aprobar como catalog-primary con la fuente actual bajo ninguna circunstancia — es una foto de Sauvage EDT, variante distinta a la del catálogo (Sauvage EDP). Requiere una fuente fotográfica nueva y verificada de Sauvage EDP (caja debe decir 'Eau de Parfum'), sin caja en el encuadre, fondo uniforme, sin recorte agresivo.";
    reasonSummary =
      "Brey confirmó (2026-08-06), tras inspección visual directa del archivo, que la imagen es de Sauvage EDT — corrige la resolución del 2026-08-05 que había dado la imagen por correcta. Las tres auditorías (ChatGPT, Cowork, inspección directa) coincidían en la señal de alerta; la duda quedó resuelta a favor de 'la imagen está mal', no de 'el nombre de catálogo está mal'.";
    conflicts.push(
      "RESUELTO por verificación humana (Brey, 2026-08-06), CORRIGIENDO una resolución humana previa (2026-08-05) que había cerrado el mismo conflicto en sentido contrario: la imagen es confirmada Sauvage EDT, no EDP. Las tres auditorías (ChatGPT, Cowork, inspección visual directa) tenían razón en marcar la duda."
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
    approvalCondition =
      "No aprobar como catalog-primary hasta conseguir una fuente fotográfica con la placa metálica grabada auténtica (la imagen actual muestra una etiqueta de papel plana, no la placa real de Creed Aventus).";
    reasonSummary =
      "ChatGPT detectó que la etiqueta no coincide con el diseño real del frasco (placa metálica vs. etiqueta de papel) — un defecto de fidelidad de marca que Cowork no evaluó (su brief cubre licencia/dimensiones/calidad técnica, no fidelidad de diseño frente a la referencia real).";
  } else if (slug === "black-opium-edp") {
    approvalCondition =
      "Sustituir por, o reprocesar hacia, una fuente donde aparezca solo el frasco completo (sin caja, sin recorte agresivo), sobre fondo uniforme — regla no negociable de catálogo Aromia.";
    reasonSummary =
      "El frasco es auténtico y la variante coincide (Cowork confirma 'Eau de Parfum' en la etiqueta), pero la composición viola dos reglas no negociables de catálogo Aromia: la caja aparece en el encuadre y el frasco está parcialmente recortado. Cowork aprobó por no evaluar esas reglas específicas de Aromia.";
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
    "**Confirmaciones:** el inventario oficial (`data/image-inventory.csv`) no fue sobrescrito por este script ni aplicado a producción. `scripts/images/optimize.mjs` no fue invocado. Ningún `image_url` fue modificado."
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
