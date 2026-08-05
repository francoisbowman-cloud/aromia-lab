#!/usr/bin/env node
// Piloto de auditoría visual vía OpenAI API — Fase 2, 5 perfumes.
//
// Fuente de verdad de los criterios (perfumes, URLs, mockups OVL, reglas no
// negociables, clasificación A-E, las 13 evaluaciones, preguntas puntuales):
// delegations/FASE-2-CHATGPT-PILOTO-5-PERFUMES.md, transcrita sin reinterpretar
// en config/image-audit-pilot.json. Si un criterio cambia, se cambia primero
// ahí, nunca solo en este script.
//
// Este script NUNCA:
//   - escribe en data/image-inventory.csv (el oficial);
//   - invoca scripts/images/optimize.mjs ni procesa imágenes visualmente;
//   - modifica imagen_url en ningún lado;
//   - imprime o persiste el valor de OPENAI_API_KEY.
//
// Modo por defecto: usar --dry-run. Sin esa bandera, y solo si
// OPENAI_API_KEY está seteada, hace llamadas reales a la API (consumen
// crédito) — ver docs/images/API-AUDIT-RUNBOOK.md antes de correrlo así.

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const SCRIPTS_DIR = fileURLToPath(new URL(".", import.meta.url));
const REPO_ROOT = join(SCRIPTS_DIR, "..");
const CONFIG_PATH = join(REPO_ROOT, "config", "image-audit-pilot.json");
const SCHEMA_PATH = join(REPO_ROOT, "schemas", "image-audit.schema.json");
const REPORTS_DIR = join(REPO_ROOT, "reports", "image-audits");
const OFFICIAL_INVENTORY_CSV = join(REPO_ROOT, "data", "image-inventory.csv");
const PROPOSAL_INVENTORY_CSV = join(REPO_ROOT, "data", "image-inventory.audit-proposal.csv");

const ARGS = process.argv.slice(2);
const DRY_RUN = ARGS.includes("--dry-run");
const LIMIT_OVERRIDE = (() => {
  const flag = ARGS.find((a) => a.startsWith("--limit-usd="));
  return flag ? Number(flag.split("=")[1]) : null;
})();
const MODEL_OVERRIDE = (() => {
  const flag = ARGS.find((a) => a.startsWith("--model="));
  return flag ? flag.split("=")[1] : null;
})();

function log(msg) {
  process.stdout.write(msg + "\n");
}
function warn(msg) {
  process.stderr.write("⚠ " + msg + "\n");
}
function fail(msg) {
  process.stderr.write("✖ " + msg + "\n");
}

function loadJson(path, label) {
  if (!existsSync(path)) {
    fail(`${label} no encontrado en ${path}`);
    process.exit(1);
  }
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch (e) {
    fail(`${label} tiene JSON inválido: ${e.message}`);
    process.exit(1);
  }
}

const config = loadJson(CONFIG_PATH, "config/image-audit-pilot.json");
const schema = loadJson(SCHEMA_PATH, "schemas/image-audit.schema.json");

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validateAudit = ajv.compile(schema);

const spendLimitUsd = LIMIT_OVERRIDE ?? config.spendLimitUsd;
const model = MODEL_OVERRIDE ?? config.model;

if (!Array.isArray(config.perfumes) || config.perfumes.length !== 5) {
  fail(`config/image-audit-pilot.json debe listar exactamente 5 perfumes (tiene ${config.perfumes?.length ?? 0}).`);
  process.exit(1);
}

function buildSystemPrompt() {
  return [
    "Actúa como director de arte y auditor visual de Aromia.",
    "",
    `Función de esta imagen: ${config.roleFunctionDescription}`,
    "",
    "Reglas de imagen de catálogo de Aromia (no negociables):",
    ...config.nonNegotiableRules.map((r) => `- ${r}`),
    "",
    "Analiza la imagen adjunta según estos 13 puntos, pronunciándote",
    "explícitamente sobre cada uno (no resumas en una sola frase):",
    ...config.thirteenEvaluations.map((e, i) => `${i + 1}. ${e}`),
    "",
    "Clasifica:",
    ...Object.entries(config.classification).map(([k, v]) => `${k} — ${v}`),
    "",
    config.nonNegotiableApprovalRule,
    "",
    "Responde exclusivamente en el formato JSON estructurado provisto — no",
    "agregues texto fuera de ese JSON.",
  ].join("\n");
}

