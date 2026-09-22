-- Ingesta real de los 9 borradores de SubBatch 01 (decisión de Brey,
-- WS-1 ítem 1.2 / D-6): subBatch01Story.tsx leía drafts/*.md del disco en
-- tiempo de render, y drafts/ no está en la imagen de runtime de Railway
-- (Dockerfile solo copia .next/public/package.json al stage final) — de
-- ahí el 500 real en producción para las 9 rutas. El contenido pasa a
-- vivir en Postgres, como el resto del contenido editorial real.
ALTER TABLE articles ADD COLUMN IF NOT EXISTS contenido_markdown TEXT;
