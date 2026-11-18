BEGIN;
LOCK TABLE intelligence_sources,intelligence_reviews IN ACCESS EXCLUSIVE MODE;
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM intelligence_sources) OR EXISTS(SELECT 1 FROM intelligence_reviews) THEN
  RAISE EXCEPTION 'Archive and explicitly review evidence before rollback';
 END IF;
END $$;
DROP TABLE intelligence_reviews;
DROP TABLE intelligence_sources;
COMMIT;
