import test from 'node:test';
import assert from 'node:assert/strict';
import { summarize, compare } from './metrics.mjs';
const row = (method, minutes=30, featuresCompleted=1) => ({method, minutes, featuresCompleted, testsPassed:5, testsRun:5, postUploadFixes:0});
test('does not invent acceleration without both measured methods',()=>{
  assert.equal(compare([row('container')]).speedup,null);
});
test('compares only observed minutes per completed feature',()=>{
  assert.equal(compare([row('legacy',60),row('container',30)]).speedup,2);
});
test('zero features are not treated as infinite productivity',()=>{
  assert.equal(summarize([row('container',30,0)])[0].minutesPerFeature,null);
});
test('rejects impossible test totals and negative durations',()=>{
  assert.throws(()=>summarize([{...row('container'),testsPassed:6}]),/invalid_totals/);
  assert.throws(()=>summarize([row('legacy',-2)]),/invalid_minutes/);
});
