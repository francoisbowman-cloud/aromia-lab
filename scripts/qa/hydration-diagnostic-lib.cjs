// Keep parsing and redaction separately testable without Playwright.
function isHydrationMessage(message) {
  return /hydration|hydrated|did not match|server rendered HTML|react(?: minified)? error #(?:418|423|425|422)/i.test(String(message));
}
function redactDiagnostic(message) {
  return String(message)
    .replace(/https?:\/\/[^\s"'<>]+/gi, match => {
      try { const u = new URL(match); return u.origin + u.pathname; } catch { return '[url]'; }
    })
    .replace(/(?:password|secret|authorization|token|api[_-]?key)\s*[:=]\s*[^\s,;]+/gi, '[redacted]')
    .slice(0, 1600);
}
module.exports = { isHydrationMessage, redactDiagnostic };
