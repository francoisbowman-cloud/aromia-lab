// Analyzes npm audit JSON from a single package scope; never installs or patches.
import {readFileSync} from 'node:fs';
const [file,mode='report']=process.argv.slice(2);
if(!file)throw new Error('usage: node scripts/qa/dependency-audit-summary.mjs <audit.json> [strict]');
let report;
try{report=JSON.parse(readFileSync(file,'utf8'));}
catch{process.stderr.write('SECURITY GATE: npm audit report missing/malformed — cannot certify dependencies\n');process.exit(2);}
if(report.error || typeof report.vulnerabilities!=='object'||!report.vulnerabilities) {
  process.stderr.write('SECURITY GATE: npm audit returned an error or no advisory details\n');
  process.exit(2);
}
const counts={info:0,low:0,moderate:0,high:0,critical:0};
const rows=[];
for(const [name,p] of Object.entries(report.vulnerabilities)) {
  if(!p || typeof p!=='object')continue;
  const severity=p.severity;
  if(!(severity in counts)){process.stderr.write('SECURITY GATE: unknown npm severity\n');process.exit(2);}
  counts[severity]++;
  rows.push({name,severity,isDirect:p.isDirect===true,range:p.range,
    fixAvailable:typeof p.fixAvailable==='object'?p.fixAvailable.name+'@'+p.fixAvailable.version:
      p.fixAvailable===true?'available':p.fixAvailable===false?'none':'unknown'});
}
const order={critical:0,high:1,moderate:2,low:3,info:4};
rows.sort((a,b)=>order[a.severity]-order[b.severity]||a.name.localeCompare(b.name));
process.stdout.write('Runtime npm audit classification (npm --omit=dev):\n'+JSON.stringify(counts,null,2)+'\n');
for(const row of rows.slice(0,25)) {
  process.stdout.write(`  ${row.severity.toUpperCase()} ${row.name} (${row.isDirect?'direct':'transitive'}), range=${row.range}, fix=${row.fixAvailable}\n`);
}
if(rows.length>25)process.stdout.write(`  ... ${rows.length-25} more vulnerable packages (see audit artifact)\n`);
if(mode==='strict'&&(counts.critical>0||counts.high>0)) {
  process.stderr.write('SECURITY RELEASE BLOCK: untriaged high/critical runtime advisories. No force upgrades or silent waivers.\n');
  process.exit(1);
}
