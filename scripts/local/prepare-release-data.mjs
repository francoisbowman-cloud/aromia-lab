import { createRequire } from 'node:module';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const root=fileURLToPath(new URL('../../',import.meta.url));
const require=createRequire(resolve(root,'apps/api/package.json'));
const {Client}=require('pg');
const url=new URL(process.env.LOCAL_DATABASE_URL??'postgresql://aromia:aromia@localhost:5432/aromia_release_dev');
const database=url.pathname.slice(1);
if(!['postgres:','postgresql:'].includes(url.protocol)||!['localhost','127.0.0.1','[::1]'].includes(url.hostname)||!/^[a-z][a-z0-9_]*_dev$/.test(database)||process.env.NODE_ENV==='production')throw Error('Release fixtures require a loopback *_dev database outside production');
const sources={perfumes:'https://api-production-fe2f.up.railway.app/api/perfumes',articles:'https://api-production-fe2f.up.railway.app/api/articulos'};
const data={};const hashes={};
for(const [table,source] of Object.entries(sources)){
 const raw=execFileSync('curl',['-fsSL','--max-time','30',source],{maxBuffer:10*1024*1024});data[table]=JSON.parse(raw);hashes[table]=createHash('sha256').update(raw).digest('hex');
 if(!Array.isArray(data[table])||!data[table].length||new Set(data[table].map(x=>x.slug)).size!==data[table].length||new Set(data[table].map(x=>x.id)).size!==data[table].length)throw Error('Invalid public dataset '+table);
}
// The listing is only metadata; fetch each public story body before snapshotting.
const articleList = data.articles;
data.articles = articleList.map((item) => {
 if(typeof item.slug !== 'string' || !/^[a-z0-9-]+$/.test(item.slug)) throw Error('Invalid article slug');
 const raw=execFileSync('curl',['-fsSL','--max-time','30',sources.articles+'/'+encodeURIComponent(item.slug)],{maxBuffer:10*1024*1024});
 const detail=JSON.parse(raw);
 if(detail.id!==item.id || detail.slug!==item.slug || (!detail.contenido_html && !detail.contenido_markdown)) throw Error('Incomplete public article detail');
 return detail;
});
hashes.articles=createHash('sha256').update(JSON.stringify(data.articles)).digest('hex');
if(data.perfumes.length<125)throw Error('Public catalog is below the documented floor');
const receipt={version:2,sources,sha256:hashes,counts:{perfumes:data.perfumes.length,articles:data.articles.length},scope:'Public read-only sources imported into an isolated local database; not editorial fact/right approval'};
const adminUrl=new URL(url);adminUrl.pathname='/postgres';const admin=new Client({connectionString:adminUrl.toString()});await admin.connect();try{
 const found=await admin.query('SELECT 1 FROM pg_database WHERE datname=$1',[database]);if(!found.rowCount)await admin.query(`CREATE DATABASE "${database}"`);
}finally{await admin.end();}
const client=new Client({connectionString:url.toString()});await client.connect();try{
 await client.query('SELECT pg_advisory_lock(1852027)');
 const {rows:[state]}=await client.query("SELECT to_regclass('public.release_fixture_receipt') AS receipt, to_regclass('public.perfumes') AS perfumes");
 if(state.receipt){
  const {rows:[stored]}=await client.query('SELECT receipt FROM release_fixture_receipt LIMIT 1');
  if(Object.entries(hashes).some(([table, hash]) => stored.receipt.sha256[table] !== hash))throw Error('Source snapshot changed; use a new database rather than overwrite fixtures');
  console.log({database,counts:stored.receipt.counts,reused:true});
 }else{
  if(state.perfumes)throw Error('Existing database without a release-fixture receipt: refusing to overwrite');
  const folder=resolve(root,'apps/api/migrations');const files=readdirSync(folder).filter(x=>x.endsWith('.sql')).sort();
  await client.query('BEGIN');try{
   for(const file of files.filter(f=>f<'016'))await client.query(readFileSync(resolve(folder,file),'utf8'));
   for(const table of ['perfumes','articles']){
    const schema=await client.query('SELECT column_name FROM information_schema.columns WHERE table_schema=\'public\' AND table_name=$1',[table]);const allowed=new Set(schema.rows.map(x=>x.column_name));
    for(const row of data[table]){
     const columns=Object.keys(row).filter(key=>allowed.has(key));
     await client.query(`INSERT INTO ${table} (${columns.map(k=>'"'+k+'"').join(',')}) VALUES (${columns.map((_,i)=>'$'+(i+1)).join(',')})`,columns.map(k=>row[k]));
    }
    await client.query(`SELECT setval(pg_get_serial_sequence($1,'id'),(SELECT COALESCE(max(id),1) FROM ${table}),true)`,[table]);
   }
   for(const file of files.filter(f=>f>='016'))await client.query(readFileSync(resolve(folder,file),'utf8'));
   await client.query('CREATE TABLE release_fixture_receipt (receipt jsonb NOT NULL)');await client.query('INSERT INTO release_fixture_receipt VALUES($1)',[receipt]);await client.query('COMMIT');
  }catch(error){await client.query('ROLLBACK');throw error;}
  console.log({database,...receipt.counts,productionCatalogAssertions:'passed'});
 }
 const artifact=resolve(root,'../aromia-evidence/release-data-receipt.json');mkdirSync(resolve(artifact,'..'),{recursive:true});writeFileSync(artifact,JSON.stringify(receipt,null,2)+'\n');
}finally{await client.end();}
