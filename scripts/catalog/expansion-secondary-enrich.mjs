import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parse as parseCsv } from "csv-parse/sync";
import { stringify as stringifyCsv } from "csv-stringify/sync";
import { REPO_ROOT, isMainModule, normalizeConcentration } from "./lib.mjs";
import { discoverSecondaryEvidence, discoverSecondaryEvidenceAtUrl } from "./secondary-discovery.mjs";

function readCsv(path) { return parseCsv(readFileSync(path, "utf-8"), { columns: true, skip_empty_lines: true, relax_column_count: true }); }
function bool(v) { return String(v ?? "").toLowerCase() === "true"; }
function clean(v) { const s=String(v??"").trim(); return ["","pending","null","undefined","n/a"].includes(s.toLowerCase())?"":s; }
function canonical(v) { return normalizeConcentration(clean(v)).value.toLowerCase(); }
function needsSecondary(row) { return !clean(row.source_url) || !clean(row.gender) || (!clean(row.top_notes)&&!clean(row.middle_notes)&&!clean(row.base_notes)&&!clean(row.accords)&&!bool(row.source_does_not_publish_notes)); }
function mergeUrls(a,b) { return [...new Set([...(clean(a)?clean(a).split(";"):[]), ...(clean(b)?clean(b).split(";"):[])].map((x)=>x.trim()).filter(Boolean))].join(";"); }

export function mergeSecondaryEvidence(row, secondary, candidate) {
  if (secondary.status !== "FOUND") return { ...row, secondary_status: secondary.status, secondary_error: secondary.error ?? "", curated_source_url: secondary.source_url ?? "" };
  const expected = canonical(candidate.concentration);
  const observed = canonical(secondary.concentration);
  const concentrationOkay = !observed || !expected || observed === expected;
  const existingOfficial = bool(row.official_source);
  const notesResolved = secondary.notes_structure && secondary.notes_structure !== "UNKNOWN";
  return {
    ...row,
    source_url: mergeUrls(row.source_url, secondary.source_url),
    identity_confirmed: bool(row.identity_confirmed) || bool(secondary.identity_confirmed) ? "true" : "false",
    official_source: existingOfficial ? "true" : "false",
    secondary_source: "true",
    gender: clean(row.gender) || clean(secondary.gender),
    concentration: clean(row.concentration) || (concentrationOkay ? clean(secondary.concentration) : ""),
    launch_year: clean(row.launch_year) || clean(secondary.launch_year),
    top_notes: clean(row.top_notes) || (notesResolved ? clean(secondary.top_notes) : ""),
    middle_notes: clean(row.middle_notes) || (notesResolved ? clean(secondary.middle_notes) : ""),
    base_notes: clean(row.base_notes) || (notesResolved ? clean(secondary.base_notes) : ""),
    accords: clean(row.accords) || (notesResolved ? clean(secondary.accords) : ""),
    notes_structure: clean(row.notes_structure) && clean(row.notes_structure) !== "UNKNOWN" ? row.notes_structure : (secondary.notes_structure || "UNKNOWN"),
    source_does_not_publish_notes: notesResolved ? "false" : row.source_does_not_publish_notes,
    secondary_status: "FOUND",
    curated_source_url: secondary.source_url,
    secondary_concentration_observed: clean(secondary.concentration),
    secondary_concentration_match: concentrationOkay ? "true" : "false",
    secondary_launch_year_observed: clean(secondary.launch_year),
    relation_ambiguous: concentrationOkay ? (row.relation_ambiguous || "false") : "true",
    evidence_method: [clean(row.evidence_method), clean(secondary.evidence_method)].filter(Boolean).join("+"),
    secondary_error: "",
  };
}

async function mapConcurrent(items, limit, fn) {
  const out=new Array(items.length); let cursor=0; let done=0;
  async function worker(){ while(true){ const i=cursor++; if(i>=items.length)return; out[i]=await fn(items[i],i); done++; if(done===1||done%10===0||done===items.length) console.log(`[secondary] ${done}/${items.length}`); } }
  await Promise.all(Array.from({length:Math.min(Math.max(1,limit),items.length||1)},worker)); return out;
}

export async function runSecondaryEnrichment({ concurrency = 5 } = {}) {
  const dir=join(REPO_ROOT,"catalog","expansion","batch-003");
  const evidencePath=join(dir,"evidence.auto.csv"); const manifestPath=join(dir,"candidate-manifest.csv");
  const mapPath=join(REPO_ROOT,"catalog","expansion","secondary-source-map.csv");
  if(!existsSync(evidencePath)||!existsSync(manifestPath)) return {skipped:true,reason:"evidence or manifest missing"};
  const evidence=readCsv(evidencePath); const manifest=readCsv(manifestPath); const byId=new Map(manifest.map((r)=>[r.candidate_id,r]));
  const sourceMap=existsSync(mapPath)?new Map(readCsv(mapPath).map((r)=>[r.candidate_id,r.source_url])):new Map();
  const targets=evidence.filter(needsSecondary);
  const resolved=await mapConcurrent(targets,concurrency,async(row)=>{
    const candidate=byId.get(row.candidate_id)??row;
    const curated=sourceMap.get(row.candidate_id);
    let secondary=curated?await discoverSecondaryEvidenceAtUrl(candidate,curated):null;
    if(!secondary||secondary.status!=="FOUND"){
      const searched=await discoverSecondaryEvidence(candidate);
      if(searched.status==="FOUND") secondary=searched;
      else if(!secondary) secondary=searched;
    }
    return mergeSecondaryEvidence(row,secondary,candidate);
  });
  const resolvedById=new Map(resolved.map((r)=>[r.candidate_id,r]));
  const merged=evidence.map((r)=>resolvedById.get(r.candidate_id)??r);
  writeFileSync(evidencePath,stringifyCsv(merged,{header:true}),"utf-8");
  const report={
    total:evidence.length,targets:targets.length,curated_map_entries:sourceMap.size,
    secondary_found:resolved.filter((r)=>r.secondary_status==="FOUND").length,
    secondary_not_found:resolved.filter((r)=>r.secondary_status!=="FOUND").length,
    gender_filled:resolved.filter((r)=>clean(r.gender)).length,
    concentration_filled:resolved.filter((r)=>clean(r.concentration)).length,
    notes_resolved:resolved.filter((r)=>clean(r.notes_structure)&&r.notes_structure!=="UNKNOWN").length,
    year_conflicts:resolved.filter((r)=>r.secondary_status==="YEAR_CONFLICT").length,
    concentration_conflicts:resolved.filter((r)=>r.secondary_concentration_match==="false").length,
    production_write:false
  };
  writeFileSync(join(dir,"secondary-enrichment-report.json"),JSON.stringify(report,null,2)+"\n","utf-8");
  return report;
}
if(isMainModule(import.meta.url)) runSecondaryEnrichment({concurrency:Number(process.env.AROMIA_SECONDARY_CONCURRENCY||5)}).then((r)=>console.log(JSON.stringify(r,null,2))).catch((e)=>{console.error(e);process.exitCode=1;});
