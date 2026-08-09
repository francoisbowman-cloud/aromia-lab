-- Display-integrity gate: internal workflow tokens must never leak into public fields.
-- Optional metadata may remain NULL when a trustworthy source does not publish it;
-- the frontend omits such fields instead of fabricating values.
DO $$
DECLARE
  leaked_placeholders integer;
BEGIN
  SELECT count(*) INTO leaked_placeholders
  FROM perfumes
  WHERE activo = true
    AND estado = 'publicado'
    AND (
      lower(coalesce(btrim(familia_olfativa), '')) IN ('pending', 'por verificar', 'no verificado', 'floral pending')
      OR lower(coalesce(btrim(concentracion), '')) IN ('pending', 'por verificar', 'no verificado')
      OR lower(coalesce(btrim(descripcion_corta), '')) IN ('pending', 'por verificar', 'no verificado')
      OR lower(coalesce(btrim(imagen_url), '')) IN ('pending', 'por verificar', 'no verificado')
      OR lower(coalesce(btrim(link_afiliado), '')) IN ('pending', 'por verificar', 'no verificado')
      OR EXISTS (
        SELECT 1 FROM unnest(coalesce(notas_salida, ARRAY[]::text[]) || coalesce(notas_corazon, ARRAY[]::text[]) || coalesce(notas_fondo, ARRAY[]::text[])) AS note
        WHERE lower(note) ~ '^(pending|por verificar|no verificado)'
      )
    );

  IF leaked_placeholders <> 0 THEN
    RAISE EXCEPTION 'Published catalog still contains % rows with internal placeholder tokens', leaked_placeholders;
  END IF;
END $$;
