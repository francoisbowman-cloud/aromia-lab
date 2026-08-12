import { extractPageEvidence } from "./structured-extractor.mjs";

export function sanitizeEvidenceUrl(url) {
  return String(url ?? "").replace(/%(?![0-9a-fA-F]{2})/g, "%25");
}

export function extractPageEvidenceV2(html, url) {
  return extractPageEvidence(html, sanitizeEvidenceUrl(url));
}
