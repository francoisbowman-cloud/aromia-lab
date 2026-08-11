-- Final Batch 003 media repair: replace two retailer assets that no longer serve images.
UPDATE perfumes
SET imagen_url = CASE slug
      WHEN 'new-york-signature-scent-pure-perfume' THEN 'https://www.bondno9.com/cdn/shop/files/SIGNATURE_32dbaafa-4cac-4d43-8166-5d8c02783dee.png?v=1750350403&width=2048'
      WHEN 'chanel-no5-edp' THEN 'https://www.chanel.com/images//t_one/w_0.43,h_0.43,c_crop/q_auto:good,f_auto,fl_lossy,dpr_1.2/w_620/n-5-eau-de-parfum-spray-3-4fl-oz--packshot-default-125530-9564912943134.jpg'
    END,
    visual_quality = 'omni-product-approved',
    actualizado_en = now()
WHERE activo = true
  AND estado = 'publicado'
  AND slug IN ('new-york-signature-scent-pure-perfume', 'chanel-no5-edp');

DO $$
DECLARE
  repaired_count integer;
BEGIN
  SELECT count(*) INTO repaired_count
  FROM perfumes
  WHERE activo = true
    AND estado = 'publicado'
    AND slug IN ('new-york-signature-scent-pure-perfume', 'chanel-no5-edp')
    AND visual_quality = 'omni-product-approved';

  IF repaired_count <> 2 THEN
    RAISE EXCEPTION 'OMNI_PACKSHOT_REPAIR_FAILED repaired=% expected=2', repaired_count;
  END IF;
END $$;
