-- OMNI + CCL media gate: a social/share card is not a product asset.
-- Fragrantica exposes the actual packshot under /perfume/375x500.<id>.jpg.
UPDATE perfumes
SET imagen_url = regexp_replace(
      imagen_url,
      '/mdimg/perfume-social-cards/en-social-([0-9]+)\.jpeg(?:[?].*)?$',
      '/mdimg/perfume/375x500.\1.jpg',
      'i'
    ),
    visual_quality = 'omni-product-candidate',
    actualizado_en = now()
WHERE activo = true
  AND estado = 'publicado'
  AND imagen_url ~* '/mdimg/perfume-social-cards/en-social-[0-9]+\.jpeg';

DO $$
DECLARE
  published_count integer;
  social_card_count integer;
BEGIN
  SELECT count(*) INTO published_count
  FROM perfumes
  WHERE activo = true AND estado = 'publicado';

  SELECT count(*) INTO social_card_count
  FROM perfumes
  WHERE activo = true
    AND estado = 'publicado'
    AND imagen_url ~* '/perfume-social-cards/';

  IF published_count <> 125 THEN
    RAISE EXCEPTION 'OMNI_CCL_MEDIA_GATE_FAILED published_count=% expected=125', published_count;
  END IF;

  IF social_card_count <> 0 THEN
    RAISE EXCEPTION 'OMNI_CCL_MEDIA_GATE_FAILED social_cards=% expected=0', social_card_count;
  END IF;
END $$;
