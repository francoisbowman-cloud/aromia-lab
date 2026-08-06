#!/usr/bin/env node
// Fase 2 — tratamiento visual (Paso 3/5 del plan de consolidación).
//
// Genera una ESPECIFICACIÓN de tratamiento por perfume para los 3 casos
// "sustituir / reprocesar" (Aventus, Sauvage EDP, Black Opium EDP). No
// descarga imágenes, no genera binarios de reemplazo, no invoca
// scripts/images/optimize.mjs y no modifica ningún image_url — esos pasos
// requieren fuente fotográfica nueva confirmada y/o autorización explícita
// para navegar sitios externos y traer archivos, que no está dada todavía.
// Queda documentado como bloqueo explícito en cada entrada ("readiness").
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
    defect: "La etiqueta del frasco fotografiado es de papel plano; el frasco real de Creed Aventus lleva una placa metálica grabada con el caballero. Es un defecto de fidelidad de marca, no técnico.",
    strategy: "sourcing_new_photo",
    requirements: [
      "Frasco con placa metálica grabada visible (no etiqueta de papel)",
      "Fondo blanco uniforme, sin logos de retailer",
      "Botella completa, sin recortes agresivos",
      "Proporción y color consistentes con la referencia real de Creed",
    ],
    readiness: "blocked_pending_source",
    blocked_reason: "No hay una URL de fuente candidata verificada todavía. Requiere localizar en un retailer autorizado (o banco de assets con licencia) una foto donde la placa metálica sea visible, y confirmar visualmente contra la referencia real antes de proponerla — no se hizo en este paso por ser una decisión de fidelidad de marca de alto riesgo si se elige mal.",
  },
  "sauvage-edp": {
    defect: "La caja del perfume aparece en el encuadre y el recorte no aísla el frasco — viola las reglas no negociables de catálogo Aromia (solo frasco, fondo uniforme, sin recorte agresivo). La identidad del producto (Sauvage EDP) ya está confirmada por verificación humana; el problema es puramente técnico de encuadre.",
    strategy: "reprocess_or_source_new_photo",
    requirements: [
      "Solo el frasco, sin la caja en el encuadre",
      "Fondo blanco uniforme",
      "Frasco completo, sin recorte agresivo",
      "Mantener identidad confirmada: Sauvage EDP (Dior) — no cambiar variante",
    ],
    readiness: "blocked_pending_source_or_crop_confirmation",
    blocked_reason: "Si el frasco es aislable de la caja recortando la imagen actual, este caso podría resolverse con un reprocesamiento simple (crop) en vez de una fuente nueva — pero eso requiere inspeccionar visualmente el archivo real (no solo la descripción textual del modelo) para confirmar que el frasco completo queda dentro del área recortable. No se descargó la imagen para esa inspección en este paso.",
  },
  "black-opium-edp": {
    defect: "La caja aparece en el encuadre y el frasco está parcialmente fuera de cuadro (recorte agresivo por debajo). La variante (EDP) está confirmada correcta por Cowork.",
    strategy: "reprocess_or_source_new_photo",
    requirements: [
      "Solo el frasco, sin la caja en el encuadre",
      "Frasco completo (no cortado por debajo)",
      "Fondo blanco uniforme",
      "Mantener identidad confirmada: Black Opium EDP (YSL) — no cambiar variante",
    ],
    readiness: "blocked_pending_source_or_crop_confirmation",
    blocked_reason: "Mismo caso que Sauvage EDP: podría resolverse con reprocesamiento (crop) si el frasco completo está contenido en la imagen fuente, pero eso requiere inspección visual directa del archivo, no hecha en este paso.",
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
      no_file_downloaded: true,
      no_optimize_invoked: true,
      no_image_url_modified: true,
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
