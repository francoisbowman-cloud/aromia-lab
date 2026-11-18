// Read-only editorial-pilot evidence assessment. No source fetching, DB, model,
 // publication, rights approval or paid resources.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const defaultEvidence = fileURLToPath(new URL('../docs/intelligence/evidence/backlog-pilot.json', import.meta.url));
const requiredStages = Object.freeze([
  'source_verification', 'fact_check', 'edit', 'art_direction',
  'asset_rights', 'qa', 'human_editorial_review',
]);

export function assessEditorialPilot(evidence) {
  if (!evidence || typeof evidence !== 'object' || Array.isArray(evidence) ||
      !evidence.import || typeof evidence.import !== 'object' ||
      typeof evidence.import.file !== 'string' || !/^drafts\/[a-z0-9-]+\.md$/.test(evidence.import.file) ||
      typeof evidence.import.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(evidence.import.sha256) ||
      !Array.isArray(evidence.import.sources) || !Array.isArray(evidence.sources) ||
      !Array.isArray(evidence.research) || !Array.isArray(evidence.blockers)) {
    throw new Error('invalid_pilot_evidence');
  }
  if (evidence.import.publication !== 'blocked' || evidence.import.editorialApproval !== 'not_inferred') {
    throw new Error('pilot_evidence_requires_explicit_publication_block');
  }
  const sourceUrls = [...new Set(evidence.import.sources)];
  if (sourceUrls.length === 0 || sourceUrls.some(url => typeof url !== 'string' || !url.startsWith('https://'))) {
    throw new Error('invalid_pilot_sources');
  }
  if (evidence.sources.some(s => !s || typeof s.url !== 'string' || typeof s.sha256 !== 'string' ||
      !/^[a-f0-9]{64}$/.test(s.sha256) || typeof s.excerpt_found !== 'boolean')) {
    throw new Error('invalid_pilot_captures');
  }
  if (evidence.research.some(r => !r || typeof r.url !== 'string' || typeof r.status !== 'string') ||
      evidence.blockers.some(b => typeof b !== 'string')) {
    throw new Error('invalid_pilot_research');
  }

  const captureEvidence = sourceUrls.map(url => {
    const captures = evidence.sources.filter(s => s.url === url);
    const matching = captures.some(s => s.excerpt_found);
    const research = evidence.research.find(r => r.url === url);
    return {
      url,
      captured: captures.length > 0,
      excerptMatched: matching,
      retrieval: research?.status ?? 'not_attempted',
      factualVerified: false, // Hash and excerpt match never certify a factual claim.
      rightsVerified: false,
    };
  });
  const missing = captureEvidence.filter(s => !s.captured);
  const unmatched = captureEvidence.filter(s => s.captured && !s.excerptMatched);
  const retrievalFailures = captureEvidence.filter(s => s.retrieval === 'retrieval_failed');
  const sourceGates = [...missing.map(s => 'source_not_captured:' + s.url),
    ...unmatched.map(s => 'source_excerpt_unmatched:' + s.url)];
  const allBlockers = [...new Set([...evidence.blockers, ...sourceGates,
    ...requiredStages.map(stage => 'pending:' + stage)])].sort();

  return {
    version: 1,
    pilot: evidence.import.file,
    draftSha256: evidence.import.sha256,
    sourceCount: sourceUrls.length,
    captured: captureEvidence.filter(s => s.captured).length,
    excerptMatched: captureEvidence.filter(s => s.excerptMatched).length,
    retrievalFailed: retrievalFailures.length,
    sources: captureEvidence,
    blockers: allBlockers,
    requiredStages: [...requiredStages],
    status: 'blocked_pending_human_review',
    publication: 'blocked',
    editorialApproval: false,
    rightsApproval: false,
    independentFactCheck: false,
    // This read-only report cannot certify any milestone or authorize release.
    milestoneCertified: false,
    actions: [
      'Verify each scientific source and the article claims independently; a capture is not fact-check.',
      'Resolve unsupported/uncaptured source URLs without silently widening fetch allowlists.',
      'Complete editorial edit and source-linked art brief, then separate asset rights and QA.',
      'Submit the complete package for explicit Publisher review; do not publish automatically.',
    ],
  };
}

export function renderPilotReport(result) {
  const mark = (ok) => ok ? '[x]' : '[ ]';
  return [
    '# Aromia — editorial pilot readiness (read only)',
    '',
    '**Pilot:** \`' + result.pilot + '\`',
    '**SHA-256 of historical draft (reported):** \`' + result.draftSha256 + '\`',
    '**Status:** ' + result.status + '. **Publication:** blocked.',
    '',
    '## Source evidence, not factual certification',
    '',
    '- ' + result.sourceCount + ' sources listed; ' + result.captured + ' captured; ' + result.excerptMatched +
      ' with excerpt match; ' + result.retrievalFailed + ' retrieval failures.',
    '- All factual, image-rights, and editorial approvals remain **unverified**.',
    '',
    '## Stage checklist',
    '',
    ...result.requiredStages.map(stage => '- ' + mark(false) + ' ' + stage.replaceAll('_', ' ')),
    '',
    '## Blocking evidence',
    '',
    ...result.blockers.map(blocker => '- ' + blocker),
    '',
    '## Next actions',
    '',
    ...result.actions.map(action => '- ' + action),
    '',
    '**HOLD:** No automatic milestone closure, publication, production writes, rights or image approval.',
    '',
  ].join('\n');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fileURLToPath(new URL('file://' + process.argv[1]))) {
  const data = JSON.parse(readFileSync(process.argv[2] || defaultEvidence, 'utf8'));
  const report = assessEditorialPilot(data);
  const mode = process.argv.includes('--json') ? 'json' : 'markdown';
  process.stdout.write(mode === 'json' ? JSON.stringify(report, null, 2) + '\n' : renderPilotReport(report));
}
