import test from 'node:test';
import assert from 'node:assert/strict';
import nextConfig from '../../apps/web/next.config.mjs';

test('Next 16 image optimizer allows only the explicit editorial qualities', () => {
  assert.deepEqual(nextConfig.images.qualities, [75, 85, 95]);
  assert.equal(new Set(nextConfig.images.qualities).size, 3);
});
