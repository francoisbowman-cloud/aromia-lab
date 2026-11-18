-- Run ledger holds operational metrics only (no editorial data); rollback is safe
-- but erases scheduler history, so it is explicit and transactional.
BEGIN;
LOCK TABLE intelligence_runs IN ACCESS EXCLUSIVE MODE;
DROP TABLE intelligence_runs;
COMMIT;
