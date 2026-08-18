DO $$
DECLARE
  total_rows integer;
  published_rows integer;
BEGIN
  SELECT count(*) INTO total_rows FROM perfumes;
  SELECT count(*) INTO published_rows
  FROM perfumes
  WHERE activo = true AND estado = 'publicado';

  -- Aromia's verified pre-expansion floor is 125 rows. Catalog expansion is additive,
  -- so runtime integrity must never impose a fixed upper count that blocks safe batches.
  -- If the baseline table still contains exactly 125 rows but visibility flags drifted,
  -- preserve the historical self-heal behavior for that legacy state only.
  IF total_rows = 125 AND published_rows <> 125 THEN
    UPDATE perfumes
    SET activo = true,
        estado = 'publicado',
        actualizado_en = now();

    SELECT count(*) INTO published_rows
    FROM perfumes
    WHERE activo = true AND estado = 'publicado';
  END IF;

  IF total_rows < 125 THEN
    RAISE EXCEPTION 'CATALOG_ROW_COUNT_UNDERFLOW: expected at least 125 total rows, found %', total_rows;
  END IF;

  IF published_rows <> total_rows THEN
    RAISE EXCEPTION 'PUBLISHED_CATALOG_COUNT_MISMATCH: expected all % catalog rows published, found %', total_rows, published_rows;
  END IF;
END $$;
