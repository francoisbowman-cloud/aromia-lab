import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyHost, inventoryImageProvenance, provenanceCsv } from './catalog-image-provenance.mjs';

test('host categories are conservative signals and look-alike hosts are not trusted', () => {
  assert.equal(classifyHost('m.media-amazon.com'), 'amazon');
  assert.equal(classifyHost('fimgs.net'), 'fragrantica_cdn');
  assert.equal(classifyHost('u-mercari-images.mercdn.net'), 'ugc_marketplace');
  assert.equal(classifyHost('abclive1.s3.amazonaws.com'), 'generic_cdn_or_storage');
  assert.equal(classifyHost('media-amazon.com.evil.example'), 'other_third_party');
  assert.equal(classifyHost('notfimgs.net'), 'other_third_party');
  assert.equal(classifyHost(''), 'other_third_party');
});

test('inventory counts hotlinks, local assets, missing and invalid URLs without verifying anything', () => {
  const r = inventoryImageProvenance([
    { slug: 'a', imagen_url: 'https://m.media-amazon.com/images/I/1.jpg' },
    { slug: 'b', imagen_url: 'https://fimgs.net/mdimg/perfume/x.jpg' },
    { slug: 'c', imagen_url: 'http://example.org/y.png' },
    { slug: 'd', imagen_url: '/perfumes/d.webp' },
    { slug: 'e', imagen_url: '' },
    { slug: 'f', imagen_url: 'javascript:alert(1)' },
  ]);
  assert.equal(r.total, 6);
  assert.deepEqual(r.byCategory, { amazon: 1, fragrantica_cdn: 1, other_third_party: 1, local_public_asset: 1, missing: 1, invalid_url: 1 });
  assert.equal(r.hotlinked, 3);
  assert.equal(r.localAssets, 1);
  assert.equal(r.insecureHttp, 1);
  assert.equal(r.identityVerified, 0);
  assert.equal(r.rightsVerified, 0);
  assert.equal(r.publication, 'blocked');
});

test('malformed catalogs fail loudly and CSV output escapes quotes', () => {
  assert.throws(() => inventoryImageProvenance({}), /catalog_must_be_array/);
  assert.throws(() => inventoryImageProvenance([{ nombre: 'sin slug' }]), /catalog_row_requires_slug/);
  const csv = provenanceCsv(inventoryImageProvenance([{ slug: 's', nombre: 'Eau "Rare"', marca: 'M', imagen_url: 'https://fimgs.net/a.jpg' }]));
  assert.match(csv, /"Eau ""Rare"""/);
  assert.equal(csv.split('\n')[0], 'slug,nombre,marca,category,host,hotlinked,insecure,imagen_url');
});
