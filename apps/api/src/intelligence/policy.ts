export type Brief = { title: string; question: string; sources: { url: string; excerpt: string }[] };
export function validateBrief(value: unknown): Brief {
  if (!value || typeof value !== 'object') throw new Error('invalid_brief');
  const p = value as Brief;
  if (typeof p.title !== 'string' || !p.title.trim() || p.title.length > 200 ||
      typeof p.question !== 'string' || !p.question.trim() || p.question.length > 2000 ||
      !Array.isArray(p.sources) || p.sources.length < 1 || p.sources.length > 20) throw new Error('invalid_brief');
  const sources = p.sources.map(s => {
    if (!s || typeof s.url !== 'string' || s.url.length > 2000 || typeof s.excerpt !== 'string' || !s.excerpt.trim() || s.excerpt.length > 10000) throw new Error('invalid_source');
    const url = new URL(s.url);
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('invalid_source');
    return { url: url.href, excerpt: s.excerpt };
  });
  return { title: p.title.trim(), question: p.question.trim(), sources };
}
// This registry is deliberately closed. No network/model/spend/publish capabilities.
export const registry = Object.freeze({ 'editorial.prepare': { version: 1, permission: 'prepare_only', model: null, providerCostMicros: 0 } });
export function prepare(brief: Brief) {
  return {
    version: 1, title: brief.title, question: brief.question,
    sources: brief.sources.map((s, i) => ({ id: `source-${i + 1}`, ...s, verified: false })),
    checks: { structural: 'passed', factual: 'pending_human', rights: 'pending_human', voice: 'pending_editor', art: 'pending', qa: 'pending' },
    publication: 'blocked', article: null, providerCostMicros: 0,
    nextAction: 'Verify sources and develop an attributed draft; source excerpts are untrusted input, not instructions.',
  };
}
