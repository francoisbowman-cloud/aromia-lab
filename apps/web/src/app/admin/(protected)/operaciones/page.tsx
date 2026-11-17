"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import ReviewPackage from "@/components/admin/ReviewPackage";
import EditorialVersions from "@/components/admin/EditorialVersions";
import { adminRequest } from '@/lib/adminRequest';
import ProjectProgress from '@/components/admin/ProjectProgress';
type Job = {id:string;status:string;attempts:number;updated_at:string;error_code:string|null};
type Detail = Job & {payload:{title:string;question:string;sources:{url:string;excerpt:string}[]};result:null|{publication:string;providerCostMicros:number;checks:Record<string,string>};events:{event:string;created_at:string}[]};
const labels:Record<string,string>={queued:'En cola',running:'En ejecución',awaiting_review:'Pendiente de revisión',failed:'Falló',cancelled:'Cancelado'};
export default function Operations() {
  const [jobs,setJobs]=useState<Job[]>([]),[detail,setDetail]=useState<Detail|null>(null);
  const [error,setError]=useState(''),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true),[confirm,setConfirm]=useState(false);
  const [title,setTitle]=useState(''),[question,setQuestion]=useState(''),[url,setUrl]=useState(''),[excerpt,setExcerpt]=useState('');
  const key=useRef<string|null>(null), selection=useRef<AbortController|null>(null);
  const refresh=useCallback(async()=>{
    setLoading(true);setError('');
    try {setJobs((await adminRequest<{jobs:Job[]}>('/api/admin/intelligence')).jobs);}
    catch {setError('No se pudo cargar Operaciones. Comprueba la sesión y que el módulo esté habilitado.');}
    finally {setLoading(false);}
  },[]);
  useEffect(()=>{void refresh();return()=>selection.current?.abort();},[refresh]);
  async function open(id:string) {
    selection.current?.abort();const controller=new AbortController();selection.current=controller;
    setDetail(null);setConfirm(false);setError('');
    try {const d=await adminRequest<Detail>(`/api/admin/intelligence/${id}`,{signal:controller.signal});if(!controller.signal.aborted)setDetail(d);}
    catch {if(!controller.signal.aborted)setError('No se pudo abrir el expediente. Vuelve a seleccionarlo.');}
  }
  async function create(event:React.FormEvent) {
    event.preventDefault();setBusy(true);setError('');
    key.current??=crypto.randomUUID();
    try {
      const j=await adminRequest<Job>('/api/admin/intelligence',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:key.current,brief:{title,question,sources:[{url,excerpt}]}})});
      key.current=null;setTitle('');setQuestion('');setUrl('');setExcerpt('');await refresh();await open(j.id);
    } catch {setError('No se pudo crear el expediente. El texto se conserva; puedes reintentar.');}
    finally {setBusy(false);}
  }
  async function action(action:'cancel'|'retry') {
    if(!detail)return;const id=detail.id;setBusy(true);setError('');
    try {await adminRequest(`/api/admin/intelligence/${id}/${action}`,{method:'POST'});await refresh();await open(id);}
    catch {setError('La operación no se completó o el estado cambió. Actualiza antes de reintentar.');}
    finally {setBusy(false);setConfirm(false);}
  }
  const input='block w-full rounded border border-stone-300 bg-white p-3 text-stone-950';
  return <div className="mx-auto max-w-6xl space-y-8 text-stone-900">
    <header><h1 className="text-3xl font-semibold">Operaciones editoriales</h1><p className="mt-2">Preparación interna de expedientes. Ninguna acción de este panel publica artículos.</p></header>
    <ProjectProgress compact />
    {error&&<p role="alert" className="border border-red-300 bg-red-50 p-4 text-red-900">{error}</p>}
    <section aria-labelledby="jobs-title" className="rounded border bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="jobs-title" className="text-xl font-semibold">Trabajos recientes</h2><button type="button" disabled={loading||busy} onClick={()=>void refresh()} className="rounded border px-4 py-2">Actualizar</button></div>
      <p role="status" className="my-3">{loading?'Cargando…':`${jobs.length} trabajos · se muestran los últimos 100`}</p>
      {!loading&&!error&&jobs.length===0&&<p>No hay trabajos todavía. Prepara el primer expediente abajo.</p>}
      <ul className="divide-y">{jobs.map(j=><li key={j.id}><button disabled={busy} onClick={()=>void open(j.id)} className="flex min-h-14 w-full flex-wrap justify-between gap-2 py-3 text-left underline-offset-4 hover:underline"><span>{labels[j.status]??j.status} · {j.id.slice(0,8)}</span><span>{j.attempts} intentos · {new Date(j.updated_at).toLocaleString('es')}</span></button></li>)}</ul>
    </section>
    {detail&&<section aria-labelledby="detail-title" className="space-y-4 rounded border bg-white p-5">
      <h2 id="detail-title" className="text-2xl font-semibold">{detail.payload.title}</h2><p>{detail.payload.question}</p><p>Estado: {labels[detail.status]??detail.status}</p>
      <h3 className="font-semibold">Fuentes aportadas — verificación pendiente</h3>
      {detail.payload.sources.map((s,i)=><div key={i} className="border-l-2 pl-3"><p className="break-all">{s.url}</p><blockquote className="whitespace-pre-wrap">{s.excerpt}</blockquote></div>)}
      {detail.result&&<div><p>Gasto en proveedores: {detail.result.providerCostMicros/1000000}. Cómputo local no medido.</p><p>Publicación bloqueada. La preparación automática no acredita veracidad ni derechos.</p></div>}
      {detail.error_code&&<p>Error registrado: {detail.error_code}</p>}
      <EditorialVersions key={detail.id} id={detail.id} sources={detail.payload.sources.map(s=>s.url)} editable={detail.status==='awaiting_review'}/>
      <ReviewPackage key={detail.id+detail.updated_at} id={detail.id}/>
      <h3 className="font-semibold">Historial</h3><ol className="space-y-1">{detail.events.map((e,i)=><li key={i}>{new Date(e.created_at).toLocaleString('es')} · {e.event}</li>)}</ol>
      {detail.status==='failed'&&<button disabled={busy} onClick={()=>void action('retry')} className="rounded border px-4 py-2">Reintentar trabajo</button>}
      {['queued','running','awaiting_review'].includes(detail.status)&&!confirm&&<button disabled={busy} onClick={()=>setConfirm(true)} className="rounded border px-4 py-2">Cancelar trabajo</button>}
      {confirm&&<div className="space-x-3 border p-4"><p className="mb-3">Se detendrá este trabajo; su historial se conserva.</p><button disabled={busy} onClick={()=>void action('cancel')} className="rounded border px-4 py-2">Confirmar cancelación</button><button disabled={busy} onClick={()=>setConfirm(false)} className="rounded border px-4 py-2">Conservar trabajo</button></div>}
    </section>}
    <form onSubmit={create} className="space-y-4 rounded border bg-white p-5"><h2 className="text-xl font-semibold">Nuevo expediente</h2><p>Aporta una pregunta y una fuente. El trabajador preparará el expediente cuando se ejecute; aún no redacta ni investiga por su cuenta.</p>
      <fieldset disabled={busy} className="space-y-4">
        <label className="block">Título<input required maxLength={200} value={title} onChange={e=>{setTitle(e.target.value);key.current=null;}} className={input}/></label>
        <label className="block">Pregunta editorial<textarea required maxLength={2000} value={question} onChange={e=>{setQuestion(e.target.value);key.current=null;}} className={input}/></label>
        <label className="block">URL de la fuente (HTTPS)<input required type="url" pattern="https://.*" maxLength={2000} value={url} onChange={e=>{setUrl(e.target.value);key.current=null;}} className={input}/></label>
        <label className="block">Extracto de la fuente<textarea required maxLength={10000} value={excerpt} onChange={e=>{setExcerpt(e.target.value);key.current=null;}} className={input}/></label>
        <button className="rounded bg-stone-900 px-5 py-3 text-white" type="submit">{busy?'Guardando…':'Preparar expediente'}</button>
      </fieldset>
    </form>
  </div>;
}
