import { URL } from "node:url";

const SEARCH_TIMEOUT_MS = 6500;
const PAGE_TIMEOUT_MS = 6500;
const TRUSTED_HOSTS = ["fragrantica.com", "www.fragrantica.com", "fragrantica.es", "www.fragrantica.es"];

function fold(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function tokens(value) {
  const stop = new Set(["eau","de","du","des","the","for","pour","parfum","perfume","edp","edt","edc","extrait","elixir","le","la","les","and","homme","uomo"]);
  return [...new Set(fold(value).split(/\s+/).filter((t) => t.length >= 3 && !stop.has(t)))];
}
function trusted(url) {
  try { return TRUSTED_HOSTS.includes(new URL(url).hostname.toLowerCase()); } catch { return false; }
}
async function fetchText(url, timeoutMs = PAGE_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { redirect: "follow", signal: controller.signal, headers: { "user-agent": "Mozilla/5.0 AromiaCatalogResearch/2.0", "accept-language": "en-US,en;q=0.8" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { text: await res.text(), finalUrl: res.url || url };
  } finally { clearTimeout(timer); }
}
function unwrapDuckDuckGo(href) {
  try {
    const url = new URL(href, "https://duckduckgo.com");
    const uddg = url.searchParams.get("uddg");
    return uddg ? decodeURIComponent(uddg) : url.toString();
  } catch { return ""; }
}
export function parseSearchLinks(html) {
  const out = [];
  const re = /<a[^>]+href=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(String(html ?? ""))) !== null) {
    const url = unwrapDuckDuckGo(m[1]);
    if (url && trusted(url) && !out.includes(url)) out.push(url);
  }
  return out;
}
function scoreIdentity(candidate, text, url) {
  const corpus = fold(`${url} ${text.slice(0, 5000)}`);
  const nameTokens = tokens(candidate.name);
  const brandTokens = tokens(candidate.brand);
  const hits = nameTokens.filter((t) => corpus.includes(t)).length;
  const brandHits = brandTokens.filter((t) => corpus.includes(t)).length;
  const coverage = nameTokens.length ? hits / nameTokens.length : 0;
  return { confirmed: coverage >= 0.6 && (brandTokens.length === 0 || brandHits >= 1), coverage };
}
function stripHtml(html) { return String(html ?? "").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g," ").trim(); }
function extractGender(text) {
  const t = String(text ?? "");
  if (/for women and men|for men and women|para Hombres y Mujeres|para Mujeres y Hombres/i.test(t)) return "unisex";
  if (/for men\b|para Hombres\b/i.test(t)) return "masculino";
  if (/for women\b|para Mujeres\b/i.test(t)) return "femenino";
  return "";
}
function extractConcentration(text) {
  const t = String(text ?? "");
  if (/\bExtrait(?: de Parfum)?\b/i.test(t)) return "Extrait";
  if (/\bElixir\b/i.test(t)) return "Elixir";
  if (/\bEau de Parfum\b|\bEDP\b/i.test(t)) return "EDP";
  if (/\bEau de Toilette\b|\bEDT\b/i.test(t)) return "EDT";
  if (/\bEau de Cologne\b|\bEDC\b/i.test(t)) return "EDC";
  if (/\bParfum\b/i.test(t)) return "Parfum";
  return "";
}
function extractNotes(text) {
  const t = String(text ?? "");
  const top = t.match(/Top notes? (?:are|is) ([^.]{3,260})\./i)?.[1] ?? t.match(/Las Notas de Salida son ([^.]{3,260})\./i)?.[1] ?? "";
  const mid = t.match(/middle notes? (?:are|is) ([^.]{3,260})\./i)?.[1] ?? t.match(/Las Notas de Corazón son ([^.]{3,260})\./i)?.[1] ?? "";
  const base = t.match(/base notes? (?:are|is) ([^.]{3,260})\./i)?.[1] ?? t.match(/Las Notas de Fondo son ([^.]{3,260})\./i)?.[1] ?? "";
  const split = (v) => String(v).split(/,| and | y /i).map((x) => x.trim()).filter(Boolean).join(";");
  return { top_notes: split(top), middle_notes: split(mid), base_notes: split(base), notes_structure: top || mid || base ? ((top&&mid&&base)?"PYRAMID":"PARTIAL") : "UNKNOWN" };
}
export async function discoverSecondaryEvidence(candidate) {
  const query = encodeURIComponent(`site:fragrantica.com/perfume ${candidate.brand} ${candidate.name} ${candidate.concentration || ""}`);
  let searchHtml = "";
  try { searchHtml = (await fetchText(`https://html.duckduckgo.com/html/?q=${query}`, SEARCH_TIMEOUT_MS)).text; } catch {}
  const links = parseSearchLinks(searchHtml).slice(0, 6);
  const errors = [];
  for (const url of links) {
    try {
      const page = await fetchText(url);
      if (!trusted(page.finalUrl)) continue;
      const text = stripHtml(page.text);
      const identity = scoreIdentity(candidate, text, page.finalUrl);
      if (!identity.confirmed) { errors.push(`identity_mismatch:${identity.coverage.toFixed(2)}:${page.finalUrl}`); continue; }
      const gender = extractGender(text);
      const concentration = extractConcentration(text);
      const notes = extractNotes(text);
      return {
        status: "FOUND",
        source_url: page.finalUrl,
        gender,
        concentration,
        ...notes,
        identity_confirmed: "true",
        secondary_source: "true",
        evidence_method: "trusted_secondary_html",
        error: "",
      };
    } catch (error) { errors.push(`${url}:${error.message}`); }
  }
  return { status: "NOT_FOUND", source_url: "", gender: "", concentration: "", top_notes: "", middle_notes: "", base_notes: "", notes_structure: "UNKNOWN", identity_confirmed: "false", secondary_source: "false", evidence_method: "", error: errors.join(" | ").slice(0,1200) };
}
