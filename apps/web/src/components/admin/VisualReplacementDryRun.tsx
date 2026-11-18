"use client";
import {useState} from "react";
import {adminRequest} from "@/lib/adminRequest";
type Proposal={
  proposalId:string;productSlug:string;
  oldAsset:{url:string;bytesSha256:string};
  proposedAsset:{url:string;bytesSha256:string};
  rollbackProposal:{restoreUrl:string;restoreSha256:string;requiresOriginalBytesPreserved:true;requiresNewReviewAndAuthorization:true};
  outcome:"dry_run_only";applied:false;approved:false;publication:"blocked";
};
export default function VisualReplacementDryRun({slug,currentUrl}:{slug:string;currentUrl:string}) {
  const [candidate,setCandidate]=useState(""),[reason,setReason]=useState("");
  const [busy,setBusy]=useState(false),[error,setError]=useState(""),[plan,setPlan]=useState<Proposal|null>(null);
  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);setError("");setPlan(null);
    try{
      const q=new URLSearchParams({slug,current:currentUrl,candidate:candidate.trim(),reason:reason.trim()});
      const result=await adminRequest<Proposal>(`/api/admin/intelligence/visual-replacement-plan?${q}`);
      if(result.outcome!=="dry_run_only"||result.applied!==false||result.approved!==false||
         result.publication!=="blocked"||result.productSlug!==slug ||
         result.oldAsset.url!==currentUrl ||result.proposedAsset.url!==candidate.trim() ||
         !/^[a-f0-9]{64}$/.test(result.proposalId))throw new Error("unexpected_visual_replacement_state");
      setPlan(result);
    }catch{
      setError("No se pudo preparar la simulación. Revisa las rutas locales, la sesión y el estado del inspector.");
    }finally{setBusy(false);}
  }
  return <section className="mt-4 space-y-3 rounded border border-stone-300 bg-white p-4" aria-labelledby="visual-replacement-title">
    <h3 id="visual-replacement-title" className="text-lg font-semibold">Propuesta de sustitución · simulación</h3>
    <p className="text-sm text-stone-700">No cambia fotografías, fichas ni publicaciones. Compara dos archivos ya existentes y prepara un plan de reversión sujeto a verificación humana.</p>
    <p className="break-all text-xs text-stone-600">Actual: {currentUrl}</p>
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm font-medium">Ruta local de la imagen candidata
        <input required maxLength={512} value={candidate} onChange={e=>{setCandidate(e.target.value);setPlan(null);}}
          placeholder="/editorial-v1/alternative.webp" className="mt-1 block w-full rounded border border-stone-400 p-3 text-stone-950"/>
      </label>
      <label className="block text-sm font-medium">Motivo editorial
        <textarea required minLength={10} maxLength={3000} rows={3} value={reason}
          onChange={e=>{setReason(e.target.value);setPlan(null);}}
          className="mt-1 block w-full rounded border border-stone-400 p-3 text-stone-950"/>
      </label>
      <button disabled={busy} type="submit" className="rounded bg-stone-900 px-4 py-3 text-white disabled:opacity-60">
        {busy?"Comparando…":"Simular sustitución, sin aplicar"}
      </button>
    </form>
    {error&&<p role="alert" className="text-sm text-red-900">{error}</p>}
    {plan&&<div className="space-y-2 rounded border border-amber-300 bg-amber-50 p-4 text-sm">
      <p className="font-semibold">Simulación preparada · ningún archivo modificado</p>
      <p className="break-all">Huella actual: {plan.oldAsset.bytesSha256}</p>
      <p className="break-all">Huella candidata: {plan.proposedAsset.bytesSha256}</p>
      <p className="break-all">ID de propuesta: {plan.proposalId}</p>
      <p className="break-all">Reversión propuesta: restaurar {plan.rollbackProposal.restoreUrl} ({plan.rollbackProposal.restoreSha256}).</p>
      <p className="font-medium">La reversión no se puede garantizar sin conservar los bytes originales. Identidad, derechos, revisión y autorización siguen pendientes.</p>
    </div>}
  </section>;
}
