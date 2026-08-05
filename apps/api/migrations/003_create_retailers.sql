-- Tabla retailers (uno-a-muchos con perfumes), pensada para reemplazar
-- gradualmente las columnas legacy link_afiliado/tienda de perfumes, que
-- se mantienen sin tocar para no romper el API de lectura pública actual.
CREATE TABLE IF NOT EXISTS retailers (
  id                SERIAL PRIMARY KEY,
  perfume_id        INTEGER NOT NULL REFERENCES perfumes(id) ON DELETE CASCADE,
  nombre            TEXT NOT NULL,
  detalle           TEXT,
  precio            NUMERIC(10, 2) NOT NULL,
  moneda            TEXT NOT NULL,
  link_afiliado     TEXT NOT NULL,
  logo_url          TEXT,
  orden             INTEGER NOT NULL DEFAULT 0,
  activo            BOOLEAN NOT NULL DEFAULT true,
  creado_en         TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_retailers_perfume_id ON retailers (perfume_id);

-- Backfill: un retailer por perfume existente, a partir de las columnas legacy.
INSERT INTO retailers (perfume_id, nombre, precio, moneda, link_afiliado, orden)
SELECT id, COALESCE(tienda, 'Amazon'), precio_referencia, moneda, link_afiliado, 0
FROM perfumes
WHERE link_afiliado IS NOT NULL AND link_afiliado <> ''
  AND NOT EXISTS (SELECT 1 FROM retailers WHERE retailers.perfume_id = perfumes.id);

-- Campos del radar olfativo (bloque "Anatomía de una fragancia") y frase
-- editorial sintetizada para el bloque de reseñas de la comunidad. Nullable:
-- las filas existentes activan el estado "sin datos" hasta que se completen
-- desde el panel admin.
ALTER TABLE perfumes
  ADD COLUMN IF NOT EXISTS longevidad NUMERIC(3, 1),
  ADD COLUMN IF NOT EXISTS estela NUMERIC(3, 1),
  ADD COLUMN IF NOT EXISTS proyeccion NUMERIC(3, 1),
  ADD COLUMN IF NOT EXISTS resena_sintetizada TEXT;
