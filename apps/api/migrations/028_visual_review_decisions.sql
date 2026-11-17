-- Opt-in human decision log. Does not authorize assets, publishing or product changes.
CREATE TABLE IF NOT EXISTS intelligence_visual_review_decisions (
 id bigserial PRIMARY KEY,
 observation_id bigint NOT NULL REFERENCES intelligence_visual_reviews(id),
 decision_key text NOT NULL UNIQUE CHECK(length(decision_key) BETWEEN 1 AND 160),
 decision text NOT NULL CHECK(decision IN ('changes_requested','rejected','needs_further_evidence')),
 reason text NOT NULL CHECK(length(reason) BETWEEN 10 AND 5000),
 actor text NOT NULL DEFAULT 'publisher_credential',
 recorded_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS intelligence_visual_review_decisions_observation_idx
 ON intelligence_visual_review_decisions(observation_id,id DESC);
