-- CCL audit remediation 2026-08-11.
-- These three published rows returned 404 through the product-image route.
-- Use Fragrantica's actual product packshot endpoint, never the social/share card.
UPDATE perfumes
SET imagen_url = CASE slug
      WHEN 'luna-rossa-edt' THEN 'https://fimgs.net/mdimg/perfume/375x500.15754.jpg'
      WHEN 'chanel-no5-edp' THEN 'https://fimgs.net/mdimg/perfume/375x500.40069.jpg'
      WHEN 'straight-to-heaven-white-cristal-edp' THEN 'https://fimgs.net/mdimg/perfume/375x500.4323.jpg'
    END,
    visual_quality = 'omni-product-approved',
    actualizado_en = now()
WHERE activo = true
  AND estado = 'publicado'
  AND slug IN ('luna-rossa-edt', 'chanel-no5-edp', 'straight-to-heaven-white-cristal-edp');

DO $$
DECLARE
  repaired_count integer;
BEGIN
  SELECT count(*) INTO repaired_count
  FROM perfumes
  WHERE activo = true
    AND estado = 'publicado'
    AND visual_quality = 'omni-product-approved'
    AND (
      (slug = 'luna-rossa-edt' AND imagen_url = 'https://fimgs.net/mdimg/perfume/375x500.15754.jpg')
      OR (slug = 'chanel-no5-edp' AND imagen_url = 'https://fimgs.net/mdimg/perfume/375x500.40069.jpg')
      OR (slug = 'straight-to-heaven-white-cristal-edp' AND imagen_url = 'https://fimgs.net/mdimg/perfume/375x500.4323.jpg')
    );

  IF repaired_count <> 3 THEN
    RAISE EXCEPTION 'CCL_PACKSHOT_REPAIR_FAILED repaired=% expected=3', repaired_count;
  END IF;
END $$;
