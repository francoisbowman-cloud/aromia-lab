#!/usr/bin/env node
// Fase 2 — tratamiento visual, CIERRE (2026-08-06).
//
// Estado final por perfume, por instrucción explícita de Brey al cerrar
// Fase 2:
//   - Sauvage EDP → RESUELTO. No fue un problema de imagen: el nombre de
//     catálogo estaba mal ("Sauvage EDP" en vez de "Sauvage EDT"). Se
//     corrigió el nombre (ver PERFUMES_INITIAL_50.csv, apps/api/data/
//     PERFUMES_INITIAL_50.csv, data/image-inventory.csv). Imagen, enlace
//     de Amazon, slug e image_url se conservan sin cambios.
//   - Aventus y Black Opium EDP → DIFERIDO, NO BLOQUEANTE. El defecto
//     visual de cada uno sigue confirmado (ver evidencia en
//     reports/image-audits/treatment-evidence/), pero por instrucción
//     explícita no se busca fuente nueva, no se descargan más
//     candidatos, y no bloquean el avance general del roadmap. Quedan
//     documentados para una ronda de pulido visual futura.
//   - Baccarat Rouge 540 EDP y Erba Pura → cerrados sin cambios (ya
//     reflejado en consolidated-pilot.json).
//
// Este script NO genera binarios de reemplazo, NO invoca
// scripts/images/optimize.mjs y NO modifica ningún image_url.
//
// Entrada: reports/image-audits/consolidated-pilot.json.
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
    status: "deferred_non_blocking",
    defect: "Confirmado por inspección visual directa del archivo (2026-08-06): la etiqueta del frasco fotografiado es un rectángulo blanco plano impreso, no la placa metálica grabada con el jinete que lleva el frasco real de Creed Aventus. Es un defecto de fidelidad de marca, no técnico.",
    evidence: "reports/image-audits/treatment-evidence/aventus-current-flat-label-confirmed.jpg",
    closure_note: "Por instrucción de Brey (cierre de Fase 2, 2026-08-06): se conserva la imagen y el enlace de Amazon actuales. No se busca fuente nueva ni se descargan más candidatos. No bloquea el avance del roadmap general — queda para una ronda de pulido visual futura.",
    requirements_if_revisited: [
      "Frasco con placa metálica grabada visible (no etiqueta de papel plana)",
      "Fondo blanco uniforme, sin logos de retailer",
      "Botella completa, sin recortes agresivos",
    ],
  },
  "black-opium-edp": {
    status: "deferred_non_blocking",
    defect: "La variante (EDP) está confirmada correcta — la caja dice 'Eau de Parfum', coincide con el catálogo. Un recorte de prueba (sharp, franja derecha completa del archivo 1500x1500) mostró que la base del frasco queda fuera del encuadre fuente — no es solo la caja tapando, y no es recuperable recortando.",
    evidence: "reports/image-audits/treatment-evidence/black-opium-edp-crop-attempt-base-cutoff.jpg",
    closure_note: "Por instrucción de Brey (cierre de Fase 2, 2026-08-06): se conserva la imagen y el enlace de Amazon actuales. No se busca fuente nueva ni se descargan más candidatos. No bloquea el avance del roadmap general — queda para una ronda de pulido visual futura.",
    requirements_if_revisited: [
      "Frasco completo, incluida la base, dentro del encuadre original",
      "Sin caja en el encuadre",
      "Fondo blanco uniforme",
    ],
  },
  "sauvage-edp": {
    status: "resolved_catalog_name_corrected",
    defect: "RESUELTO (ya no es un defecto de imagen). La imagen siempre fue Sauvage EDT — el nombre de catálogo 'Sauvage EDP' era el que estaba mal.",
    evidence: "reports/image-audits/treatment-evidence/sauvage-edp-contradiction-eau-de-toilette.jpg (imagen original, ahora consistente con el nombre corregido)",
    closure_note: "Nombre de catálogo corregido a 'Sauvage EDT' (Brey, 2026-08-06) en PERFUMES_INITIAL_50.csv (raíz + apps/api/data/), data/image-inventory.csv y config/image-audit-pilot.json. Imagen, enlace de Amazon, slug (sauvage-edp) e image_url sin cambios. Intento de sourcing de una fuente EDP real (2 búsquedas en Amazon, 1 candidato rechazado por ser 'Parfum' y no 'Eau de Parfum' — reports/image-audits/treatment-evidence/sauvage-edp-candidate1-REJECTED-is-parfum-not-edp.jpg) queda sin efecto: ya no hace falta reemplazar la imagen.",
    requirements_if_revisited: [],
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
      status: treatment.status,
      defect: treatment.defect,
      evidence: treatment.evidence,
      closure_note: treatment.closure_note,
      requirements_if_revisited: treatment.requirements_if_revisited,
      no_optimize_invoked: true,
      no_image_url_modified: true,
      no_official_inventory_modified_beyond_sauvage_rename: true,
    });
  }

  return {
    generated_at: timestamp,
    generated_by: "scripts/prepare-image-treatment-plan.mjs",
    scope: "Cierre de Fase 2 (2026-08-06): estado final por perfume — resuelto (Sauvage) o diferido no bloqueante (Aventus, Black Opium).",
    entries,
  };
}

function buildMarkdown(plan) {
  const lines = [];
  lines.push("# Piloto de auditoría de imágenes — Fase 2 — Cierre");
  lines.push("");
  lines.push(`Generado: ${plan.generated_at}`);
  lines.push("");
  lines.push(
    "Estado final de los 3 perfumes con imperfecciones visuales detectadas. Sauvage EDP quedó resuelto renombrando el producto (no la imagen). Aventus y Black Opium quedan diferidos, sin bloquear el avance general, por instrucción explícita. Ningún `image_url` fue modificado en esta corrida; el único cambio al inventario oficial es el renombre de Sauvage. `scripts/images/optimize.mjs` no fue invocado."
  );
  lines.push("");
  for (const e of plan.entries) {
    lines.push(`## ${e.perfume_name} (\`${e.perfume_slug}\`) — ${e.brand}`);
    lines.push("");
    lines.push(`- **Estado:** ${e.status}`);
    lines.push(`- **Acción propuesta:** ${e.proposed_action}`);
    lines.push(`- **Defecto:** ${e.defect}`);
    lines.push(`- **Evidencia:** ${e.evidence}`);
    lines.push(`- **Nota de cierre:** ${e.closure_note}`);
    if (e.requirements_if_revisited.length) {
      lines.push("- **Si se revisita en el futuro, requisitos:**");
      for (const r of e.requirements_if_revisited) lines.push(`  - ${r}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

const plan = buildPlan();
writeFileSync(OUT_JSON, JSON.stringify(plan, null, 2) + "\n");
writeFileSync(OUT_MD, buildMarkdown(plan));
process.stdout.write(`Plan de tratamiento generado:\n  - ${OUT_JSON}\n  - ${OUT_MD}\n`);
