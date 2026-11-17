-- Refuse data loss; roll back only an unused schema.
BEGIN;
LOCK TABLE intelligence_visual_reviews IN ACCESS EXCLUSIVE MODE;
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM intelligence_visual_reviews) THEN
  RAISE EXCEPTION 'Visual review journal contains evidence; archive and obtain explicit authorization';
 END IF;
END $$;
DROP TABLE intelligence_visual_reviews;
COMMIT;
