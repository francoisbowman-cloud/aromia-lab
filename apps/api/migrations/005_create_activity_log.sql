-- Feed de actividad reciente del Dashboard admin. El actor por defecto es
-- 'Sistema' (nunca 'Cowork' — Cowork sigue en stand-by, decisión de Brey).
CREATE TABLE IF NOT EXISTS activity_log (
  id           SERIAL PRIMARY KEY,
  descripcion  TEXT NOT NULL,
  actor        TEXT NOT NULL DEFAULT 'Sistema',
  creado_en    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_creado_en ON activity_log (creado_en DESC);
