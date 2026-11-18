// Isolated SSR component smoke. This is NOT interactive browser/mobile QA.
import {expect,it} from "vitest";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import ProductIdentityFidelityChecklist from "@/components/admin/ProductIdentityFidelityChecklist";
import VisualDecisionTimeline from "@/components/admin/VisualDecisionTimeline";
import VisualReplacementDryRun from "@/components/admin/VisualReplacementDryRun";
it("renders all eight required fidelity checks with publication safeguards",()=>{
  const html=renderToStaticMarkup(createElement(ProductIdentityFidelityChecklist,{
    slug:"chance-eau-tendre",imageSha256:"a".repeat(64)
  }));
  for(const label of ["Etiqueta y disposición","Textos legibles","Logotipos y marcas",
    "Geometría del producto","Colores","Dimensiones y proporciones",
    "Elementos distintivos","Identidad de variante"])expect(html).toContain(label);
  expect(html).toContain("No se autoriza");
});
it("shows non-authorizing decision timeline affordance",()=>{
  const html=renderToStaticMarkup(createElement(VisualDecisionTimeline,{observationId:51}));
  expect(html).toContain("Ver decisiones supervisadas");
  // No decisions are fetched or authorized during rendering.
  expect(html).not.toContain("Aprobar imagen");
});
it("renders replacement as a simulation rather than an apply action",()=>{
  const html=renderToStaticMarkup(createElement(VisualReplacementDryRun,{
    slug:"chance-eau-tendre",currentUrl:"/editorial-v1/current.webp"
  }));
  expect(html).toContain("Simular sustitución, sin aplicar");
  expect(html).toContain("No cambia fotografías");
  expect(html).not.toContain("Aplicar reemplazo");
});
