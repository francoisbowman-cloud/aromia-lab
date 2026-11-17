"use client";
import {useState} from "react";
import {assessProvenanceDossier,validateProvenanceDossier} from "@/lib/visualProvenance";
type Props={slug:string;imageUrl:string;sha256:string};
type FormValues={brandClaim:string;fragranceClaim:string;concentrationClaim:string;flankerClaim:string;packagingClaim:string;sourceUrl:string;sourceKind:"manufacturer"|"authorized_retailer"|"original_editorial"|"other";rightsBasis:"unknown"|"permission_documented"|"restricted";rightsReference:string;identityNotes:string;visualNotes:string};
const initial:FormValues={brandClaim:"",fragranceClaim:"",concentrationClaim:"",flankerClaim:"",packagingClaim:"",
  sourceUrl:"",sourceKind:"manufacturer",rightsBasis:"unknown",rightsReference:"",
  identityNotes:"",visualNotes:""};
export default function VisualProvenanceDraft({slug,imageUrl,sha256}:Props) {
  const [form,setForm]=useState<FormValues>(initial);
  const [draft,setDraft]=useState("");
  const [error,setError]=useState("");
  const update=(key:keyof FormValues,value:string)=>setForm(previous=>({...previous,[key]:value}));
  function prepare(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();setDraft("");setError("");
    try{
      const valid=validateProvenanceDossier({schemaVersion:1,productSlug:slug,imageUrl,imageSha256:sha256,...form});
      const verdict=assessProvenanceDossier(valid);
      setDraft(JSON.stringify({dossier:valid,assessment:verdict},null,2));
    }catch{
      setError("El expediente está incompleto o contiene un enlace/ruta no permitido. Revisa todos los campos.");
    }
  }
  return <section className="mt-5 rounded border border-stone-300 p-4" aria-labelledby="source-dossier-title">
    <h3 id="source-dossier-title" className="text-lg font-semibold">Expediente de procedencia — borrador local</h3>
    <p className="mt-1 text-sm text-stone-700">Fuente aportada por el editor. No se consulta ni valida de forma automática. No envía, firma ni guarda aprobaciones.</p>
    <p className="mt-2 break-all text-xs text-stone-600">Perfume: {slug} · Archivo: {imageUrl} · SHA: {sha256}</p>
    <form onSubmit={prepare} className="mt-4 grid gap-3 sm:grid-cols-2">
      {(["brandClaim","fragranceClaim","concentrationClaim","flankerClaim","packagingClaim","rightsReference","identityNotes","visualNotes"] as const).map(field=>
        <label key={field} className="text-sm font-medium">{({
          brandClaim:"Marca declarada",fragranceClaim:"Perfume declarado",concentrationClaim:"Concentración exacta",
          flankerClaim:"Variante / flanker",packagingClaim:"Envase / presentación",rightsReference:"Referencia documental de derechos",
          identityNotes:"Observaciones de identidad",visualNotes:"Observaciones visuales"
        } as const)[field]}
          <textarea maxLength={field==="identityNotes"||field==="visualNotes"?4000:field==="rightsReference"?1500:300}
            rows={2} value={form[field]} required onChange={event=>update(field,event.target.value)}
            className="mt-1 block w-full rounded border border-stone-400 bg-white p-2 text-stone-950"/>
        </label>
      )}
      <label className="text-sm font-medium">URL HTTPS de la fuente
        <input type="url" required value={form.sourceUrl} maxLength={1500}
          onChange={event=>update("sourceUrl",event.target.value)}
          className="mt-1 block w-full rounded border border-stone-400 bg-white p-2 text-stone-950"/>
      </label>
      <label className="text-sm font-medium">Tipo de fuente
        <select value={form.sourceKind} onChange={event=>update("sourceKind",event.target.value)}
          className="mt-1 block w-full rounded border border-stone-400 bg-white p-2 text-stone-950">
          <option value="manufacturer">Fabricante</option>
          <option value="authorized_retailer">Distribuidor autorizado</option>
          <option value="original_editorial">Fotografía editorial propia</option>
          <option value="other">Otra</option>
        </select>
      </label>
      <label className="text-sm font-medium">Derechos alegados (no verificados)
        <select value={form.rightsBasis} onChange={event=>update("rightsBasis",event.target.value)}
          className="mt-1 block w-full rounded border border-stone-400 bg-white p-2 text-stone-950">
          <option value="unknown">Desconocidos</option>
          <option value="permission_documented">Permiso documentado — pendiente de validar</option>
          <option value="restricted">Restringidos</option>
        </select>
      </label>
      <div className="sm:col-span-2">
        <button type="submit" className="rounded bg-stone-900 px-4 py-3 text-white">Preparar expediente sin guardar</button>
      </div>
    </form>
    {error&&<p role="alert" className="mt-3 text-sm text-red-900">{error}</p>}
    {draft&&<div className="mt-4">
      <p className="font-medium text-amber-900">Borrador generado. Validación independiente y publicación: pendientes.</p>
      <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap break-all rounded bg-stone-100 p-3 text-xs">{draft}</pre>
    </div>}
  </section>;
}
