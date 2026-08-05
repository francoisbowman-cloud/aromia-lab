-- Artículos del Magazine (panel admin). Categorías simples del mockup
-- (no el enum tipo de v1) — decisión tomada con Brey.
CREATE TABLE IF NOT EXISTS articles (
  id                  SERIAL PRIMARY KEY,
  slug                TEXT NOT NULL UNIQUE,
  titulo              TEXT NOT NULL,
  categoria           TEXT NOT NULL
    CHECK (categoria IN ('resena', 'guia', 'analisis', 'academia', 'tendencias')),
  estado              TEXT NOT NULL DEFAULT 'borrador' CHECK (estado IN ('borrador', 'publicado')),
  contenido_html      TEXT,
  imagen_portada_url  TEXT,
  imagen_og_url       TEXT,
  meta_title          TEXT,
  meta_description    TEXT,
  url_canonica        TEXT,
  perfumes_relacionados INTEGER[] NOT NULL DEFAULT '{}',
  keyword_objetivo    TEXT,
  publicado_en        TIMESTAMPTZ,
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_estado ON articles (estado);
CREATE INDEX IF NOT EXISTS idx_articles_categoria ON articles (categoria);
