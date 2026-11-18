-- Opt-in. Captures are retrieval evidence, not factual or rights approval.
CREATE TABLE IF NOT EXISTS intelligence_sources (
 id bigserial PRIMARY KEY, job_id uuid NOT NULL REFERENCES intelligence_jobs(id),
 url text NOT NULL, sha256 text NOT NULL, content text NOT NULL,
 excerpt_found boolean NOT NULL, retrieved_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(job_id,url,sha256)
);
CREATE TABLE IF NOT EXISTS intelligence_reviews (
 id bigserial PRIMARY KEY, job_id uuid NOT NULL REFERENCES intelligence_jobs(id),
 bundle_hash text NOT NULL, decision text NOT NULL CHECK(decision IN ('approved','changes_requested')),
 note text NOT NULL, actor text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
