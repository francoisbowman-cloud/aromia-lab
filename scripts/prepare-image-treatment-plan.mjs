#!/usr/bin/env node
// Fase 2 — tratamiento visual (Paso 3/5 del plan de consolidación).
//
// Genera una ESPECIFICACIÓN de tratamiento por perfume para los 3 casos
// "sustituir" (Aventus, Sauvage EDP, Black Opium EDP — los tres terminaron
// necesitando fuente nueva, no solo reprocesamiento; ver blocked_reason).
//
// Para llegar a esa conclusión SÍ se descargó, en esta corrida, la imagen
// actual de catálogo de cada uno de los 3 (a la carpeta temporal de
// scratchpad de la sesión) para inspección visual directa, y se probó un
// recorte real con sharp sobre Black Opium — evidencia guardada en
// reports/image-audits/treatment-evidence/. Eso descartó la hipótesis de
// "alcanza con recortar" para Black Opium, y confirmó una contradicción
// crítica en Sauvage EDP (imagen real es EDT, no EDP — reportada y
// corregida por Brey, 2026-08-06).
//
// Este script NO genera binarios de reemplazo definitivos, NO invoca
// scripts/images/optimize.mjs y NO modifica ningún image_url — eso
// requiere una fuente fotográfica NUEVA confirmada (sourcing en sitios
// externos), que no se hizo en este paso.
//
// Entrada: config/image-audit-pilot.json + reports/image-audits/<slug>.json
// (result + operational_review) + reports/image-audits/consolidated-pilot.json.
// Salida: reports/image-audits/treatment-plan.json y .md.

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPTS_DIR = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = join(SCRIPTS_DIR, "..");
const REPORTS_DIR = join(REPO_ROOT, "reports", "image-audits");
const CONSOLIDATED_JSON = join(REPORTS_DIR, "consolidated-pilot.json");
const OUT_JSON = join(REPORTS_DIR, "treatment-plan.json");
const OUT_MD = join(REPORTS_DIR, "treatment-plan.md");

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

const consolidated = loadJson(CONSOLIDATED_JSON);

const TREATMENTS = {
  aventus: {
    defect: "Confirmado por inspección visual directa del archivo (2026-08-06): la etiqueta del frasco fotografiado es un rectángulo blanco plano impreso, no la placa metálica grabada con el jinete que lleva el frasco real de Creed Aventus. Es un defecto de fidelidad de marca, no técnico.",
    strategy: "sourcing_new_photo",
    requirements: [
      "Frasco con placa metálica grabada visible (no etiqueta de papel plana)",
      "Fondo blanco uniforme, sin logos de retailer",
      "Botella completa, sin recortes agresivos",
      "Proporción y color consistentes con la referencia real de Creed",
    ],
    readiness: "blocked_pending_source",
    blocked_reason: "No hay una URL de fuente candidata verificada todavía (evidencia del defecto actual: reports/image-audits/treatment-evidence/aventus-current-flat-label-confirmed.jpg). Requiere localizar en un retailer autorizado (o banco de assets con licencia) una foto donde la placa metálica sea visible, y confirmar visualmente contra la referencia real antes de proponerla — no se hizo en este paso por ser una decisión de fidelidad de marca de alto riesgo si se elige mal (mismo tipo de error ya detectado en Sauvage EDP).",
  },
  "sauvage-edp": {
    defect: "La imagen actual es de Sauvage EAU DE TOILETTE (confirmado por inspección visual directa del archivo el 2026-08-06 — la caja dice textualmente 'EAU DE TOILETTE — Vaporisateur Spray', no 'Eau de Parfum'), pero el catálogo declara el producto como Sauvage EDP. No es un problema de encuadre: es la variante equivocada. Confirmado por Brey el 2026-08-06, corrigiendo una resolución humana previa del 2026-08-05 que había dado la imagen por correcta.",
    strategy: "sourcing_new_photo",
    requirements: [
      "Caja/etiqueta debe decir explícitamente 'Eau de Parfum', no 'Eau de Toilette'",
      "Solo el frasco, sin la caja en el encuadre",
      "Fondo blanco uniforme",
      "Frasco completo, sin recorte agresivo",
    ],
    readiness: "blocked_pending_source",
    blocked_reason: "Requiere localizar en un retailer autorizado una foto de Sauvage EDP (no EDT) y confirmar visualmente el texto 'Eau de Parfum' en la caja/etiqueta antes de proponerla — no se hizo en este paso, dado el error ya cometido una vez con esta misma variante (evidencia de la imagen actual, EDT: reports/image-audits/treatment-evidence/sauvage-edp-contradiction-eau-de-toilette.jpg).",
  },
  "black-opium-edp": {
    defect: "La variante (EDP) está confirmada correcta — la caja dice 'Eau de Parfum', coincide con el catálogo. PERO se intentó un recorte de prueba (sharp, extrayendo toda la franja derecha del archivo 1500x1500 sin límite de altura) y la base del frasco sigue sin verse completa: la imagen fuente tiene la botella cortada por abajo en el original, no es solo un problema de encuadre/selección — no hay pixeles de la base para recuperar recortando.",
    strategy: "sourcing_new_photo",
    requirements: [
      "Frasco completo, incluida la base, dentro del encuadre original (no recuperable por recorte de la fuente actual)",
      "Sin caja en el encuadre",
      "Fondo blanco uniforme",
      "Mantener identidad confirmada: Black Opium EDP (YSL) — no cambiar variante",
    ],
    readiness: "blocked_pending_source",
    blocked_reason: "Se descartó la hipótesis de recorte tras probarla directamente (evidencia: reports/image-audits/treatment-evidence/black-opium-edp-crop-attempt-base-cutoff.jpg): la base del frasco está fuera del encuadre en el archivo fuente, no solo detrás de la caja. Requiere una fuente fotográfica nueva con el frasco completo.",
  },
};

