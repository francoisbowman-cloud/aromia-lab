function fold(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function words(value) {
  return fold(value).split(/[^a-z0-9]+/).filter(Boolean);
}

const PROSE_OR_UI = /\b(?:scroll\s+to\s+the\s+top|product|gift\s+set|bottle|sillage|long\s+lasting|presented|presents|discover|leads?\s+into|reveals?|envelops?|enhanced|volume|click|shop|add\s+to\s+bag|how\s+to\s+use)\b/i;
const EMBEDDED_TIER_LABEL = /\b(?:top|head|opening|heart|middle|base|dry\s*down)\s+notes?\b|\bnotas?\s+de\s+(?:salida|coraz[oó]n|fondo)\b|\bnotes?\s+de\s+(?:t[eê]te|c[oœ]ur|fond)\b/i;

function titleLike(value, title) {
  const noteWords = [...new Set(words(value).filter((w) => w.length >= 3))];
  const titleWords = new Set(words(title).filter((w) => w.length >= 3));
  if (noteWords.length < 2) return false;
  const hits = noteWords.filter((w) => titleWords.has(w)).length;
  return hits / noteWords.length >= 0.7;
}

export function isPlausibleNoteValue(value, { title = "" } = {}) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!text) return false;
  if (text.length > 180) return false;
  if (/[.!?]/.test(text)) return false;
  if (PROSE_OR_UI.test(text)) return false;
  if (EMBEDDED_TIER_LABEL.test(text)) return false;
  if (titleLike(text, title)) return false;

  const tokenCount = words(text).length;
  if (tokenCount > 20) return false;

  // Lists may be long when they have explicit separators. Without separators,
  // stay conservative: a note name or a short phrase is acceptable; prose is not.
  const hasListSeparator = /[,;|/·•]/.test(text);
  if (!hasListSeparator && tokenCount > 4) return false;
  return true;
}

export function sanitizeExtractedNotes(evidence) {
  const title = evidence?.title ?? "";
  const clean = (field) => isPlausibleNoteValue(evidence?.[field], { title }) ? String(evidence[field]).trim() : "";
  const top_notes = clean("top_notes");
  const middle_notes = clean("middle_notes");
  const base_notes = clean("base_notes");
  const accords = clean("accords");

  const tiers = [top_notes, middle_notes, base_notes].filter(Boolean).length;
  const notes_structure = tiers === 3 ? "PYRAMID" : tiers > 0 ? "PARTIAL" : accords ? "FLAT" : "UNKNOWN";
  return { ...evidence, top_notes, middle_notes, base_notes, accords, notes_structure };
}
