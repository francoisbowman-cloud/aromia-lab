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

-- Public API consumers must never receive a legacy Fragrantica/retailer image URL.
-- imagen_url is normalized to Aromia's same-origin Amazon-only resolver.
UPDATE perfumes
SET imagen_url = 'https://www.aromialab.com/api/catalog-image/' || slug,
    image_source = COALESCE(NULLIF(btrim(amazon_url), ''), NULLIF(btrim(link_afiliado), '')),
    visual_quality = 'amazon-runtime-resolved',
    affiliate_status = CASE
      WHEN COALESCE(amazon_url, link_afiliado) ILIKE '%tag=aromialab-20%' THEN 'active'
      ELSE COALESCE(affiliate_status, 'pending')
    END,
    actualizado_en = now()
WHERE activo = true AND estado = 'publicado'
  AND COALESCE(amazon_url, link_afiliado) ~* '^https?://([^/]*\.)?amazon\.com/';

DO $$
DECLARE
  bad_commerce integer;
  bad_image_route integer;
BEGIN
  SELECT count(*) INTO bad_commerce
  FROM perfumes
  WHERE activo = true AND estado = 'publicado'
    AND NOT (COALESCE(NULLIF(btrim(link_afiliado), ''), NULLIF(btrim(amazon_url), '')) ~* '^https?://([^/]*\.)?amazon\.com/');

  SELECT count(*) INTO bad_image_route
  FROM perfumes
  WHERE activo = true AND estado = 'publicado'
    AND imagen_url <> ('https://www.aromialab.com/api/catalog-image/' || slug);

  IF bad_commerce <> 0 THEN
    RAISE EXCEPTION 'AMAZON_CATALOG_GATE_FAILED: % active published perfumes do not have an Amazon commerce URL', bad_commerce;
  END IF;
  IF bad_image_route <> 0 THEN
    RAISE EXCEPTION 'AMAZON_IMAGE_ROUTE_GATE_FAILED: % active published perfumes do not use the Aromia Amazon-only resolver', bad_image_route;
  END IF;
END $$;
