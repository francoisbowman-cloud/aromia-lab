import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(resolve(root, 'apps/api/package.json'));
const { Client } = require('pg');
const connectionString = process.env.LOCAL_DATABASE_URL ?? 'postgresql://aromia:aromia@localhost:5432/aromia_dev';
const url = new URL(connectionString);
const database = url.pathname.slice(1);
if (!['postgres:', 'postgresql:'].includes(url.protocol) || !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    || !/^[a-z][a-z0-9_]*_dev$/.test(database) || process.env.NODE_ENV === 'production') {
  throw new Error('Local bootstrap requires a loopback PostgreSQL database ending in _dev, outside NODE_ENV=production');
}

// Local schema only. 012–020 repair/assert the real production catalog, not a fresh development dataset.
const migrations = [
  '001_create_perfumes.sql', '002_add_nicho_o_comercial.sql', '003_create_retailers.sql',
  '004_add_perfume_estado.sql', '005_create_activity_log.sql', '006_create_articles.sql',
  '007_create_subscribers.sql', '008_add_retailer_sync_columns.sql', '009_add_club_fuente.sql',
  '010_add_articles_autor.sql', '011_catalog_expansion_nullable_fields.sql',
  '021_add_articles_nivel_editorial.sql', '021_discovery_search_indexes.sql', '022_add_articles_contenido_markdown.sql',
];
const adminUrl = new URL(url); adminUrl.pathname = '/postgres';
const admin = new Client({ connectionString: adminUrl.toString() });
await admin.connect();
try {
  const existing = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [database]);
  if (!existing.rowCount) await admin.query(`CREATE DATABASE "${database}"`);
} finally { await admin.end(); }

const client = new Client({ connectionString });
await client.connect();
try {
  await client.query('SELECT pg_advisory_lock(1852026)');
  const { rows: [state] } = await client.query("SELECT to_regclass('public.local_setup_history') AS history, to_regclass('public.perfumes') AS perfumes");
  if (!state.history && state.perfumes) throw new Error('Existing untracked dataset: refusing to adopt or reseed it. Choose a new *_dev database.');
  await client.query('CREATE TABLE IF NOT EXISTS local_setup_history (name text PRIMARY KEY, sha256 text NOT NULL)');
  for (const file of migrations) {
    const sql = readFileSync(resolve(root, 'apps/api/migrations', file), 'utf8');
    const hash = createHash('sha256').update(sql).digest('hex');
    const { rows } = await client.query('SELECT sha256 FROM local_setup_history WHERE name = $1', [file]);
    if (rows.length) {
      if (rows[0].sha256 !== hash) throw new Error(`Applied local migration changed: ${file}`);
      continue;
    }
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO local_setup_history VALUES ($1, $2)', [file, hash]);
      await client.query('COMMIT');
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    console.log(`Local schema: ${file}`);
  }
  const seeded = await client.query("SELECT 1 FROM local_setup_history WHERE name = 'seed-v1'");
  if (!seeded.rowCount) {
    for (const script of ['seed', 'seed:articles']) {
      const result = spawnSync('npm', ['run', script], { cwd: resolve(root, 'apps/api'), env: { ...process.env, DATABASE_URL: connectionString }, stdio: 'inherit' });
      if (result.status !== 0) throw new Error(`Local ${script} failed`);
    }
    await client.query("INSERT INTO local_setup_history VALUES ('seed-v1', 'repository-development-fixtures')");
  }
  const { rows: [counts] } = await client.query('SELECT (SELECT count(*) FROM perfumes)::int AS perfumes, (SELECT count(*) FROM articles)::int AS articles');
  console.log({ database, ...counts, mode: 'local fixtures; not production catalog parity' });
} finally { await client.end(); }
