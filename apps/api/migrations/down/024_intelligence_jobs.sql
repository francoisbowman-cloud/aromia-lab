-- Refuse rollback if it would destroy any recorded work.
BEGIN;
LOCK TABLE intelligence_jobs, intelligence_events IN ACCESS EXCLUSIVE MODE;
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM intelligence_jobs) OR EXISTS(SELECT 1 FROM intelligence_events) THEN
  RAISE EXCEPTION 'Archive and explicitly review operational data before rollback';
 END IF;
END $$;
DROP TABLE intelligence_events;
DROP TABLE intelligence_jobs;
COMMIT;
