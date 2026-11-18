"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { adminRequest } from "@/lib/adminRequest";
type Decision={id:number;observation_id:number;decision_key:string;decision:"changes_requested"|"rejected"|"needs_further_evidence";reason:string;actor:string;recorded_at:string};
type ResponseBody={decisions:Decision[];approval:false;publication:"blocked";applied:false};
const labels={changes_requested:"Cambios solicitados",rejected:"Imagen rechazada",needs_further_evidence:"Falta evidencia"} as const;
export default function VisualDecisionTimeline({observationId}:{observationId:number}) {
  const [open,setOpen]=useState(false),[busy,setBusy]=useState(false);
  const [loaded,setLoaded]=useState(false),[error,setError]=useState("");
  const [decisions,setDecisions]=useState<Decision[]>([]);
  const active=useRef<AbortController|null>(null);
  const load=useCallback(async()=>{
    if(!Number.isSafeInteger(observationId)||observationId<=0)return;
    active.current?.abort();
    const controller=new AbortController();active.current=controller;
    setBusy(true);setError("");
    try{
      const result=await adminRequest<ResponseBody>(`/api/admin/intelligence/visual-decisions/${observationId}`,{signal:controller.signal});
      if(controller.signal.aborted)return;
      if(result.approval!==false || result.publication!=="blocked" ||
         result.applied!==false || !Array.isArray(result.decisions) ||
         result.decisions.some(d=>d.observation_id!==observationId ||
           !["changes_requested","rejected","needs_further_evidence"].includes(d.decision)))
        throw new Error("invalid_visual_decision_response");
      setDecisions(result.decisions);setLoaded(true);
    }catch{
      if(!controller.signal.aborted){setLoaded(false);setError("No se pudo consultar el historial de decisiones. Comprueba la habilitación y la sesión.");}
    }finally{
      if(active.current===controller)setBusy(false);
    }
  },[observationId]);
  useEffect(()=>()=>active.current?.abort(),[]);
  function toggle(){if(!open && !loaded)void load();setOpen(v=>!v);}
  return <div className="mt-3 border-t border-stone-200 pt-3">
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" aria-expanded={open} onClick={toggle} className="text-sm font-semibold underline">
        {open?"Ocultar decisiones":"Ver decisiones supervisadas"}
      </button>
      {open&&<button type="button" onClick={()=>void load()} disabled={busy} className="rounded border border-stone-400 px-3 py-1 text-xs">{busy?"Actualizando…":"Actualizar"}</button>}
    </div>
    {open&&<>
      <p className="mt-2 text-xs text-stone-600">Solo lectura. Ninguna decisión autoriza publicación, sustitución de archivos ni uso de derechos.</p>
      {busy&&<p role="status" className="mt-2 text-sm">Consultando decisiones…</p>}
      {error&&<p role="alert" className="mt-2 text-sm text-red-900">{error}</p>}
      {loaded&&<div className="mt-3">
        {decisions.length===0?<p className="text-sm">No hay decisiones registradas para esta observación.</p>:
          <ol className="space-y-2">{decisions.map(d=><li key={d.id} className="rounded bg-stone-100 p-3 text-sm">
            <p className="font-semibold">{labels[d.decision]}</p>
            <p className="mt-1 whitespace-pre-wrap break-words">{d.reason}</p>
            <p className="mt-2 text-xs text-stone-600">{new Date(d.recorded_at).toLocaleString("es")} · Ref. {d.decision_key}</p>
          </li>)}</ol>}
      </div>}
    </>}
  </div>;
}
