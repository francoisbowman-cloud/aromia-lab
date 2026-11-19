// Local recovery of existing editorial work. Never publishes or invents approval.
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const require=createRequire(new URL('../apps/api/package.json',import.meta.url));
const {Pool}=require('pg'),matter=require('gray-matter');
const {JobStore}=require('./dist/intelligence/store.js');
const {runOnce}=require('./dist/intelligence/worker.js');
const file=process.argv[2],base=process.argv[3];
if(!/^drafts\/[a-z0-9-]+\.md$/.test(file??'')||!/^[a-f0-9]{40}$/.test(base??''))throw new Error('Usage: script drafts/slug.md IMMUTABLE_SHA40');
const connectionString=process.env.DATABASE_URL;
const dbUrl=new URL(connectionString??'');
if(!['127.0.0.1','localhost'].includes(dbUrl.hostname)||!/_dev$|_test$/.test(dbUrl.pathname))throw new Error('Only isolated local *_dev or *_test databases permitted');
const raw=execFileSync('git',['show',`${base}:${file}`],{cwd:root,encoding:'utf8',maxBuffer:200000});
const {data}=matter(raw);const title=data.titulo??data.title;
if(typeof title!=='string')throw new Error('Draft title missing');
const {marked}=require('marked');const urls=new Map();
marked.walkTokens(marked.lexer(raw),t=>{if(t.type==='link'&&t.href.startsWith('https://'))urls.set(t.href,t.text||t.href)});
const provenance=`https://raw.githubusercontent.com/francoisbowman-cloud/aromia-lab/${base}/${file}`;
const sources=[{url:provenance,excerpt:title},...[...urls].map(([url,excerpt])=>({url,excerpt}))];
const hash=createHash('sha256').update(raw).digest('hex');
const key='backlog:'+createHash('sha256').update(file).digest('hex');
const db=new Pool({connectionString});
try {
 const store=new JobStore(db);
 const job=await store.enqueue(key,{title,question:'Recuperar este borrador histórico conservando su autoría y someter sus afirmaciones, arte y derechos a revisión actual.',sources});
 if(job.status==='queued')await runOnce(store,job.id);
 if((await store.detail(job.id)).status!=='awaiting_review')throw new Error('Job is not awaiting review; inspect its state before recovery');
 const versions=await store.artifacts(job.id);
 const previous=versions.find(v=>v.kind==='draft');
 if(previous && previous.content!==raw)throw new Error('Existing draft differs: review and append a deliberate new version, never overwrite');
 if(!previous)await store.appendArtifact(job.id,{kind:'draft',content:raw,sourceUrls:sources.map(s=>s.url),expectedVersion:0});
 console.log(JSON.stringify({jobId:job.id,file,base,sha256:hash,draftVersion:previous?.version??1,alreadyImported:Boolean(previous),publication:'blocked',editorialApproval:'not_inferred',sources: sources.map(s=>s.url),remaining:['source verification','factual review','edit','art direction','QA','human review']},null,2));
}finally{await db.end();}
