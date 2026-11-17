import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchesImageSignature } from './imageUpload';
test('checks the declared supported type against file signatures',()=>{
 assert.equal(matchesImageSignature(Buffer.from([137,80,78,71,13,10,26,10]),'image/png'),true);
 assert.equal(matchesImageSignature(Buffer.from([255,216,255,224]),'image/jpeg'),true);
 assert.equal(matchesImageSignature(Buffer.from('RIFFxxxxWEBP'),'image/webp'),true);
 assert.equal(matchesImageSignature(Buffer.from('<svg onload=alert(1)>'),'image/png'),false);
 assert.equal(matchesImageSignature(Buffer.from([137,80,78]),'image/png'),false);
 assert.equal(matchesImageSignature(Buffer.from('RIFFxxxxWAVE'),'image/webp'),false);
 assert.equal(matchesImageSignature(Buffer.from([255,216,255]),'text/html'),false);
});
