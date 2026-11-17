import { Router } from 'express';
import { pool } from '../../db/pool';
import { JobStore } from '../../intelligence/store';
import { VisualReviewJournal } from '../../intelligence/visualReviewJournal';
import { VisualReviewDecisions } from '../../intelligence/visualReviewDecisions';
import { asyncHandler } from '../../lib/asyncHandler';
export const intelligenceRouter = Router();
const store = new JobStore(pool);
const visualJournal = new VisualReviewJournal(pool);
const visualDecisions = new VisualReviewDecisions(pool);
intelligenceRouter.use((_req,res,next)=>{
  if (process.env.INTELLIGENCE_ENABLED !== 'true') { res.status(503).json({error:'Intelligence not enabled'}); return; }
  next();
});
intelligenceRouter.get('/',asyncHandler(async(_req,res)=>{res.json({jobs:await store.list()});}));
// Independent opt-in journal. Registered before /:id to avoid UUID parameter capture.
// This records *unverified* operator observations; no asset application/publishing route.
intelligenceRouter.get('/visual-reviews',asyncHandler(async(req,res)=>{
  if(process.env.VISUAL_REVIEW_JOURNAL_ENABLED!=='true') {res.status(503).json({error:'Visual review journal disabled'});return;}
  try {res.json(await visualJournal.list(String(req.query.slug??'')));}
  catch(e) {
    if(e instanceof Error && e.message==='invalid_visual_review_slug') {res.status(400).json({error:e.message});return;}
    throw e;
  }
}));
intelligenceRouter.post('/visual-reviews',asyncHandler(async(req,res)=>{
  if(process.env.VISUAL_REVIEW_JOURNAL_ENABLED!=='true') {res.status(503).json({error:'Visual review journal disabled'});return;}
  const expected=process.env.EDITORIAL_REVIEW_TOKEN;
  if(!expected || expected===process.env.ADMIN_API_TOKEN || req.header('x-editorial-review-token')!==expected) {
    res.status(403).json({error:'Publisher credential required'});return;
  }
  try {res.status(201).json(await visualJournal.append(req.body));}
  catch(e) {
    const code=e instanceof Error?e.message:'';
    if(code==='invalid_visual_review' || code==='visual_review_id_conflict') {
      res.status(code==='invalid_visual_review'?400:409).json({error:code});return;
    }
    throw e;
  }
}));
// Visual decisions remain independent of editorial release authorization.
// A normal admin token can read; a separate Publisher token is mandatory for writes.
intelligenceRouter.get('/visual-decisions/:observationId',asyncHandler(async(req,res)=>{
  if(process.env.VISUAL_REVIEW_JOURNAL_ENABLED!=='true') {res.status(503).json({error:'Visual review journal disabled'});return;}
  const id=Number(req.params.observationId);
  try{res.json(await visualDecisions.list(id));}
  catch(e){if(e instanceof Error && e.message==='invalid_visual_decision'){res.status(400).json({error:e.message});return;}throw e;}
}));
intelligenceRouter.post('/visual-decisions',asyncHandler(async(req,res)=>{
  if(process.env.VISUAL_REVIEW_JOURNAL_ENABLED!=='true') {res.status(503).json({error:'Visual review journal disabled'});return;}
  const expected=process.env.EDITORIAL_REVIEW_TOKEN;
  if(!expected || expected===process.env.ADMIN_API_TOKEN || req.header('x-editorial-review-token')!==expected) {
    res.status(403).json({error:'Publisher credential required'});return;
  }
  try{res.status(201).json(await visualDecisions.append(req.body));}
  catch(e){const code=e instanceof Error?e.message:'';
    if(['invalid_visual_decision','visual_decision_conflict','visual_observation_not_found'].includes(code)) {
      res.status(code==='invalid_visual_decision'?400:code==='visual_observation_not_found'?404:409).json({error:code});return;
    }
    throw e;
  }
}));
intelligenceRouter.param('id',(req,res,next,id)=>{
  if (!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id)) {res.status(400).json({error:'Invalid job ID'});return;}
  next();
});
intelligenceRouter.get('/:id',asyncHandler(async(req,res)=>{const job=await store.detail(req.params.id);res.status(job?200:404).json(job??{error:'Not found'});}));
intelligenceRouter.post('/',asyncHandler(async(req,res)=>{
  try { res.status(202).json(await store.enqueue(req.body?.key,req.body?.brief,req.body?.priority??0)); }
  catch(e) {
    const message=e instanceof Error?e.message:'';
    if (['invalid_request','invalid_brief','invalid_source','Invalid URL','idempotency_conflict'].includes(message)) {res.status(message==='idempotency_conflict'?409:400).json({error:message});return;}
    throw e;
  }
}));
for (const action of ['cancel','retry'] as const) intelligenceRouter.post(`/:id/${action}`,asyncHandler(async(req,res)=>{
  const changed=await store[action](req.params.id);res.status(changed?200:409).json({changed});
}));

intelligenceRouter.get('/:id/artifacts',asyncHandler(async(req,res)=>{res.json({artifacts:await store.artifacts(req.params.id)});}));
intelligenceRouter.post('/:id/artifacts',asyncHandler(async(req,res)=>{
  try {res.status(201).json(await store.appendArtifact(req.params.id,req.body));}
  catch(e) {
    const code=e instanceof Error?e.message:'';
    const status:Record<string,number>={invalid_artifact:400,unknown_source:400,job_not_found:404,job_not_reviewable:409,artifact_version_conflict:409};
    if(status[code]) {res.status(status[code]).json({error:code});return;} throw e;
  }
}));

intelligenceRouter.get('/:id/review-package',asyncHandler(async(req,res)=>{res.json(await store.reviewPackage(req.params.id));}));
// Separate publisher credential: never exposed by the ordinary admin proxy or worker.
intelligenceRouter.post('/:id/review',asyncHandler(async(req,res)=>{
  const expected=process.env.EDITORIAL_REVIEW_TOKEN;
  if(!expected || expected===process.env.ADMIN_API_TOKEN || req.header('x-editorial-review-token')!==expected) {res.status(403).json({error:'Publisher credential required'});return;}
  try {res.status(201).json(await store.recordReview(req.params.id,req.body));}
  catch(e) {const code=e instanceof Error?e.message:'';if(['invalid_review','job_not_reviewable','review_version_conflict','review_blocked'].includes(code)){res.status(409).json({error:code});return;}throw e;}
}));
