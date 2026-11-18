// Static component contract checks: do not claim interactive browser or SSR coverage.
// Actual signed-session + API proxy integration is tested separately.
import {expect,it} from "vitest";
import {readFileSync} from "node:fs";
const src=(name:string)=>readFileSync(new URL(`../components/admin/${name}`,import.meta.url),"utf8");
it("keeps all eight product-identity criteria in the review UI",()=>{
  const markup=src("ProductIdentityFidelityChecklist.tsx");
  expect(markup).toContain("PRODUCT_IDENTITY_FIELDS.map");
  expect(markup).toContain("Sin comprobar");
  expect(markup).toContain("Diferencia detectada");
  expect(markup).toContain("No se autoriza");
  expect(markup).toContain("assessProductIdentityReview");
});
it("offers only reading and refreshing the decision history, not a decision approval button",()=>{
  const markup=src("VisualDecisionTimeline.tsx");
  expect(markup).toContain("Ver decisiones supervisadas");
  expect(markup).toContain("adminRequest<ResponseBody>");
  expect(markup).toContain("applied!==false");
  expect(markup).not.toContain("Aprobar imagen");
});
it("labels visual replacement a dry-run and requires blocked status",()=>{
  const markup=src("VisualReplacementDryRun.tsx");
  expect(markup).toContain("Simular sustitución, sin aplicar");
  expect(markup).toContain('result.outcome!=="dry_run_only"');
  expect(markup).toContain('result.publication!=="blocked"');
  expect(markup).not.toContain("Aplicar reemplazo");
});
