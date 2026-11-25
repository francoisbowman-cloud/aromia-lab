-- Opt-in migration only. Operational ledger of bounded work-batch invocations.
-- Stores counters, duration and a closed failure code: never payloads or error text.
-- Not editorial data and not publication approval.
CREATE TABLE IF NOT EXISTS intelligence_runs (
 id bigserial PRIMARY KEY,
 outcome text NOT NULL CHECK(outcome IN ('ok','failed')),
 failure_code text CHECK(failure_code ~ '^[a-z_]{1,64}$'),
 attempted integer NOT NULL CHECK(attempted BETWEEN 0 AND 25),
 processed integer NOT NULL CHECK(processed BETWEEN 0 AND 25 AND processed <= attempted),
 duration_ms integer NOT NULL CHECK(duration_ms >= 0),
 finished_at timestamptz NOT NULL DEFAULT now(),
 CHECK((outcome='ok' AND failure_code IS NULL) OR (outcome='failed' AND failure_code IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS intelligence_runs_finished_idx ON intelligence_runs(finished_at DESC, id DESC);
