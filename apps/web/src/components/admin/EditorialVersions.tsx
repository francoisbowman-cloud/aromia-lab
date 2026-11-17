"use client";
import { useEffect, useState } from 'react';
import { adminRequest } from '@/lib/adminRequest';
type Version={id:number;kind:string;version:number;content:string;source_urls:string[]};
const kinds:Record<string,string>={research_note:'Nota de investigación',draft:'Borrador',fact_check:'Revisión factual',edit:'Edición',art_brief:'Brief visual',qa_report:'Informe de QA'};
export default function EditorialVersions({id,sources,editable}:{id:string;sources:string[];editable:boolean}) {
 const [versions,setVersions]=useState<Version[]>([]),[kind,setKind]=useState('draft'),[content,setContent]=useState(''),[refs,setRefs]=useState<string[]>([]),[error,setError]=useState(''),[busy,setBusy]=useState(false),[loaded,setLoaded]=useState(false);
 useEffect(()=>{const c=new AbortController();adminRequest<{artifacts:Version[]}>(`/api/admin/intelligence/${id}/artifacts`,{signal:c.signal}).then(r=>{setVersions(r.artifacts);setLoaded(true);}).catch(()=>{if(!c.signal.aborted)setError('No se pudo cargar el historial de versiones. Vuelve a abrir el expediente.');});return()=>c.abort();},[id]);
 async function save(e:React.FormEvent) {
  e.preventDefault();setBusy(true);setError('');
  try {
   const result=await adminRequest<Version>(`/api/admin/intelligence/${id}/artifacts`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind,content,sourceUrls:refs,expectedVersion:Math.max(0,...versions.filter(v=>v.kind===kind).map(v=>v.version))})});
   setVersions(v=>[result,...v]);setContent('');setRefs([]);
  }catch {setError('No se pudo guardar. Conservamos el texto: puede haber una versión más reciente o faltar la migración del módulo. Copia tu texto antes de recargar.');}
  finally{setBusy(false);}
 }
 return <section className="space-y-4 border-t pt-5"><h3 className="text-xl font-semibold">Materiales y versiones</h3><p>Guardar una revisión no aprueba el artículo ni acredita hechos o derechos.</p>
 {error&&<p role="alert" className="text-red-800">{error}</p>}
 {versions.map(v=><details key={v.id} className="rounded border p-3"><summary>{kinds[v.kind]} · versión {v.version}</summary><pre className="mt-3 whitespace-pre-wrap break-words font-sans">{v.content}</pre><p className="mt-3 break-all text-sm">Fuentes vinculadas: {v.source_urls.join(' · ')}</p></details>)}
 {editable&&<form onSubmit={save} className="space-y-3"><fieldset disabled={busy||!loaded} className="space-y-3">
 <label className="block">Tipo de material<select value={kind} onChange={e=>setKind(e.target.value)} className="ml-3 rounded border p-2">{Object.entries(kinds).map(([k,label])=><option key={k} value={k}>{label}</option>)}</select></label>
 <label className="block">Contenido de la nueva versión<textarea required maxLength={100000} value={content} onChange={e=>setContent(e.target.value)} className="block min-h-36 w-full rounded border bg-white p-3 text-stone-950"/></label>
 <p>Selecciona las fuentes utilizadas:</p>{sources.map(url=><label key={url} className="flex gap-2 break-all"><input type="checkbox" checked={refs.includes(url)} onChange={e=>setRefs(v=>e.target.checked?[...v,url]:v.filter(x=>x!==url))}/>{url}</label>)}
 <button disabled={refs.length===0} className="rounded border px-4 py-2 disabled:opacity-50">{busy?'Guardando versión…':'Guardar nueva versión'}</button>
 </fieldset></form>}
 </section>;
}
