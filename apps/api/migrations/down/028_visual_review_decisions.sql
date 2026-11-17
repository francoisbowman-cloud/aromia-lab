-- Preserve decisions; rollback requires explicit authorized archival if any exist.
BEGIN;
LOCK TABLE intelligence_visual_review_decisions IN ACCESS EXCLUSIVE MODE;
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM intelligence_visual_review_decisions) THEN
  RAISE EXCEPTION 'Visual decision records exist; archival and authorization required';
 END IF;
END $$;
DROP TABLE intelligence_visual_review_decisions;
COMMIT;
