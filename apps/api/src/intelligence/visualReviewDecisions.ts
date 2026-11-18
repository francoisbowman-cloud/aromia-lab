import type { Pool } from 'pg';
const key=/^[a-z0-9][a-z0-9._-]{0,159}$/;
export type VisualDecision = {
  decisionKey:string;
  observationId:number;
  decision:'changes_requested'|'rejected'|'needs_further_evidence';
  reason:string;
};
export function validateVisualDecision(value:unknown):VisualDecision {
  if(!value || typeof value!=='object')throw new Error('invalid_visual_decision');
  const p=value as Partial<VisualDecision>;
  if(typeof p.decisionKey!=='string' || !key.test(p.decisionKey) ||
     !Number.isSafeInteger(p.observationId) || !p.observationId || p.observationId<=0 ||
     !['changes_requested','rejected','needs_further_evidence'].includes(p.decision??'') ||
     typeof p.reason!=='string' || p.reason.trim().length<10 || p.reason.length>5000)
      throw new Error('invalid_visual_decision');
  return {decisionKey:p.decisionKey,observationId:p.observationId,decision:p.decision!,reason:p.reason.trim()};
}
export class VisualReviewDecisions {
  constructor(private readonly db:Pool){}
  async append(input:unknown) {
    const p=validateVisualDecision(input);
    const c=await this.db.connect();
    try{
      await c.query('BEGIN');
      // Lock the referenced observation so an orphan or mismatched decision cannot be recorded.
      const found=await c.query('SELECT id FROM intelligence_visual_reviews WHERE id=$1 FOR KEY SHARE',[p.observationId]);
      if(!found.rowCount)throw new Error('visual_observation_not_found');
      const created=await c.query(`INSERT INTO intelligence_visual_review_decisions
       (observation_id,decision_key,decision,reason) VALUES($1,$2,$3,$4)
       ON CONFLICT(decision_key) DO NOTHING
       RETURNING id,observation_id,decision_key,decision,reason,actor,recorded_at`,
       [p.observationId,p.decisionKey,p.decision,p.reason]);
      if(!created.rowCount)throw new Error('visual_decision_conflict');
      await c.query('COMMIT');
      return {...created.rows[0],approval:false,publication:'blocked',applied:false};
    }catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}
  }
  async list(observationId:number){
    if(!Number.isSafeInteger(observationId)||observationId<=0)throw new Error('invalid_visual_decision');
    const result=await this.db.query(`SELECT id,observation_id,decision_key,decision,reason,actor,recorded_at
      FROM intelligence_visual_review_decisions WHERE observation_id=$1 ORDER BY id DESC LIMIT 100`,[observationId]);
    return {decisions:result.rows,approval:false,publication:'blocked',applied:false};
  }
}
