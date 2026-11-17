-- Opt-in migration only; journaled observations are NOT verified rights or publishing approval.
CREATE TABLE IF NOT EXISTS intelligence_visual_reviews (
 id bigserial PRIMARY KEY,
 product_slug text NOT NULL CHECK(length(product_slug) BETWEEN 1 AND 160),
 product_fingerprint text NOT NULL CHECK(product_fingerprint ~ '^[0-9a-f]{64}$'),
 image_sha256 text NOT NULL CHECK(image_sha256 ~ '^[0-9a-f]{64}$'),
 review_id text NOT NULL UNIQUE CHECK(length(review_id) BETWEEN 1 AND 160),
 operator_note text NOT NULL CHECK(length(operator_note) BETWEEN 1 AND 5000),
 evidence jsonb NOT NULL CHECK(jsonb_typeof(evidence)='object'),
 status text NOT NULL DEFAULT 'recorded_pending_independent_verification'
    CHECK(status='recorded_pending_independent_verification'),
 actor text NOT NULL DEFAULT 'publisher_credential',
 recorded_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS intelligence_visual_reviews_product_idx
 ON intelligence_visual_reviews(product_slug, recorded_at DESC, id DESC);
