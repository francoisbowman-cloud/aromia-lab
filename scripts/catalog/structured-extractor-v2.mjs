import { extractPageEvidence } from "./structured-extractor.mjs";
import { sanitizeExtractedNotes } from "./note-evidence-guard.mjs";

export function sanitizeEvidenceUrl(url) {
  return String(url ?? "").replace(/%(?![0-9a-fA-F]{2})/g, "%25");
}

export function extractPageEvidenceV2(html, url) {
  const evidence = extractPageEvidence(html, sanitizeEvidenceUrl(url));
  return sanitizeExtractedNotes(evidence);
}
