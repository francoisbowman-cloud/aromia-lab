-- Permite publicar filas del catálogo validadas aunque ciertos campos comerciales
-- sigan pendientes. La ausencia se representa como NULL; nunca se inventa precio,
-- moneda, familia, imagen o enlace afiliado para satisfacer constraints legacy.
ALTER TABLE perfumes
  ALTER COLUMN familia_olfativa DROP NOT NULL,
  ALTER COLUMN precio_referencia DROP NOT NULL,
  ALTER COLUMN moneda DROP NOT NULL,
  ALTER COLUMN categoria_precio DROP NOT NULL,
  ALTER COLUMN imagen_url DROP NOT NULL,
  ALTER COLUMN link_afiliado DROP NOT NULL;

ALTER TABLE perfumes
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS data_confidence TEXT,
  ADD COLUMN IF NOT EXISTS notes_status TEXT,
  ADD COLUMN IF NOT EXISTS catalog_source TEXT;
