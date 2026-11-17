import { Router } from 'express';
import { pool } from '../../db/pool';
import { JobStore } from '../../intelligence/store';
import { asyncHandler } from '../../lib/asyncHandler';
export const intelligenceRouter = Router();
const store = new JobStore(pool);
intelligenceRouter.use((_req,res,next)=>{
  if (process.env.INTELLIGENCE_ENABLED !== 'true') { res.status(503).json({error:'Intelligence not enabled'}); return; }
  next();
});
intelligenceRouter.get('/',asyncHandler(async(_req,res)=>{res.json({jobs:await store.list()});}));
intelligenceRouter.param('id',(req,res,next,id)=>{
  if (!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id)) {res.status(400).json({error:'Invalid job ID'});return;}
  next();
});
intelligenceRouter.get('/:id',asyncHandler(async(req,res)=>{const job=await store.detail(req.params.id);res.status(job?200:404).json(job??{error:'Not found'});}));
intelligenceRouter.post('/',asyncHandler(async(req,res)=>{
  try { res.status(202).json(await store.enqueue(req.body.key,req.body.brief,req.body.priority??0)); }
  catch(e) {
    const message=e instanceof Error?e.message:'';
    if (['invalid_request','invalid_brief','invalid_source','Invalid URL','idempotency_conflict'].includes(message)) {res.status(message==='idempotency_conflict'?409:400).json({error:message});return;}
    throw e;
  }
}));
for (const action of ['cancel','retry'] as const) intelligenceRouter.post(`/:id/${action}`,asyncHandler(async(req,res)=>{
  const changed=await store[action](req.params.id);res.status(changed?200:409).json({changed});
}));
