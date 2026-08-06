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

// Resolución humana de Sauvage EDP (Brey, 2026-08-05): verificó personalmente
// que imagen y link corresponden a Sauvage EDP. Esto es un dato aportado por
// el usuario en la conversación, no inferido — se registra tal cual, sin
// volver a llamar a la API, y prevalece sobre la duda automática de las dos
// auditorías (ChatGPT + Cowork) para el campo de variante específicamente.
const SAUVAGE_HUMAN_VERIFICATION = {
  resolved: true,
  resolution_type: "human_verification",
  resolved_by: "Brey",
  recorded_at: new Date().toISOString(),
  statement:
    "Brey verificó personalmente que tanto la imagen como el enlace de origen corresponden a Sauvage EDP.",
  deferred_exception: false,
  blocks_pilot: false,
  blocks_final_sauvage_change: false,
  overrides: [
    "operational_review.requires_human_review (motivo variant_term_mismatch) queda resuelto para el campo de IDENTIDAD del producto — no se reabre sin nueva evidencia.",
    "cowork license_status=unknown por el mismo motivo de variante queda resuelto para identidad — Cowork no cambió su CSV, esta resolución es una capa de consolidación, no una edición del archivo de Cowork.",
  ],
  note:
    "La verificación humana resuelve la duda de IDENTIDAD (¿es Sauvage EDP?). No resuelve por sí sola los motivos TÉCNICOS independientes que ya llevaron a clasificación D (caja visible en el encuadre, recorte agresivo, contraste) — esos siguen vigentes y separados de la duda de variante.",
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
  "baccarat-rouge-540-edp": "conservar_provisional",
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
  let sauvageResolution = null;

  if (slug === "sauvage-edp") {
    sauvageResolution = SAUVAGE_HUMAN_VERIFICATION;
    // La verificación humana resuelve la duda de IDENTIDAD, no los motivos
    // técnicos independientes (caja visible, recorte agresivo, contraste)
    // que ya sostenían la clasificación D — por eso la acción propuesta
    // sigue siendo reprocesar/sustituir la FUENTE de la foto, igual
    // naturaleza técnica que Black Opium, ya no por duda de producto.
    operationalStatus = "human_verified_identity_technical_issues_remain";
    proposedAction = "sustituir_o_reprocesar_fuente";
    approvalCondition =
      "Identidad de producto ya confirmada por Brey (no requiere más verificación). Falta: nueva fuente fotográfica o reprocesamiento que muestre solo el frasco (sin caja), fondo uniforme, sin recorte agresivo, antes de aprobar como catalog-primary.";
    reasonSummary =
      "Verificación humana (Brey, 2026-08-05) confirma que imagen y enlace corresponden a Sauvage EDP — la duda de variante EDT/EDP detectada por ambas auditorías queda resuelta como excepción no bloqueante. La clasificación D original se mantiene por motivos técnicos ajenos a la variante (caja visible en el encuadre, recorte agresivo, contraste), no por duda de identidad.";
    // Conflicto de variante queda marcado como resuelto, no eliminado del
    // registro (transparencia de auditoría) — se anota el resultado.
    conflicts.push(
      "RESUELTO por verificación humana (Brey, 2026-08-05): la ambigüedad EDT/EDP detectada automáticamente por ambas auditorías (ChatGPT vía API y Cowork) no aplica — el producto es Sauvage EDP, confirmado."
    );
  } else if (slug === "baccarat-rouge-540-edp") {
    approvalCondition =
      "Confirmar contra fuente oficial (empaque real / retailer autorizado) si el frasco fotografiado es Eau de Parfum o Extrait de Parfum antes de aprobación final para catálogo — dos auditorías independientes (ChatGPT y Cowork) citan 'Extrait de Parfum' en la caja mostrada, mientras el catálogo declara 'EDP'.";
    reasonSummary =
      "Clasificación visual A (alta fidelidad de frasco/tapa/etiqueta), pero se conserva PROVISIONALMENTE — persiste una duda de variante no resuelta (EDP vs. Extrait de Parfum) mencionada de forma independiente por ambas auditorías.";
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
    sauvage_human_resolution: sauvageResolution,
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
    if (d.sauvage_human_resolution) {
      lines.push("- **Resolución humana (Sauvage EDP):**");
      lines.push(`  - ${d.sauvage_human_resolution.statement}`);
      lines.push(`  - deferred_exception: ${d.sauvage_human_resolution.deferred_exception}`);
      lines.push(`  - blocks_pilot: ${d.sauvage_human_resolution.blocks_pilot}`);
      lines.push(`  - blocks_final_sauvage_change: ${d.sauvage_human_resolution.blocks_final_sauvage_change}`);
      lines.push(`  - ${d.sauvage_human_resolution.note}`);
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
    if (decision.perfume_slug === "sauvage-edp") {
      record.notes += " RESOLUCIÓN HUMANA (Brey, 2026-08-05): identidad Sauvage EDP confirmada, deferred_exception=false, blocks_pilot=false, blocks_final_sauvage_change=false.";
    }
  }

  const columns = Object.keys(records[0]);
  const output = stringifyCsv(records, { header: true, columns });
  writeFileSync(PROPOSAL_INVENTORY_CSV, output);
}

main();
