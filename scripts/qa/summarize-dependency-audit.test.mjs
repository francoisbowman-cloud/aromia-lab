import test from "node:test";
import assert from "node:assert/strict";
import {mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
const script=fileURLToPath(new URL("./summarize-dependency-audit.mjs",import.meta.url));
function execute(payload,mode="gate"){
  const dir=mkdtempSync(join(tmpdir(),"aromia-audit-"));
  try{
    const input=join(dir,"audit.json");
    writeFileSync(input,JSON.stringify(payload));
    return spawnSync(process.execPath,[script,input,mode],{encoding:"utf8"});
  }finally{rmSync(dir,{recursive:true,force:true});}
}
const clean={metadata:{vulnerabilities:{critical:0,high:0,moderate:0,low:0}},vulnerabilities:{}};
test("no verified high/critical advisories permits audit gate, but never claims release-ready",()=>{
  const run=execute(clean);
  assert.equal(run.status,0);
  assert.equal(JSON.parse(run.stdout).status,"review_required");
});
test("production high/critical advisory blocks release with exact suggested patch",()=>{
  const report={metadata:{vulnerabilities:{critical:1,high:1,moderate:5,low:0}},
    vulnerabilities:{
      next:{severity:"critical",isDirect:true,fixAvailable:{name:"next",version:"15.5.18",isSemVerMajor:true},via:[{},{}]},
      sharp:{severity:"high",isDirect:true,fixAvailable:true,via:[{}]}
    }};
  const run=execute(report);
  assert.equal(run.status,1);
  const parsed=JSON.parse(run.stdout);
  assert.equal(parsed.status,"blocked");
  assert.equal(parsed.critical,1);
  assert.equal(parsed.high,1);
  assert.deepEqual(parsed.affected[0].fix,{name:"next",version:"15.5.18",isSemVerMajor:true});
});
test("malformed audit / registry failure cannot silently clear release gate",()=>{
  const run=execute({error:{code:"EAUDITNOLOCK"}});
  assert.notEqual(run.status,0);
  assert.match(run.stderr,/dependency_audit_unavailable_or_incomplete/);
});
