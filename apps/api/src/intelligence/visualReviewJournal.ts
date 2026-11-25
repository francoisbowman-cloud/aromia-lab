import type { Pool } from 'pg';
export type VisualReviewObservation = {
  reviewId: string;
  productSlug: string;
  productFingerprint: string;
  imageSha256: string;
  operatorNote: string;
  evidence: { identity: string; rights: string; visual: string };
};
const hex = /^[0-9a-f]{64}$/;
const word = /^[a-z0-9][a-z0-9._-]{0,159}$/;
const bounded = (s: unknown, max: number): s is string =>
  typeof s === 'string' && s.trim().length > 0 && s.length <= max;
export function validateVisualReviewObservation(input: unknown): VisualReviewObservation {
  if (!input || typeof input !== 'object') throw new Error('invalid_visual_review');
  const p = input as Partial<VisualReviewObservation>;
  if (!bounded(p.reviewId,160) || !word.test(p.reviewId) ||
      !bounded(p.productSlug,160) || !word.test(p.productSlug) ||
      typeof p.productFingerprint !== 'string' || !hex.test(p.productFingerprint) ||
      typeof p.imageSha256 !== 'string' || !hex.test(p.imageSha256) ||
      !bounded(p.operatorNote,5000) || !p.evidence ||
      typeof p.evidence !== 'object' || Array.isArray(p.evidence) ||
      !bounded(p.evidence.identity,3000) || !bounded(p.evidence.rights,3000) ||
      !bounded(p.evidence.visual,3000))
    throw new Error('invalid_visual_review');
  return {
    reviewId:p.reviewId, productSlug:p.productSlug,
    productFingerprint:p.productFingerprint, imageSha256:p.imageSha256,
    operatorNote:p.operatorNote.trim(),
    evidence:{
      identity:p.evidence.identity.trim(),
      rights:p.evidence.rights.trim(),
      visual:p.evidence.visual.trim()
    }
  };
}
export class VisualReviewJournal {
  constructor(private readonly db: Pool) {}
  // This appends an untrusted human/operator observation. The submitted image hash
  // is NOT independently checked against bytes by this API; it cannot approve assets.
  async append(input: unknown) {
    const p = validateVisualReviewObservation(input);
    const result = await this.db.query(
      `INSERT INTO intelligence_visual_reviews
       (review_id,product_slug,product_fingerprint,image_sha256,operator_note,evidence)
       VALUES ($1,$2,$3,$4,$5,$6::jsonb)
       ON CONFLICT (review_id) DO NOTHING
       RETURNING id,review_id,product_slug,product_fingerprint,image_sha256,
         status,actor,recorded_at`,
      [p.reviewId,p.productSlug,p.productFingerprint,p.imageSha256,p.operatorNote,JSON.stringify(p.evidence)]
    );
    if (!result.rowCount) throw new Error('visual_review_id_conflict');
    return {...result.rows[0],publication:'blocked',rightsVerified:false,identityVerified:false};
  }
  async list(productSlug: string) {
    if (!word.test(productSlug)) throw new Error('invalid_visual_review_slug');
    const r = await this.db.query(
      `SELECT id,review_id,product_slug,product_fingerprint,image_sha256,
          operator_note,evidence,status,actor,recorded_at
         FROM intelligence_visual_reviews WHERE product_slug=$1
         ORDER BY id DESC LIMIT 100`,[productSlug]
    );
    return {reviews:r.rows,publication:'blocked',rightsVerified:false,identityVerified:false};
  }
}
