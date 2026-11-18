// npm audit advisory inventory. This is an explicit RELEASE gate, separate from
// build/test quality. Do not silently pass when the registry or audit data fails.
import {readFileSync} from "node:fs";
const [path,mode="report"] = process.argv.slice(2);
if(!path)throw new Error("usage: node scripts/qa/summarize-dependency-audit.mjs <audit.json> <gate|report>");
let report;
try {report=JSON.parse(readFileSync(path,"utf8"));}catch{throw new Error("dependency_audit_json_unreadable");}
if(!report || report.error || !report.metadata?.vulnerabilities || !report.vulnerabilities)
  throw new Error("dependency_audit_unavailable_or_incomplete");
const severity=report.metadata.vulnerabilities;
const critical=Number(severity.critical??0),high=Number(severity.high??0);
const list=Object.entries(report.vulnerabilities)
  .filter(([,data])=>["critical","high"].includes(data?.severity))
  .map(([name,data])=>({
    name, severity:data.severity,
    direct:Boolean(data.isDirect),
    fix:data.fixAvailable===false?"none":data.fixAvailable===true?"compatible_candidate":"major_or_specific_candidate",
    viaCount:Array.isArray(data.via)?data.via.length:0
  }))
  .sort((a,b)=>a.severity===b.severity?a.name.localeCompare(b.name):a.severity==="critical"?-1:1);
const status=(critical+high)>0?"blocked":"review_required";
const summary={
  audit:"npm",environment:"production_dependencies_only",
  status,critical,high,moderate:Number(severity.moderate??0),
  low:Number(severity.low??0),affected:list.slice(0,30),
  remainingAffectedNotShown:Math.max(0,list.length-30),
  interpretation:"Advisories require triage by reachable runtime exposure, transitive/direct package, patch viability and regression testing.",
  noAutomaticFixes:true
};
console.log(JSON.stringify(summary,null,2));
if(mode==="gate" && status==="blocked")process.exitCode=1;
