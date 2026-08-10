DO $$
DECLARE
  total_rows integer;
  published_rows integer;
BEGIN
  SELECT count(*) INTO total_rows FROM perfumes;
  SELECT count(*) INTO published_rows
  FROM perfumes
  WHERE activo = true AND estado = 'publicado';

  -- Production contract before Batch 003: exactly 125 catalog rows are intentionally published.
  -- If the table still contains exactly those 125 rows but visibility flags drifted, restore them.
  IF total_rows = 125 AND published_rows <> 125 THEN
    UPDATE perfumes
    SET activo = true,
        estado = 'publicado',
        actualizado_en = now();

    SELECT count(*) INTO published_rows
    FROM perfumes
    WHERE activo = true AND estado = 'publicado';
  END IF;

  IF total_rows <> 125 THEN
    RAISE EXCEPTION 'CATALOG_ROW_COUNT_MISMATCH: expected 125 total rows before Batch 003, found %', total_rows;
  END IF;

  IF published_rows <> 125 THEN
    RAISE EXCEPTION 'PUBLISHED_CATALOG_COUNT_MISMATCH: expected 125 published rows, found %', published_rows;
  END IF;
END $$;
