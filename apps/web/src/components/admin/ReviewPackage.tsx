"use client";
import { useEffect, useState } from 'react';
import { adminRequest } from '@/lib/adminRequest';
type Package={hash:string;blockers:string[];reviewCurrent:boolean;review:null|{decision:string;note:string};sources:{url:string;sha256:string;excerpt_found:boolean}[]};
export default function ReviewPackage({id}:{id:string}) {
 const [data,setData]=useState<Package|null>(null),[error,setError]=useState(''),[counter,setCounter]=useState(0);
 useEffect(()=>{const c=new AbortController();setError('');setData(null);adminRequest<Package>(`/api/admin/intelligence/${id}/review-package`,{signal:c.signal}).then(setData).catch(()=>{if(!c.signal.aborted)setError('No se pudo comprobar el paquete. Reintenta o verifica la migración de revisión.');});return()=>c.abort();},[id,counter]);
 return <section className="space-y-3 border-t pt-5"><h3 className="text-xl font-semibold">Paquete de revisión</h3><button type="button" onClick={()=>setCounter(n=>n+1)} className="rounded border px-4 py-2">Actualizar paquete</button>{error&&<p role="alert">{error}</p>}{data&&<>
 <p className="break-all text-sm">Huella de versiones: {data.hash}</p>
 <p>{data.blockers.length?'Faltan materiales o capturas de fuentes.':'Materiales reunidos. Falta evaluar su calidad editorial y factual.'}</p>
 <ul>{data.blockers.map(b=><li key={b} className="break-all">{b}</li>)}</ul>
 <p>{!data.review?'Sin decisión editorial registrada.':!data.reviewCurrent?'La revisión anterior corresponde a otras versiones.':data.review.decision==='approved'?'Revisión registrada para estas versiones.':'Se solicitaron cambios.'}</p>
 <p>Este panel no publica. Recuperar una fuente no verifica sus afirmaciones ni sus derechos.</p>
 {data.sources.map(s=><details key={s.url+s.sha256}><summary className="break-all">{s.url}</summary><p className="break-all text-sm">SHA256: {s.sha256}</p><p>{s.excerpt_found?'Extracto localizado literalmente.':'El extracto no coincide literalmente; requiere revisión.'}</p></details>)}
 </>}</section>;
}
