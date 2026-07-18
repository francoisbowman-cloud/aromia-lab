-- Estado editorial (borrador/publicado) del panel admin — distinto de
-- `activo`, que es el soft-delete que ya usa la API pública.
ALTER TABLE perfumes
  ADD COLUMN IF NOT EXISTS estado TEXT NOT NULL DEFAULT 'publicado'
    CHECK (estado IN ('borrador', 'publicado'));

CREATE INDEX IF NOT EXISTS idx_perfumes_estado ON perfumes (estado);
