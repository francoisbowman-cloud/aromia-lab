-- Suma nicho_o_comercial (schema/perfume.schema.json), pendiente desde
-- Sprint 1 hasta que se confirmó su uso real para filtros en el frontend.
ALTER TABLE perfumes
  ADD COLUMN IF NOT EXISTS nicho_o_comercial TEXT
    CHECK (nicho_o_comercial IN ('nicho', 'comercial'));

CREATE INDEX IF NOT EXISTS idx_perfumes_nicho_o_comercial ON perfumes (nicho_o_comercial);
