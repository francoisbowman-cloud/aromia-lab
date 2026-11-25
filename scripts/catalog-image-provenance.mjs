// Read-only provenance inventory of catalog image URLs. No network, no downloads, no
// approvals. Host categories are RISK SIGNALS for a human rights review, not legal
// conclusions and never an identity, licence or publication decision.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const RULES = [
  ['amazon', /(^|\.)(media-amazon|ssl-images-amazon)\.com$/],
  ['fragrantica_cdn', /(^|\.)fimgs\.net$/],
  ['ugc_marketplace', /(^|\.)(mercdn\.net|ebayimg\.com|etsystatic\.com|alicdn\.com|olxcdn\.com|depop\.com)$/],
  ['generic_cdn_or_storage', /(^|\.)(amazonaws\.com|cloudfront\.net|cdn\.shopify\.com|scayle\.cloud|atgcdn\.ae|cloudinary\.com|imgix\.net)$/],
];

export function classifyHost(hostname) {
  const host = String(hostname || '').toLowerCase();
  for (const [category, re] of RULES) if (re.test(host)) return category;
  return 'other_third_party';
}

export function inventoryImageProvenance(products) {
  if (!Array.isArray(products)) throw new Error('catalog_must_be_array');
  const rows = products.map(p => {
    if (!p || typeof p.slug !== 'string' || !p.slug) throw new Error('catalog_row_requires_slug');
    const raw = String(p.imagen_url ?? '').trim();
    let host = '', local = false, valid = false;
    if (raw) {
      try {
        const u = new URL(raw, 'https://local.invalid');
        local = u.hostname === 'local.invalid';
        host = local ? '' : u.hostname.toLowerCase();
        valid = local || u.protocol === 'https:' || u.protocol === 'http:';
      } catch { valid = false; }
    }
    const insecure = valid && !local && /^http:/i.test(raw);
    const category = !raw ? 'missing' : !valid ? 'invalid_url' : local ? 'local_public_asset' : classifyHost(host);
    return { slug: p.slug, nombre: p.nombre ?? '', marca: p.marca ?? '', category, host, hotlinked: valid && !local, insecure, imagen_url: raw };
  });
  const count = key => rows.reduce((m, r) => (m[r[key]] = (m[r[key]] ?? 0) + 1, m), {});
  const byCategory = count('category');
  const byHost = Object.fromEntries(Object.entries(count('host')).filter(([h]) => h).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
  return {
    schemaVersion: 1,
    total: rows.length,
    hotlinked: rows.filter(r => r.hotlinked).length,
    localAssets: rows.filter(r => r.category === 'local_public_asset').length,
    insecureHttp: rows.filter(r => r.insecure).length,
    byCategory, byHost, rows,
    // Nothing here verifies identity, licence, permission to hotlink or quality.
    identityVerified: 0, rightsVerified: 0, publication: 'blocked',
    limitations: [
      'Host category is a risk signal for human review, not a legal or licensing determination.',
      'A URL does not prove which product, variant or concentration the image shows.',
      'No bytes were fetched; availability and content of each remote image are unverified.',
    ],
  };
}

const csvCell = v => `"${String(v).replaceAll('"', '""')}"`;
export function provenanceCsv(report) {
  const head = ['slug', 'nombre', 'marca', 'category', 'host', 'hotlinked', 'insecure', 'imagen_url'];
  return [head.join(','), ...report.rows.map(r => head.map(k => csvCell(r[k])).join(','))].join('\n') + '\n';
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [input, mode] = process.argv.slice(2);
  if (!input || (mode && mode !== '--csv')) throw new Error('Usage: node scripts/catalog-image-provenance.mjs catalog.json [--csv]');
  const report = inventoryImageProvenance(JSON.parse(readFileSync(input, 'utf8')));
  process.stdout.write(mode === '--csv' ? provenanceCsv(report) : JSON.stringify({ ...report, rows: undefined }, null, 2) + '\n');
}