function buildUserPrompt(perfume) {
  return [
    `Perfume: ${perfume.name}`,
    `Marca: ${perfume.brand}`,
    `Slug: ${perfume.slug}`,
    "",
    "Primera imagen adjunta: imagen de catálogo actual (candidata a",
    "catalog-primary).",
    "Segunda imagen adjunta: mockup editorial OVL actual, solo como",
    "contexto de estilo — no se está pidiendo evaluarla como candidata de",
    "catálogo ni reemplazarla.",
    "",
    `Problema conocido documentado: ${perfume.knownIssue}`,
    "",
    "Preguntas puntuales para este perfume (respondé cada una en",
    "specific_answers, con el texto exacto de la pregunta):",
    ...perfume.specificQuestions.map((q, i) => `${i + 1}. ${q}`),
  ].join("\n");
}

async function checkUrlReachable(url) {
  try {
    let res = await fetch(url, { method: "HEAD" });
    if (!res.ok) {
      // Algunos CDNs (incluido media-amazon) bloquean HEAD — reintentar con
      // un GET de rango mínimo antes de declarar inalcanzable.
      res = await fetch(url, { headers: { Range: "bytes=0-0" } });
    }
    return { ok: res.ok || res.status === 206, status: res.status };
  } catch (e) {
    return { ok: false, status: null, error: e.message };
  }
}

function checkOvlFile(perfume) {
  const abs = join(REPO_ROOT, perfume.ovlRelativePath);
  if (!existsSync(abs)) return { ok: false, abs };
  const st = statSync(abs);
  return { ok: st.isFile() && st.size > 0, abs, sizeKb: st.size / 1024 };
}

async function runDryRun() {
  log("=== Piloto de auditoría de imágenes (Fase 2) — MODO SECO ===");
  log(`Modelo configurado: ${model}`);
  log(`Límite de gasto configurado: $${spendLimitUsd.toFixed(2)} USD`);
  log("");

  let allOk = true;
  const requests = [];

  for (const perfume of config.perfumes) {
    log(`--- ${perfume.name} (${perfume.slug}) ---`);

    const ovl = checkOvlFile(perfume);
    if (ovl.ok) {
      log(`  OVL: OK — ${perfume.ovlRelativePath} (${ovl.sizeKb.toFixed(1)}KB)`);
    } else {
      fail(`  OVL: FALTA — esperado en ${ovl.abs}`);
      allOk = false;
    }

    const url = await checkUrlReachable(perfume.catalogImageUrl);
    if (url.ok) {
      log(`  URL de catálogo: OK (status ${url.status}) — ${perfume.catalogImageUrl}`);
    } else {
      warn(
        `  URL de catálogo: no verificable desde este entorno (status ${url.status ?? "sin respuesta"}${
          url.error ? `, ${url.error}` : ""
        }) — ${perfume.catalogImageUrl}. No es un fallo del piloto por sí solo; puede ser una red restringida en este entorno. Se reintentará en la ejecución real.`
      );
    }

    const nParts = 2 /* system + user text */ + 2 /* imágenes: catálogo + ovl */;
    requests.push({
      slug: perfume.slug,
      model,
      contentParts: nParts,
      questions: perfume.specificQuestions.length,
    });
    log(`  Solicitud independiente prevista: sí (${nParts} partes de contenido, modelo ${model})`);
    log("");
  }

  log(`Solicitudes independientes que se construirían: ${requests.length} de 5.`);
  log("");
  log("Archivos de salida previstos (no creados en modo seco):");
  for (const p of config.perfumes) {
    log(`  - reports/image-audits/${p.slug}.json`);
  }
  log("  - reports/image-audits/_summary.json");
  log("  - data/image-inventory.audit-proposal.csv (propuesta, NO sobrescribe data/image-inventory.csv)");
  log("");
  log("Confirmaciones de seguridad:");
  log(`  - Llamadas reales a la API: NO se realizaron.`);
  log(`  - data/image-inventory.csv (oficial): NO se modificó.`);
  log(`  - scripts/images/optimize.mjs: NO se invocó, sigue bloqueado.`);
  log(`  - OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? "detectada en el entorno (no se leyó su valor ni se imprime)" : "no detectada — no hace falta para --dry-run"}`);

  if (!existsSync(OFFICIAL_INVENTORY_CSV)) {
    warn(`Aviso: no se encontró ${OFFICIAL_INVENTORY_CSV} — la propuesta de inventario no podrá referenciar el CSV oficial cuando se ejecute en real.`);
  }

  log("");
  log(allOk ? "Modo seco: todo OK, listo para pedir aprobación de ejecución real." : "Modo seco: hay problemas de prerrequisitos (ver ✖ arriba) — resolver antes de pedir ejecución real.");
  process.exit(allOk ? 0 : 1);
}

