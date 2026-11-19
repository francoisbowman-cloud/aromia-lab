-- Opt-in only. Versions are appended by the API, never overwritten.
CREATE TABLE IF NOT EXISTS intelligence_artifacts (
 id bigserial PRIMARY KEY,
 job_id uuid NOT NULL REFERENCES intelligence_jobs(id),
 kind text NOT NULL CHECK(kind IN ('research_note','draft','fact_check','edit','art_brief','qa_report')),
 version integer NOT NULL CHECK(version>0),
 content text NOT NULL CHECK(length(content) BETWEEN 1 AND 100000),
 source_urls jsonb NOT NULL,
 actor text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(job_id,kind,version)
);
