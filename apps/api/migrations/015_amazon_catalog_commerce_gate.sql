-- Amazon is the commerce/image authority for active published perfumes.
UPDATE perfumes
SET amazon_url = link_afiliado, actualizado_en = now()
WHERE activo = true AND estado = 'publicado'
  AND (amazon_url IS NULL OR btrim(amazon_url) = '' OR lower(btrim(amazon_url)) = 'pending')
  AND link_afiliado ~* '^https?://([^/]*\.)?amazon\.com/';

UPDATE perfumes
SET link_afiliado = amazon_url, actualizado_en = now()
WHERE activo = true AND estado = 'publicado'
  AND (link_afiliado IS NULL OR btrim(link_afiliado) = '' OR lower(btrim(link_afiliado)) = 'pending' OR link_afiliado !~* '^https?://([^/]*\.)?amazon\.com/')
  AND amazon_url ~* '^https?://([^/]*\.)?amazon\.com/';

UPDATE perfumes
SET image_source = COALESCE(NULLIF(btrim(amazon_url), ''), NULLIF(btrim(link_afiliado), '')),
    visual_quality = 'amazon-runtime-resolved',
    affiliate_status = CASE WHEN COALESCE(amazon_url, link_afiliado) ILIKE '%tag=aromialab-20%' THEN 'active' ELSE COALESCE(affiliate_status, 'pending') END,
    actualizado_en = now()
WHERE activo = true AND estado = 'publicado'
  AND COALESCE(amazon_url, link_afiliado) ~* '^https?://([^/]*\.)?amazon\.com/';

DO $$
DECLARE bad_count integer;
BEGIN
  SELECT count(*) INTO bad_count FROM perfumes
  WHERE activo = true AND estado = 'publicado'
    AND NOT (COALESCE(NULLIF(btrim(link_afiliado), ''), NULLIF(btrim(amazon_url), '')) ~* '^https?://([^/]*\.)?amazon\.com/');
  IF bad_count <> 0 THEN
    RAISE EXCEPTION 'AMAZON_CATALOG_GATE_FAILED: % active published perfumes do not have an Amazon commerce URL', bad_count;
  END IF;
END $$;
