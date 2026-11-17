-- Opt-in migration; not part of API startup. No public article writes.
CREATE TABLE IF NOT EXISTS intelligence_jobs (
 id uuid PRIMARY KEY, dedupe_key text UNIQUE NOT NULL,
 kind text NOT NULL CHECK(kind = 'editorial.prepare'),
 payload jsonb NOT NULL, status text NOT NULL DEFAULT 'queued'
 CHECK(status IN ('queued','running','awaiting_review','failed','cancelled')),
 priority integer NOT NULL DEFAULT 0 CHECK(priority BETWEEN 0 AND 10),
 attempts integer NOT NULL DEFAULT 0, max_attempts integer NOT NULL DEFAULT 3 CHECK(max_attempts BETWEEN 1 AND 5),
 available_at timestamptz NOT NULL DEFAULT now(), lease_until timestamptz,
 token uuid, result jsonb, error_code text,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS intelligence_jobs_claim ON intelligence_jobs(status,available_at,priority);
CREATE TABLE IF NOT EXISTS intelligence_events (
 id bigserial PRIMARY KEY, job_id uuid NOT NULL REFERENCES intelligence_jobs(id),
 event text NOT NULL, details jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now()
);
