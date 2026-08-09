-- Catalog audit remediation: fill only metadata that is currently missing/placeholder
-- and has been re-verified against the preserved research corpus / trusted sources.
-- Existing non-placeholder production values are never overwritten, except the known
-- malformed legacy value "floral pending" on Tresor.

WITH verified(slug, family, perfumer, launch_year, top_notes, middle_notes, base_notes) AS (
  VALUES
    ('daisy-edt', 'floral amaderado almizclado', NULL, NULL, NULL, NULL, NULL),
    ('chloe-edp', 'floral', NULL, NULL, NULL, NULL, NULL),
    ('philosykos-edt', 'aromatico verde', 'Olivia Giacobetti', 1996, 'higo', 'hoja de higuera', 'higuera'),
    ('do-son-edt', 'floral', 'Fabrice Pellegrin', 2005, 'flor de azahar africano;iris;rosa', 'tuberosa;pimienta rosa', 'almizcle;benjui'),
    ('halfeti-edp', 'oriental amaderado', 'Christian Provenzano', 2015, NULL, NULL, NULL),
    ('angels-share-edp', 'oriental vainilla', 'Benoist Lapouza', 2020, 'cognac', 'canela;haba tonka;roble;hedione', 'vainilla;praline;sandalo;almendra confitada'),
    ('eau-rose-edt', 'floral frutal', NULL, 2012, 'lichi;grosella negra;bergamota', 'rosa;geranio;jazmin', 'almizcle;miel blanca;cedro de virginia'),
    ('bat-extrait', 'amaderado aromatico', 'Prin Lomros', 2020, NULL, NULL, NULL),
    ('bleu-de-chanel-parfum', 'amaderado aromatico', 'Olivier Polge', 2018, NULL, NULL, NULL),
    ('coco-mademoiselle-edp', 'oriental floral', 'Jacques Polge', 2001, NULL, NULL, NULL),
    ('signorina-edp', 'floral frutal', NULL, 2011, NULL, NULL, NULL),
    ('leau-dissey-pour-homme-edt', 'amaderado acuatico', 'Jacques Cavallier', 1994, NULL, NULL, NULL),
    ('phantom-edt', 'amaderado aromatico', NULL, 2021, NULL, NULL, NULL),
    ('black-afgano-extrait', 'amaderado aromatico', 'Alessandro Gualtieri', 2009, NULL, NULL, NULL),
    ('tresor-edp', 'oriental floral', 'Sophia Grojsman', 1990, NULL, NULL, NULL)
)
UPDATE perfumes p
SET
  familia_olfativa = CASE
    WHEN p.familia_olfativa IS NULL
      OR btrim(p.familia_olfativa) = ''
      OR lower(btrim(p.familia_olfativa)) IN ('pending', 'por verificar', 'no verificado', 'floral pending')
    THEN v.family ELSE p.familia_olfativa END,
  perfumer = CASE
    WHEN v.perfumer IS NOT NULL AND (
      p.perfumer IS NULL OR btrim(p.perfumer) = '' OR lower(btrim(p.perfumer)) IN ('pending', 'por verificar', 'no verificado')
    ) THEN v.perfumer ELSE p.perfumer END,
  launch_year = COALESCE(p.launch_year, v.launch_year),
  notas_salida = CASE
    WHEN v.top_notes IS NOT NULL AND COALESCE(cardinality(p.notas_salida), 0) = 0
      THEN string_to_array(v.top_notes, ';') ELSE p.notas_salida END,
  notas_corazon = CASE
    WHEN v.middle_notes IS NOT NULL AND COALESCE(cardinality(p.notas_corazon), 0) = 0
      THEN string_to_array(v.middle_notes, ';') ELSE p.notas_corazon END,
  notas_fondo = CASE
    WHEN v.base_notes IS NOT NULL AND COALESCE(cardinality(p.notas_fondo), 0) = 0
      THEN string_to_array(v.base_notes, ';') ELSE p.notas_fondo END,
  actualizado_en = now()
FROM verified v
WHERE p.slug = v.slug;

-- Preserve uncertainty where no trustworthy formal family has been established.
-- Public UI now omits those optional fields instead of leaking internal placeholders.
UPDATE perfumes
SET familia_olfativa = NULL, actualizado_en = now()
WHERE slug IN ('ambre-sultan-edp', 'new-york-signature-scent-pure-perfume')
  AND (familia_olfativa IS NULL OR btrim(familia_olfativa) = '' OR lower(btrim(familia_olfativa)) IN ('pending', 'por verificar', 'no verificado'));
