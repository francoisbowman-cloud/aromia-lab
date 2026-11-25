BEGIN;
LOCK TABLE intelligence_artifacts IN ACCESS EXCLUSIVE MODE;
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM intelligence_artifacts) THEN
  RAISE EXCEPTION 'Archive and explicitly review editorial versions before rollback';
 END IF;
END $$;
DROP TABLE intelligence_artifacts;
COMMIT;
