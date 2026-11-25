// Conservative source-level release guards for the stacked Aromia Intelligence tranche.
// These guardrails complement runtime tests; they DO NOT establish live deployment safety.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const file = (path) => readFileSync(new URL(`../${path}`,import.meta.url),"utf8");
const path = (name) => new URL(`../${name}`,import.meta.url);
const must = (p) => {assert.ok(existsSync(path(p)),`Missing dependency: ${p}`);return file(p);};

test("journal requires observation schema before decision migration and cannot record approved disposition",()=>{
  const observation=must("apps/api/migrations/027_visual_review_journal.sql");
  const decision=must("apps/api/migrations/028_visual_review_decisions.sql");
  assert.match(observation,/CREATE TABLE IF NOT EXISTS intelligence_visual_reviews/);
  assert.match(decision,/REFERENCES intelligence_visual_reviews\(id\)/);
  assert.match(decision,/CHECK\(decision IN \('changes_requested','rejected','needs_further_evidence'\)\)/);
  assert.doesNotMatch(decision,/decision IN \([^\n]*'approved'/i);
});
test("browser proxies for visual journal and decisions have no mutation exports",()=>{
  for(const p of [
    "apps/web/src/app/api/admin/intelligence/visual-reviews/route.ts",
    "apps/web/src/app/api/admin/intelligence/visual-decisions/[observationId]/route.ts",
    "apps/web/src/app/api/admin/intelligence/visual-replacement-plan/route.ts",
    "apps/web/src/app/api/admin/intelligence/visual-evidence/route.ts",
  ]){
    const source=must(p);
    assert.match(source,/export async function GET\(/);
    assert.doesNotMatch(source,/export (?:async )?function (POST|PATCH|PUT|DELETE)\(/);
  }
});
test("server decision write route explicitly demands separate Publisher credential",()=>{
  const source=must("apps/api/src/routes/admin/intelligence.ts");
  assert.match(source,/intelligenceRouter.post\('\/visual-decisions'/);
  assert.match(source,/req.header\('x-editorial-review-token'\)/);
  assert.match(source,/expected===process.env.ADMIN_API_TOKEN/);
  assert.match(must("apps/api/src/intelligence/visualReviewDecisions.ts"),/publication:'blocked'/);
});
test("image fidelity and replacement cannot claim approval or publishing from a visual match",()=>{
  const fidelity=must("apps/web/src/lib/productIdentityFidelity.ts");
  const plan=must("apps/web/src/lib/visualReplacementPlan.ts");
  assert.match(fidelity,/fidelityVerified:false/);
  assert.match(fidelity,/aestheticOverrideAllowed:false/);
  assert.match(fidelity,/replacementAllowed:false/);
  assert.match(plan,/outcome:"dry_run_only"/);
  assert.match(plan,/applied:false/);
  assert.match(plan,/publication:"blocked"/);
});
