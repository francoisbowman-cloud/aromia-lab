import test from 'node:test';
import assert from 'node:assert/strict';
import { extractExplicitMetadata } from '../structured-extractor.mjs';

test('product audience is not contaminated by navigation or recommendations', () => {
  const html = '<meta property="og:description" content="A fragrance for men"><nav>Perfume for women. Unisex fragrance.</nav>';
  assert.equal(extractExplicitMetadata(html).gender, 'masculino');
  assert.equal(extractExplicitMetadata('<nav>Perfume for men. Perfume for women.</nav>').gender, '');
});
test('ambiguous categories do not imply unisex, explicit audiences still work', () => {
  assert.equal(extractExplicitMetadata('<meta property="og:description" content="Perfume for men. Perfume for women.">').gender, '');
  assert.equal(extractExplicitMetadata('<meta property="og:description" content="A fragrance for women and men">').gender, 'unisex');
  assert.equal(extractExplicitMetadata('', '', { audience: 'unisex' }).gender, 'unisex');
  assert.equal(extractExplicitMetadata('', '', { description: 'A perfume for women' }).gender, 'femenino');
});
