import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import { stringify as stringifyCsv } from "csv-stringify/sync";
import { REPO_ROOT, isMainModule } from "./lib.mjs";

function firstOfficialUrl(error) {
  const match = String(error ?? "").match(/(https?:\/\/[^\s|]+)/);
  return match?.[1] ?? "";
}

function conflictConcentration(error) {
  const match = String(error ?? "").match(/concentration_conflict:([^|:]+)->([^|:]+):https?:\/\//);
  return match ? { expected: match[1].trim(), observed: match[2].trim() } : null;
}

export function recoverPartialOfficialEvidence(row) {
  if (row.harvest_status === "HARVESTED" || row.source_url) return row;
  const error = String(row.error ?? "");
  const unverified = error.includes("concentration_unverified:");
  const conflict = error.includes("concentration_conflict:");
  if (!unverified && !conflict) return row;
  const sourceUrl = firstOfficialUrl(error);
  if (!sourceUrl) return row;
  const parsedConflict = conflict ? conflictConcentration(error) : null;
  return {
    ...row,
    harvest_status: "PARTIAL_EVIDENCE",
    source_url: sourceUrl,
    identity_confirmed: "true",
    official_source: "true",
    concentration: parsedConflict?.observed ?? row.concentration ?? "",
    relation_ambiguous: conflict ? "true" : row.relation_ambiguous ?? "false",
    evidence_method: "official_html_identity_only",
    provenance_recovered: "true",
    concentration_review: conflict ? `expected=${parsedConflict?.expected ?? "unknown"};observed=${parsedConflict?.observed ?? "unknown"}` : "official_page_did_not_explicitly_confirm_concentration",
  };
}

export function recoverEvidenceRows(rows) {
  return rows.map(recoverPartialOfficialEvidence);
}

export function runEvidenceRecovery() {
  const dir = join(REPO_ROOT, "catalog", "expansion", "batch-003");
  const path = join(dir, "evidence.auto.csv");
  if (!existsSync(path)) return { skipped: true, reason: "evidence.auto.csv not present" };
  const rows = parseCsv(readFileSync(path, "utf-8"), { columns: true, skip_empty_lines: true, relax_column_count: true });
  const recovered = recoverEvidenceRows(rows);
  writeFileSync(path, stringifyCsv(recovered, { header: true }), "utf-8");
  const count = recovered.filter((row) => row.provenance_recovered === "true").length;
  return { total: recovered.length, partial_provenance_recovered: count, production_write: false };
}

if (isMainModule(import.meta.url)) console.log(JSON.stringify(runEvidenceRecovery(), null, 2));
