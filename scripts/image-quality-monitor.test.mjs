import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { auditImages, inspectFeedback } from './image-quality-monitor.mjs';
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
