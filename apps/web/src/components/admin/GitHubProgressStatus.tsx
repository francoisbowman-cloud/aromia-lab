"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { adminRequest } from "@/lib/adminRequest";

type Pull = {number:number;title:string;state:"merged"|"open"|"draft"|"closed_without_merge";url:string;headSha:string;updatedAt:string;ci:"not_checked"};
type Feed = {source:"github_rest_pr_metadata";fetchedAt:string;pulls:Pull[];milestonesAutomaticallyApproved:false;ciVerifiedByThisFeed:false};
const labels:Record<Pull["state"],string> = {
  merged:"Fusionada", open:"Abierta", draft:"Borrador", closed_without_merge:"Cerrada sin fusionar",
};
export default function GitHubProgressStatus() {
  const [data,setData]=useState<Feed|null>(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const requestRef=useRef<AbortController|null>(null);
  const refresh=useCallback(async()=>{
    requestRef.current?.abort();
    const controller=new AbortController();requestRef.current=controller;
    setBusy(true);setError("");
    try {
      const response=await adminRequest<Feed>("/api/admin/progress-status",{signal:controller.signal});
      if(controller.signal.aborted)return;
      if(response.source!=="github_rest_pr_metadata" || response.milestonesAutomaticallyApproved!==false ||
         response.ciVerifiedByThisFeed!==false || !Array.isArray(response.pulls))throw new Error("Invalid source");
      setData(response);
    }catch{
      if(!controller.signal.aborted){setData(null);setError("Estado de GitHub no disponible o sin autorización. El progreso documentado no ha sido modificado.");}
    }finally{
      if(requestRef.current===controller)setBusy(false);
    }
  },[]);
  useEffect(()=>{void refresh();return()=>requestRef.current?.abort();},[refresh]);
  return <section className="rounded border border-stone-300 bg-white p-5 text-stone-900" aria-labelledby="github-progress-title">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 id="github-progress-title" className="text-xl font-semibold">Actividad verificada en GitHub</h2>
      <button type="button" disabled={busy} onClick={()=>void refresh()} className="rounded border border-stone-400 px-4 py-2 text-sm disabled:opacity-60">
        {busy?"Consultando…":"Actualizar"}
      </button>
    </div>
    <p className="mt-2 text-sm text-stone-700">Se consulta el estado de PR concretas. Estar abierta, fusionada o tener un commit no modifica automáticamente el porcentaje de hitos.</p>
    {error&&<p role="alert" className="mt-3 rounded border border-amber-300 bg-amber-50 p-3 text-sm">{error}</p>}
    {data&&<>
      <p role="status" className="mt-3 text-sm text-stone-600">Consulta: {new Date(data.fetchedAt).toLocaleString("es")} · {data.pulls.length} PR observadas · CI no comprobado por este indicador.</p>
      <ol className="mt-4 divide-y divide-stone-200">
        {data.pulls.map(pr=><li key={pr.number} className="flex flex-wrap items-center justify-between gap-2 py-3">
          <div className="min-w-0">
            <a href={pr.url} target="_blank" rel="noopener noreferrer" className="font-medium underline">PR #{pr.number}</a>
            <p className="break-words text-sm text-stone-700">{pr.title}</p>
            <p className="text-xs text-stone-600">Head {pr.headSha.slice(0,7)} · {labels[pr.state]}</p>
          </div>
          <span className="rounded bg-stone-100 px-2 py-1 text-sm text-stone-800">{labels[pr.state]}</span>
        </li>)}
      </ol>
    </>}
  </section>;
}