function buildPlan() {
  const timestamp = new Date().toISOString();
  const entries = [];

  for (const [slug, treatment] of Object.entries(TREATMENTS)) {
    const decision = consolidated.decisions.find((d) => d.perfume_slug === slug);
    entries.push({
      perfume_slug: slug,
      perfume_name: decision?.perfume_name ?? slug,
      brand: decision?.brand ?? null,
      proposed_action: decision?.proposed_action ?? null,
      defect: treatment.defect,
      strategy: treatment.strategy,
      requirements: treatment.requirements,
      readiness: treatment.readiness,
      blocked_reason: treatment.blocked_reason,
      source_image_inspected_visually: true,
      no_optimize_invoked: true,
      no_image_url_modified: true,
      no_official_inventory_modified: true,
    });
  }

  return {
    generated_at: timestamp,
    generated_by: "scripts/prepare-image-treatment-plan.mjs",
    scope: "Especificación de tratamiento (qué se necesita), no generación de archivos binarios de reemplazo — ver blocked_reason por perfume.",
    entries,
  };
}

function buildMarkdown(plan) {
  const lines = [];
  lines.push("# Piloto de auditoría de imágenes — Fase 2 — Plan de tratamiento visual");
  lines.push("");
  lines.push(`Generado: ${plan.generated_at}`);
  lines.push("");
  lines.push(
    "Este plan especifica QUÉ necesita cada imagen para pasar a `affiliate-approved` / catalog-primary aprobado. No incluye archivos binarios de reemplazo — sourcing de fuente nueva y/o reprocesamiento (crop) requieren inspección visual directa del archivo o navegación de sitios externos, no ejecutadas en este paso. Ningún `image_url` fue modificado, ninguna imagen fue descargada, `scripts/images/optimize.mjs` no fue invocado."
  );
  lines.push("");
  for (const e of plan.entries) {
    lines.push(`## ${e.perfume_name} (\`${e.perfume_slug}\`) — ${e.brand}`);
    lines.push("");
    lines.push(`- **Acción propuesta:** ${e.proposed_action}`);
    lines.push(`- **Defecto:** ${e.defect}`);
    lines.push(`- **Estrategia:** ${e.strategy}`);
    lines.push("- **Requisitos:**");
    for (const r of e.requirements) lines.push(`  - ${r}`);
    lines.push(`- **Estado:** ${e.readiness}`);
    lines.push(`- **Bloqueo:** ${e.blocked_reason}`);
    lines.push("");
  }
  return lines.join("\n");
}

const plan = buildPlan();
writeFileSync(OUT_JSON, JSON.stringify(plan, null, 2) + "\n");
writeFileSync(OUT_MD, buildMarkdown(plan));
process.stdout.write(`Plan de tratamiento generado:\n  - ${OUT_JSON}\n  - ${OUT_MD}\n`);
