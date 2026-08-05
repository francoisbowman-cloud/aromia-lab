-- Captura de email para el newsletter (scaffold, sin envío real todavía —
-- ver decisión de Brey sobre proveedor de email pendiente en ESTADO-aromia.md).
CREATE TABLE IF NOT EXISTS subscribers (
  id          SERIAL PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  fuente      TEXT NOT NULL DEFAULT 'home' CHECK (fuente IN ('home', 'quiz')),
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT now()
);
