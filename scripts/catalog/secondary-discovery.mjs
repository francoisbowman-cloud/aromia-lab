import { URL } from "node:url";

const SEARCH_TIMEOUT_MS = 6500;
const PAGE_TIMEOUT_MS = 6500;
const TRUSTED_HOSTS = [
  "fragrantica.com", "www.fragrantica.com", "fragrantica.es", "www.fragrantica.es", "beta.fragrantica.com",
  "parfumo.com", "www.parfumo.com", "basenotes.com", "www.basenotes.com",
];
const IDENTITY_STOP_WORDS = new Set(["eau","de","du","des","the","for","pour","by","and","parfum","perfume","edp","edt","edc","extrait","elixir","le","la","les"]);
const GENDER_WORDS = new Set(["homme","femme","uomo","donna","men","women","male","female"]);

function fold(value) { return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
function words(value) { return fold(value).split(/\s+/).filter(Boolean); }
function tokens(value) { return [...new Set(words(value).filter((t)=>!IDENTITY_STOP_WORDS.has(t)))]; }
export function isTrustedSecondaryUrl(url) { try { return TRUSTED_HOSTS.includes(new URL(url).hostname.toLowerCase()); } catch { return false; } }
async function fetchText(url, timeoutMs = PAGE_TIMEOUT_MS) {
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try { const res=await fetch(url,{redirect:"follow",signal:controller.signal,headers:{"user-agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36 AromiaCatalogResearch/2.3","accept-language":"en-US,en;q=0.8"}}); if(!res.ok)throw new Error(`HTTP ${res.status}`); return {text:await res.text(),finalUrl:res.url||url}; }
  finally { clearTimeout(timer); }
}
function unwrap(href, base) { try { const url=new URL(href,base); const uddg=url.searchParams.get("uddg"); if(uddg)return decodeURIComponent(uddg); const target=url.searchParams.get("url")||url.searchParams.get("q"); if(target&&/^https?:/i.test(target))return decodeURIComponent(target); return url.toString(); } catch { return ""; } }
export function parseSearchLinks(html, base="https://www.bing.com") {
  const out=[]; const raw=String(html??"");
  const direct=/https?:\/\/(?:www\.|beta\.)?(?:fragrantica(?:\.com|\.es)|parfumo\.com|basenotes\.com)\/[^"'<>\s&]+/gi;
  for(const match of raw.match(direct)??[]){const url=match.replace(/&amp;.*$/i,"");if(isTrustedSecondaryUrl(url)&&!out.includes(url))out.push(url);}
  const re=/<a[^>]+href=["']([^"']+)["'][^>]*>/gi; let m;
  while((m=re.exec(raw))!==null){const url=unwrap(m[1],base);if(url&&isTrustedSecondaryUrl(url)&&!out.includes(url))out.push(url);}
  return out;
}

export function scoreSecondaryIdentity(candidate,text,url){
  const corpus=new Set(words(`${url} ${String(text??"").slice(0,8000)}`));
  const nt=tokens(candidate.name), bt=tokens(candidate.brand);
  const brandSet=new Set(bt);
  const productTokens=nt.filter((t)=>!brandSet.has(t));
  const requiredProductTokens=productTokens.length?productTokens:nt;
  const hits=nt.filter((t)=>corpus.has(t)).length;
  const brandHits=bt.filter((t)=>corpus.has(t)).length;
  const productHits=requiredProductTokens.filter((t)=>corpus.has(t));
  const coverage=nt.length?hits/nt.length:0;
  const candidateGender=nt.filter((t)=>GENDER_WORDS.has(t));
  const conflictingGender=candidateGender.some((token)=>{
    if(["homme","uomo","men","male"].includes(token)) return ["femme","donna","women","female"].some((x)=>corpus.has(x));
    if(["femme","donna","women","female"].includes(token)) return ["homme","uomo","men","male"].some((x)=>corpus.has(x));
    return false;
  });
  return {confirmed:nt.length>0&&coverage>=0.8&&productHits.length>0&&(bt.length===0||brandHits>=1)&&!conflictingGender,coverage,productHits,conflictingGender};
}
function stripHtml(html){
  return String(html??"")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ")
    .replace(/<img\b[^>]*\balt=["']([^"']+)["'][^>]*>/gi," $1 ")
    .replace(/<br\s*\/?\s*>/gi,"; ")
    .replace(/<\/li\s*>/gi,"; ")
    .replace(/<[^>]+>/g," ")
    .replace(/&amp;/g,"&").replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/&nbsp;/gi," ")
    .replace(/\s*;\s*/g,"; ").replace(/\s+/g," ").trim();
}
function extractGender(text){ const t=String(text??""); if(/for women and men|for men and women|para Hombres y Mujeres|para Mujeres y Hombres|for women & men|for men & women|for women,? and men/i.test(t))return "unisex"; if(/for men\b|para Hombres\b/i.test(t))return "masculino"; if(/for women\b|para Mujeres\b/i.test(t))return "femenino"; return ""; }
function extractConcentration(text){ const head=String(text??"").slice(0,5000); if(/\bExtrait(?: de Parfum)?\b/i.test(head))return "Extrait"; if(/\bElixir\b/i.test(head))return "Elixir"; if(/\bEau de Parfum\b|\bEDP\b/i.test(head))return "EDP"; if(/\bEau de Toilette\b|\bEDT\b/i.test(head))return "EDT"; if(/\bEau de Cologne\b|\bEDC\b/i.test(head))return "EDC"; if(/\bParfum\b/i.test(head))return "Parfum"; return ""; }
function extractLaunchYear(text){ const head=String(text??"").slice(0,9000); const m=head.match(/(?:was launched in|launched in|released in|released|se lanzó en|fue lanzad[oa] en)\s*((?:19|20)\d{2})/i) ?? head.match(/\b((?:19|20)\d{2})\b/); return m?.[1]??""; }
function cleanTier(value){
  const raw=String(value??"").replace(/\b(?:Top|Head|Heart|Middle|Base) Notes?\b/gi," ").replace(/\b(?:Top|Head|Heart|Middle|Base)\b/gi," ");
  const parts=raw.split(/;|,|\band\b|\by\b/i).map((x)=>x.trim()).filter((x)=>x && x.length<=70 && !/^(?:image|notes?|fragrance pyramid)$/i.test(x));
  const out=[]; for(const part of parts){ if(out[out.length-1]?.toLowerCase()===part.toLowerCase())continue; out.push(part); }
  return out.join(";");
}
export function extractNotes(text){
  const t=String(text??"");
  const top=t.match(/Top notes? (?:are|is) ([^.]{3,340})\./i)?.[1]??t.match(/Las Notas de Salida son ([^.]{3,340})\./i)?.[1]??"";
  const mid=t.match(/middle notes? (?:are|is) ([^.]{3,340})\./i)?.[1]??t.match(/Las Notas de Corazón son ([^.]{3,340})\./i)?.[1]??"";
  const base=t.match(/base notes? (?:are|is) ([^.]{3,340})\./i)?.[1]??t.match(/Las Notas de Fondo son ([^.]{3,340})\./i)?.[1]??"";
  if(top||mid||base) return {top_notes:cleanTier(top),middle_notes:cleanTier(mid),base_notes:cleanTier(base),accords:"",notes_structure:(top&&mid&&base)?"PYRAMID":"PARTIAL"};

  const baseNotes=t.match(/fragrance notes\s+(?:Head\s+)?([\s\S]{3,450}?)\s+Heart\s+([\s\S]{3,450}?)\s+Base\s+([\s\S]{3,450}?)(?:\s+Latest Reviews|\s+Reviews|\s+Ratings|$)/i);
  if(baseNotes){ const a=cleanTier(baseNotes[1]),b=cleanTier(baseNotes[2]),c=cleanTier(baseNotes[3]); if(a&&b&&c)return {top_notes:a,middle_notes:b,base_notes:c,accords:"",notes_structure:"PYRAMID"}; }

  const parfumo=t.match(/Fragrance Pyramid\s+(?:Top Notes\s+){1,2}([\s\S]{3,450}?)\s+(?:Heart Notes|Middle Notes)\s+(?:(?:Heart Notes|Middle Notes)\s+)?([\s\S]{3,450}?)\s+Base Notes\s+(?:Base Notes\s+)?([\s\S]{3,450}?)(?:\s+Ratings|\s+Submitted|\s+Smells similar|$)/i);
  if(parfumo){ const a=cleanTier(parfumo[1]),b=cleanTier(parfumo[2]),c=cleanTier(parfumo[3]); if(a&&b&&c)return {top_notes:a,middle_notes:b,base_notes:c,accords:"",notes_structure:"PYRAMID"}; }

  const features=t.match(/The fragrance features ([^.]{3,440})\./i)?.[1]??t.match(/La fragancia (?:contiene|presenta) ([^.]{3,440})\./i)?.[1]??"";
  if(features)return {top_notes:"",middle_notes:"",base_notes:"",accords:cleanTier(features),notes_structure:"FLAT"};
  return {top_notes:"",middle_notes:"",base_notes:"",accords:"",notes_structure:"UNKNOWN"};
}
function yearCompatible(candidateYear,evidenceYear){ const expected=Number(candidateYear),observed=Number(evidenceYear); if(!Number.isFinite(expected)||!Number.isFinite(observed))return true; return Math.abs(expected-observed)<=1; }
export async function discoverSecondaryEvidenceAtUrl(candidate,url){
  if(!isTrustedSecondaryUrl(url))return {status:"UNTRUSTED_URL",source_url:"",error:`untrusted_secondary_url:${url}`};
  try { const page=await fetchText(url); if(!isTrustedSecondaryUrl(page.finalUrl))throw new Error(`redirect_left_trusted_host:${page.finalUrl}`); const text=stripHtml(page.text); const identity=scoreSecondaryIdentity(candidate,text,page.finalUrl); if(!identity.confirmed)return {status:"IDENTITY_MISMATCH",source_url:page.finalUrl,error:`identity_mismatch:${identity.coverage.toFixed(2)}${identity.conflictingGender?":gender_conflict":""}`}; const launch_year=extractLaunchYear(text); if(!yearCompatible(candidate.launch_year,launch_year))return {status:"YEAR_CONFLICT",source_url:page.finalUrl,launch_year,error:`launch_year_conflict:${candidate.launch_year}->${launch_year}`}; const gender=extractGender(text),concentration=extractConcentration(text),notes=extractNotes(text); return {status:"FOUND",source_url:page.finalUrl,gender,concentration,launch_year,...notes,identity_confirmed:"true",secondary_source:"true",evidence_method:`trusted_secondary:${new URL(page.finalUrl).hostname.toLowerCase()}`,identity_coverage:identity.coverage.toFixed(2),error:""}; }
  catch(error){ return {status:"FETCH_FAILED",source_url:url,gender:"",concentration:"",launch_year:"",top_notes:"",middle_notes:"",base_notes:"",accords:"",notes_structure:"UNKNOWN",identity_confirmed:"false",secondary_source:"false",evidence_method:"",error:error.message}; }
}
async function searchLinks(candidate){
  const phrase=`${candidate.brand} ${candidate.name} ${candidate.concentration||""}`.trim();
  const queries=[
    `site:basenotes.com/fragrances ${phrase}`,
    `site:parfumo.com/Perfumes ${phrase}`,
    `site:fragrantica.com/perfume ${phrase}`,
    `site:fragrantica.es/perfume ${phrase}`,
  ];
  const out=[];
  for(const query of queries){
    const q=encodeURIComponent(query);
    const engines=[[`https://www.bing.com/search?q=${q}`,"https://www.bing.com"],[`https://html.duckduckgo.com/html/?q=${q}`,"https://duckduckgo.com"]];
    for(const [url,base] of engines){try{const html=(await fetchText(url,SEARCH_TIMEOUT_MS)).text;for(const link of parseSearchLinks(html,base))if(!out.includes(link))out.push(link);if(out.length>=10)break;}catch{}}
    if(out.length>=10)break;
  }
  return out.slice(0,12);
}
export async function discoverSecondaryEvidence(candidate){ const links=await searchLinks(candidate); const errors=[]; for(const url of links){const result=await discoverSecondaryEvidenceAtUrl(candidate,url);if(result.status==="FOUND")return result;errors.push(`${url}:${result.error||result.status}`);} return {status:"NOT_FOUND",source_url:"",gender:"",concentration:"",launch_year:"",top_notes:"",middle_notes:"",base_notes:"",accords:"",notes_structure:"UNKNOWN",identity_confirmed:"false",secondary_source:"false",evidence_method:"",error:errors.join(" | ").slice(0,1600)}; }