// ---------------------------------------------------------------------------
// Ejecución real (consume crédito). No se corre en esta entrega — documentada
// y verificada de lectura, pero sin invocar la API todavía.
// ---------------------------------------------------------------------------

async function toDataUri(bytes, contentType) {
  return `data:${contentType};base64,${Buffer.from(bytes).toString("base64")}`;
}

async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  const contentType = res.headers.get("content-type") || "image/jpeg";
  const bytes = new Uint8Array(await res.arrayBuffer());
  return { bytes, contentType };
}

function estimateCostUsd(usage) {
  if (!usage) return null;
  if (typeof usage.cost_usd === "number") return usage.cost_usd; // si la API lo reporta en el futuro
  const inputTokens = usage.input_tokens ?? 0;
  const outputTokens = usage.output_tokens ?? 0;
  return (
    (inputTokens / 1_000_000) * config.estimatedCostPerMillionInputTokensUsd +
    (outputTokens / 1_000_000) * config.estimatedCostPerMillionOutputTokensUsd
  );
}

async function callOpenAiOnce({ systemPrompt, userPrompt, catalogDataUri, ovlDataUri }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY no está seteada en el entorno.");
  }
  const body = {
    model,
    input: [
      { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
      {
        role: "user",
        content: [
          { type: "input_text", text: userPrompt },
          { type: "input_image", image_url: catalogDataUri },
          { type: "input_image", image_url: ovlDataUri },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "image_audit_result",
        schema,
        strict: true,
      },
    },
  };

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenAI Responses API → ${res.status}: ${text.slice(0, 500)}`);
  }
  return res.json();
}

function extractStructuredOutput(response) {
  if (typeof response.output_text === "string" && response.output_text.length > 0) {
    return JSON.parse(response.output_text);
  }
  for (const item of response.output ?? []) {
    for (const c of item.content ?? []) {
      if (c.type === "output_text" && c.text) return JSON.parse(c.text);
      if (c.type === "json" && c.json) return c.json;
    }
  }
  throw new Error("No se pudo extraer salida estructurada de la respuesta de la API.");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Confirma que la respuesta menciona explícitamente el nombre del perfume —
 * guarda mínima contra confusión de variante (ej. Sauvage EDP vs. Elixir),
 * sumada al chequeo de confianza declarada por el modelo.
 */
function variantAppearsVerified(perfume, structured) {
  const blob = [structured.classification_reason, ...structured.specific_answers.map((a) => a.answer)]
    .join(" ")
    .toLowerCase();
  return blob.includes(perfume.name.toLowerCase());
}

const TRACKED_OFFICIAL_FILES = [
  OFFICIAL_INVENTORY_CSV,
  join(REPO_ROOT, "apps", "api", "data", "PERFUMES_INITIAL_50.csv"),
  join(REPO_ROOT, "PERFUMES_INITIAL_50.csv"),
];

function assertSafeToWrite(path) {
  if (TRACKED_OFFICIAL_FILES.includes(path)) {
    throw new Error(`Riesgo de escritura sobre archivo oficial detenido: ${path}`);
  }
}

/** Llama a la API con reintentos (config.maxRetriesPerPerfume, backoff config.retryBackoffMs).
 * Si tras agotar los reintentos la respuesta sigue siendo inválida (error de red,
 * error de la API, o no cumple schemas/image-audit.schema.json), propaga el error
 * — el llamador lo trata como motivo de detención total del piloto. */
async function callOpenAiWithRetries(perfume, args) {
  const maxRetries = config.maxRetriesPerPerfume ?? 2;
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await callOpenAiOnce(args);
      const structured = extractStructuredOutput(response);
      const valid = validateAudit(structured);
      if (!valid) {
        throw new Error(`Salida no cumple schemas/image-audit.schema.json: ${JSON.stringify(validateAudit.errors)}`);
      }
      return { response, structured, attempts: attempt + 1 };
    } catch (e) {
      lastError = e;
      if (attempt < maxRetries) {
        warn(`  Intento ${attempt + 1}/${maxRetries + 1} falló para ${perfume.slug}: ${e.message} — reintentando en ${config.retryBackoffMs}ms.`);
        await sleep(config.retryBackoffMs ?? 1500);
      }
    }
  }
  throw new Error(`Agotados ${maxRetries + 1} intentos para ${perfume.slug}: ${lastError.message}`);
}

async function runLive() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    fail("OPENAI_API_KEY no está seteada. Exportala en el entorno (nunca la pegues en un archivo trackeado) antes de correr sin --dry-run.");
    process.exit(1);
  }
  if (!(spendLimitUsd > 0)) {
    fail(`spendLimitUsd inválido (${spendLimitUsd}) — revisar config/image-audit-pilot.json o --limit-usd.`);
    process.exit(1);
  }

  // Preflight: si falta cualquier prerrequisito (OVL o URL) para cualquiera
  // de los 5, se detiene TODO el piloto antes de gastar un solo dólar — no
  // se procesan parcialmente los que sí están OK.
  log("Preflight (mismo chequeo que --dry-run) antes de gastar crédito...");
  for (const perfume of config.perfumes) {
    const ovl = checkOvlFile(perfume);
    if (!ovl.ok) {
      fail(`Preflight falló: falta el mockup OVL de ${perfume.slug} (${ovl.abs}). Piloto detenido, ninguna llamada realizada.`);
      process.exit(1);
    }
    const url = await checkUrlReachable(perfume.catalogImageUrl);
    if (!url.ok) {
      fail(`Preflight falló: URL de catálogo no alcanzable para ${perfume.slug} (${perfume.catalogImageUrl}, status ${url.status ?? "sin respuesta"}). Piloto detenido, ninguna llamada realizada.`);
      process.exit(1);
    }
  }
  log("Preflight OK — 5/5 OVL presentes, 5/5 URLs alcanzables.\n");

  mkdirSync(REPORTS_DIR, { recursive: true });
  const tmpSessionDir = join(tmpdir(), `aromia-image-audit-${randomUUID()}`);
  mkdirSync(tmpSessionDir, { recursive: true });

  let runningCostUsd = 0;
  let runningTokens = { input: 0, output: 0 };
  const results = [];
  const failures = [];
  let haltReason = null;

  // Coste estimado de un solo perfume (conservador, basado en el primero
  // exitoso) usado para decidir si conviene ni siquiera intentar el
  // siguiente — evita pasarse del límite "a mitad de una llamada".
  let estCostPerCall = null;

  try {
    for (const perfume of config.perfumes) {
      if (runningCostUsd >= spendLimitUsd) {
        haltReason = `Límite de gasto ($${spendLimitUsd.toFixed(2)}) alcanzado antes de procesar ${perfume.slug}.`;
        warn(haltReason);
        break;
      }
      if (estCostPerCall !== null && runningCostUsd + estCostPerCall > spendLimitUsd) {
        haltReason = `El próximo llamado excedería el límite de gasto ($${spendLimitUsd.toFixed(2)}) — detenido antes de ${perfume.slug} para no pasarse.`;
        warn(haltReason);
        break;
      }

      log(`Procesando ${perfume.name} (${perfume.slug})...`);
      try {
        const [catalogImg, ovlBytes] = await Promise.all([
          downloadImage(perfume.catalogImageUrl),
          Promise.resolve(readFileSync(join(REPO_ROOT, perfume.ovlRelativePath))),
        ]);
        const catalogDataUri = await toDataUri(catalogImg.bytes, catalogImg.contentType);
        const ovlDataUri = await toDataUri(ovlBytes, "image/jpeg");

        const { response, structured, attempts } = await callOpenAiWithRetries(perfume, {
          systemPrompt: buildSystemPrompt(),
          userPrompt: buildUserPrompt(perfume),
          catalogDataUri,
          ovlDataUri,
        });

        if ((structured.confidence ?? 0) < (config.minConfidenceToAccept ?? 0.5)) {
          haltReason = `Confianza reportada por el modelo (${structured.confidence}) por debajo del mínimo aceptable (${config.minConfidenceToAccept}) para ${perfume.slug} — no puede verificarse con suficiente certeza. Piloto detenido.`;
          fail(haltReason);
          break;
        }
        if (!variantAppearsVerified(perfume, structured)) {
          haltReason = `No se pudo verificar que la respuesta identifique explícitamente "${perfume.name}" (riesgo de confusión de variante) — piloto detenido para revisión humana.`;
          fail(haltReason);
          break;
        }

        const usage = response.usage ?? null;
        const costUsd = estimateCostUsd(usage);
        if (typeof costUsd === "number") {
          runningCostUsd += costUsd;
          estCostPerCall = estCostPerCall === null ? costUsd : Math.max(estCostPerCall, costUsd);
        }
        if (usage) {
          runningTokens.input += usage.input_tokens ?? 0;
          runningTokens.output += usage.output_tokens ?? 0;
        }

        const trafficLight = { A: "verde", B: "amarillo", C: "amarillo", D: "rojo", E: "amarillo" }[structured.classification] ?? "amarillo";

        const record = {
          perfume_slug: perfume.slug,
          model,
          timestamp: new Date().toISOString(),
          attempts,
          catalog_image_url: perfume.catalogImageUrl,
          ovl_relative_path: perfume.ovlRelativePath,
          response_id: response.id ?? null,
          usage,
          estimated_cost_usd: costUsd,
          traffic_light: trafficLight,
          result: structured,
        };
        const outPath = join(REPORTS_DIR, `${perfume.slug}.json`);
        assertSafeToWrite(outPath);
        writeFileSync(outPath, JSON.stringify(record, null, 2));
        results.push(record);
        log(`  OK (intento ${attempts}) — clasificación ${structured.classification} (${trafficLight}), confianza ${structured.confidence}, coste estimado $${(costUsd ?? 0).toFixed(4)}`);
      } catch (e) {
        haltReason = `Respuesta inválida tras reintentos para ${perfume.slug}: ${e.message}. Piloto detenido.`;
        fail(`  ${haltReason}`);
        failures.push({ slug: perfume.slug, error: e.message });
        break;
      }
    }
  } finally {
    rmSync(tmpSessionDir, { recursive: true, force: true });
  }

  const summary = {
    generated_at: new Date().toISOString(),
    model,
    spend_limit_usd: spendLimitUsd,
    running_cost_usd_estimate: runningCostUsd,
    running_tokens: runningTokens,
    perfumes_processed: results.length,
    perfumes_failed: failures.length,
    halted_early: haltReason !== null,
    halt_reason: haltReason,
    failures,
    classifications: Object.fromEntries(results.map((r) => [r.perfume_slug, r.result.classification])),
    traffic_lights: Object.fromEntries(results.map((r) => [r.perfume_slug, r.traffic_light])),
  };
  const summaryPath = join(REPORTS_DIR, "_summary.json");
  assertSafeToWrite(summaryPath);
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  writeProposalCsv(results);

  log("");
  log(`Resumen: ${results.length}/5 procesados, ${failures.length} fallidos, coste estimado total $${runningCostUsd.toFixed(4)} de $${spendLimitUsd.toFixed(2)}.`);
  if (haltReason) log(`Detenido antes de completar los 5: ${haltReason}`);
  log(`data/image-inventory.csv (oficial) NO fue modificado. Propuesta en data/image-inventory.audit-proposal.csv.`);
}

function writeProposalCsv(results) {
  if (!existsSync(OFFICIAL_INVENTORY_CSV)) {
    warn("No se encontró data/image-inventory.csv — no se generó propuesta de inventario.");
    return;
  }
  const header = readFileSync(OFFICIAL_INVENTORY_CSV, "utf-8").split("\n")[0];
  const columns = header.split(",");
  const visualQualityIdx = columns.indexOf("visual_quality");
  const notesIdx = columns.indexOf("notes");
  const slugIdx = columns.indexOf("perfume_slug");
  const roleIdx = columns.indexOf("image_role");

  const lines = [header];
  const rows = readFileSync(OFFICIAL_INVENTORY_CSV, "utf-8").split("\n").slice(1).filter(Boolean);

  const classificationToQuality = { A: "high", B: "medium", C: "medium", D: "low", E: "high" };

  for (const row of rows) {
    const cells = row.split(",");
    const slug = cells[slugIdx];
    const role = cells[roleIdx];
    const match = results.find((r) => r.perfume_slug === slug);
    if (match && role === config.imageRole) {
      const cls = match.result.classification;
      cells[visualQualityIdx] = classificationToQuality[cls] ?? cells[visualQualityIdx];
      const note = `Auditoría ChatGPT (API), piloto Fase 2, ${match.timestamp.slice(0, 10)}, clasificación ${cls}: ${match.result.recommendation}`;
      cells[notesIdx] = `"${note.replace(/"/g, "'")}"`;
    }
    lines.push(cells.join(","));
  }

  writeFileSync(PROPOSAL_INVENTORY_CSV, lines.join("\n"));
  log(`Propuesta escrita en data/image-inventory.audit-proposal.csv (${results.length} fila(s) actualizada(s), archivo oficial intacto).`);
}

if (DRY_RUN) {
  await runDryRun();
} else {
  await runLive();
}
