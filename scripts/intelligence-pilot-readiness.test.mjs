import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { assessEditorialPilot, renderPilotReport } from './intelligence-pilot-readiness.mjs';

const evidencePath = fileURLToPath(new URL('../docs/intelligence/evidence/backlog-pilot.json', import.meta.url));
const baseline = JSON.parse(readFileSync(evidencePath, 'utf8'));
const fixture = () => structuredClone(baseline);

test('historical pilot preserves real source gaps and never certifies factual/rights review', () => {
  const report = assessEditorialPilot(fixture());
  assert.equal(report.pilot, 'drafts/cuando-ya-no-hueles-tu-perfume.md');
  assert.equal(report.sourceCount, 5);
  assert.equal(report.captured, 3);
  assert.equal(report.excerptMatched, 1);
  assert.equal(report.retrievalFailed, 2);
  assert.equal(report.publication, 'blocked');
  assert.equal(report.independentFactCheck, false);
  assert.equal(report.rightsApproval, false);
  assert.equal(report.editorialApproval, false);
  assert.equal(report.milestoneCertified, false);
  assert.ok(report.blockers.some(x => x.startsWith('source_not_captured:')));
  assert.ok(report.blockers.some(x => x.startsWith('source_excerpt_unmatched:')));
  assert.ok(report.blockers.includes('pending:human_editorial_review'));
  assert.ok(report.sources.every(s => !s.factualVerified && !s.rightsVerified));
  assert.match(renderPilotReport(report), /Publication:\*\* blocked/);
});

test('self-reported absence of blockers never grants editorial or publication approval', () => {
  const evidence = fixture();
  evidence.blockers = [];
  evidence.sources = evidence.import.sources.map((url, i) => ({
    id: String(i + 1), url, sha256: 'a'.repeat(64), excerpt_found: true,
  }));
  evidence.research = evidence.import.sources.map(url => ({url, status: 'already_captured'}));
  const report = assessEditorialPilot(evidence);
  assert.equal(report.captured, 5);
  assert.equal(report.excerptMatched, 5);
  assert.equal(report.blockers.includes('pending:fact_check'), true);
  assert.equal(report.blockers.includes('pending:asset_rights'), true);
  assert.equal(report.blockers.includes('pending:human_editorial_review'), true);
  assert.equal(report.milestoneCertified, false);
  assert.equal(report.publication, 'blocked');
});

test('fails closed for malformed input and claimed approval without authority', () => {
  assert.throws(() => assessEditorialPilot(null), /invalid_pilot_evidence/);
  assert.throws(() => assessEditorialPilot({...fixture(), sources: null}), /invalid_pilot_evidence/);
  assert.throws(() => assessEditorialPilot({...fixture(), import: {...fixture().import, publication: 'live'}}),
    /pilot_evidence_requires_explicit_publication_block/);
  assert.throws(() => assessEditorialPilot({...fixture(), import: {...fixture().import, editorialApproval: 'approved'}}),
    /pilot_evidence_requires_explicit_publication_block/);
  assert.throws(() => assessEditorialPilot({...fixture(), import: {...fixture().import, sources: ['file:///etc/passwd']}}),
    /invalid_pilot_sources/);
});
