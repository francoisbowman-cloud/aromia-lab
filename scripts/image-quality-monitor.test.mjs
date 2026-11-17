import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { auditImages, inspectFeedback, readFeedbackAsset } from './image-quality-monitor.mjs';
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
test('flags absent/shared images without treating a legacy slug as a variant error', () => {
 const rows=[{slug:'sauvage-edp',nombre:'Sauvage EDT',imagen_url:'x'}, {slug:'other',imagen_url:'x'}, {slug:'missing'}];
 const result=auditImages(rows);
 assert.equal(result.length,2);
 assert.ok(result.some(x=>x.reason==='shared_image_requires_review'));
 assert.deepEqual(result,auditImages([...rows].reverse()));
});
test('ambiguous concentration requires review; explicit EDP does not', () => {
 assert.equal(auditImages([{slug:'chance-eau-tendre',imagen_url:'x'}]).length,1);
 assert.equal(auditImages([{slug:'chance-eau-tendre',imagen_url:'x',concentracion:'EDP'}]).length,0);
});
test('changing an asset cannot silently clear publisher feedback', () => {
 const bytes=Buffer.from('old'); const observation={status:'replacement_requested',sha256:createHash('sha256').update(bytes).digest('hex'),approval:'pending',asset:'a'};
 assert.equal(inspectFeedback([observation],()=>bytes)[0].assetState,'unchanged');
 const changed=inspectFeedback([observation],()=>Buffer.from('new'))[0];
 assert.equal(changed.assetState,'changed_requires_review');
 assert.equal(changed.approval,'pending');
 assert.equal(inspectFeedback([observation],()=>null)[0].assetState,'missing');
});

test('feedback reader confines paths, file types and symlinks to public image assets', () => {
  const root = mkdtempSync(join(tmpdir(), 'aromia-feedback-'));
  try {
    const publicRoot = join(root, 'apps', 'web', 'public');
    mkdirSync(join(publicRoot, 'editorial-v1'), { recursive: true });
    const expected = Buffer.from('authorized image bytes');
    writeFileSync(join(publicRoot, 'editorial-v1', 'bergamot.webp'), expected);
    writeFileSync(join(root, 'private.png'), Buffer.from('should never be read'));
    writeFileSync(join(publicRoot, 'notes.txt'), Buffer.from('text'));
    symlinkSync(join(root, 'private.png'), join(publicRoot, 'editorial-v1', 'escape.png'));

    assert.deepEqual(readFeedbackAsset(root, 'apps/web/public/editorial-v1/bergamot.webp'), expected);
    assert.equal(readFeedbackAsset(root, '../private.png'), null);
    assert.equal(readFeedbackAsset(root, 'apps/web/public/../../../private.png'), null);
    assert.equal(readFeedbackAsset(root, 'apps/web/public/editorial-v1/escape.png'), null);
    assert.equal(readFeedbackAsset(root, 'apps/web/public/notes.txt'), null);
    assert.equal(readFeedbackAsset(root, '/etc/passwd'), null);
    assert.equal(readFeedbackAsset(root, 'apps/web/public/editorial-v1/missing.webp'), null);
    assert.equal(readFeedbackAsset(root, null), null);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
