const test = require('node:test');
const assert = require('node:assert/strict');
const {isHydrationMessage, redactDiagnostic} = require('./hydration-diagnostic-lib.cjs');
test('identifies minified React 418 and dev text mismatch messages', () => {
  assert.equal(isHydrationMessage('Minified React error #418; visit react.dev'), true);
  assert.equal(isHydrationMessage('Text content did not match server-rendered HTML'), true);
  assert.equal(isHydrationMessage('Hydration failed because the server rendered HTML did not match'), true);
});
test('ignores unrelated console errors', () => {
  assert.equal(isHydrationMessage('GET /image.png 404 (Not Found)'), false);
});
test('redacts URL query strings and credentials in diagnostic messages', () => {
  const result = redactDiagnostic('token=abc123 password=hunter2 https://example.com/path?token=abc123');
  assert.equal(result.includes('abc123'), false);
  assert.equal(result.includes('hunter2'), false);
  assert.match(result, /https:\/\/example.com\/path/);
});
