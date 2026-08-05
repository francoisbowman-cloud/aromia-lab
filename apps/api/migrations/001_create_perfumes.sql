-- Tabla perfumes, alineada a schema/perfume.schema.json (raíz del repo)
CREATE TABLE IF NOT EXISTS perfumes (
  id                       SERIAL PRIMARY KEY,
  slug                     TEXT NOT NULL UNIQUE,
  nombre                   TEXT NOT NULL,
  marca                    TEXT NOT NULL,
  genero                   TEXT NOT NULL CHECK (genero IN ('masculino', 'femenino', 'unisex')),
  familia_olfativa         TEXT NOT NULL,
  concentracion            TEXT,
  notas_salida             TEXT[] NOT NULL DEFAULT '{}',
  notas_corazon            TEXT[] NOT NULL DEFAULT '{}',
  notas_fondo              TEXT[] NOT NULL DEFAULT '{}',
  temporada_recomendada    TEXT[] NOT NULL DEFAULT '{}',
  ocasion                  TEXT[] NOT NULL DEFAULT '{}',
  precio_referencia        NUMERIC(10, 2) NOT NULL,
  moneda                   TEXT NOT NULL,
  categoria_precio         TEXT NOT NULL CHECK (categoria_precio IN ('económico', 'medio', 'premium', 'lujo')),
  imagen_url               TEXT NOT NULL,
  link_afiliado            TEXT NOT NULL,
  tienda                   TEXT,
  rating_promedio          NUMERIC(2, 1),
  descripcion_corta        TEXT,
  articulo_relacionado_slug TEXT,
  activo                   BOOLEAN NOT NULL DEFAULT true,
  creado_en                TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_perfumes_activo ON perfumes (activo);
CREATE INDEX IF NOT EXISTS idx_perfumes_categoria_precio ON perfumes (categoria_precio);
