"use client";
import {useState} from "react";
import {PRODUCT_IDENTITY_FIELDS,assessProductIdentityReview} from "@/lib/productIdentityFidelity";
import type {IdentityObservation,IdentityObservationState} from "@/lib/productIdentityFidelity";

export default function ProductIdentityFidelityChecklist({slug,imageSha256}:{slug:string;imageSha256:string}) {
  const [reference,setReference]=useState("");
  const [items,setItems]=useState<IdentityObservation[]>(PRODUCT_IDENTITY_FIELDS.map(f=>({
    field:f.id,state:"not_checked",note:"",reference:""
  })));
  const [result,setResult]=useState<ReturnType<typeof assessProductIdentityReview>|null>(null);
  const [error,setError]=useState("");
  function change(field:IdentityObservation["field"],patch:Partial<IdentityObservation>) {
    setItems(all=>all.map(row=>row.field===field?{...row,...patch}:row));
    setResult(null);
    setError("");
  }
  function assess(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try{
      const verdict=assessProductIdentityReview({
        productSlug:slug,imageSha256,authoritativeProductReference:reference,observations:items
      });
      setResult(verdict);setError("");
    }catch{
      setError("Completa las observaciones y referencias exigidas para cada comparación declarada.");
      setResult(null);
    }
  }
  return <section className="rounded border border-stone-300 bg-white p-5 text-stone-900" aria-labelledby="identity-fidelity-title">
    <h2 id="identity-fidelity-title" className="text-xl font-semibold">Fidelidad de identidad del producto</h2>
    <p className="mt-2 text-sm text-stone-700"><strong>La imagen debe representar el producto real.</strong> Un resultado espectacular nunca justifica etiquetas, textos, logotipos, geometrías, colores, proporciones ni rasgos inventados o incorrectos.</p>
    <p className="mt-2 break-all text-xs text-stone-600">Producto: {slug} · SHA-256 inspeccionado: {imageSha256}</p>
    <form className="mt-4 space-y-3" onSubmit={assess}>
      <label className="block text-sm font-medium">Referencia maestra del producto real
        <input value={reference} maxLength={1500} onChange={event=>{setReference(event.target.value);setResult(null);}}
          placeholder="URL/documento del fabricante y variante exacta (no validado automáticamente)"
          className="mt-1 block w-full rounded border border-stone-400 p-3 text-stone-950"/>
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        {PRODUCT_IDENTITY_FIELDS.map(field=>{
          const row=items.find(i=>i.field===field.id)!;
          return <fieldset key={field.id} className="space-y-2 rounded border border-stone-200 p-3">
            <legend className="font-semibold">{field.label}</legend>
            <p className="text-xs text-stone-600">{field.description}</p>
            <label className="block text-xs font-medium">Resultado de inspección
              <select className="mt-1 w-full rounded border border-stone-400 p-2"
                value={row.state} onChange={event=>change(field.id,{state:event.target.value as IdentityObservationState})}>
                <option value="not_checked">Sin comprobar</option>
                <option value="claimed_match">Coincidencia declarada (pendiente de validar)</option>
                <option value="mismatch">Diferencia detectada</option>
              </select>
            </label>
            <label className="block text-xs font-medium">Observación
              <textarea rows={2} maxLength={1500} value={row.note} onChange={e=>change(field.id,{note:e.target.value})}
                className="mt-1 w-full rounded border border-stone-400 p-2"/>
            </label>
            <label className="block text-xs font-medium">Referencia de comparación
              <input maxLength={1500} value={row.reference} onChange={e=>change(field.id,{reference:e.target.value})}
                className="mt-1 w-full rounded border border-stone-400 p-2"/>
            </label>
          </fieldset>;
        })}
      </div>
      <button type="submit" className="rounded bg-stone-900 px-4 py-3 text-white">Evaluar discrepancias sin aprobar</button>
    </form>
    {error&&<p role="alert" className="mt-3 text-sm text-red-900">{error}</p>}
    {result&&<div className="mt-4 rounded border border-stone-300 p-4" role="status">
      <p className="font-semibold">{result.state==="material_mismatch_blocked"?"Recurso incompatible: revisión bloqueada":"Verificación independiente pendiente"}</p>
      <p className="mt-2 text-sm">{result.checks.mismatches} diferencias · {result.checks.unchecked} sin comprobar · {result.checks.claimedMatches} coincidencias declaradas de {result.checks.total} características.</p>
      <p className="mt-2 text-sm">{result.next}</p>
      <p className="mt-2 text-sm font-semibold">No se autoriza la sustitución ni la publicación. La evaluación no se guarda en el servidor.</p>
    </div>}
  </section>;
}
