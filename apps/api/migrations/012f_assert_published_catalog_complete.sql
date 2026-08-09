-- Publication gate: no active published perfume may render without the three
-- user-visible essentials corrected by this hotfix.
DO $$
DECLARE
  missing_visible integer;
BEGIN
  SELECT count(*) INTO missing_visible
  FROM perfumes
  WHERE activo = true
    AND estado = 'publicado'
    AND (
      imagen_url IS NULL OR btrim(imagen_url) = '' OR lower(btrim(imagen_url)) = 'pending'
      OR descripcion_corta IS NULL OR btrim(descripcion_corta) = '' OR lower(btrim(descripcion_corta)) = 'pending'
      OR link_afiliado IS NULL OR btrim(link_afiliado) = '' OR lower(btrim(link_afiliado)) = 'pending'
    );

  IF missing_visible <> 0 THEN
    RAISE EXCEPTION 'Published catalog still has % rows missing image/description/affiliate link', missing_visible;
  END IF;
END $$;
