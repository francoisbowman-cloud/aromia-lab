ALTER TABLE articles ADD COLUMN IF NOT EXISTS nivel TEXT;

ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_nivel_check;
ALTER TABLE articles ADD CONSTRAINT articles_nivel_check
  CHECK (nivel IS NULL OR nivel IN ('n1', 'n2', 'n3', 'n4'));
