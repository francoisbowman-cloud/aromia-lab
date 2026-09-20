-- Soporte de índices para GET /api/perfumes/search y /discovery-seed
-- (handoffs/AROMIA_CODE_DISCOVERY_SEARCH_ARCHITECTURE_2026-09-20.md). El
-- endpoint público de listado ya filtraba por activo/estado y ordenaba por
-- nombre sin índice compuesto; ahora además hace ILIKE sobre nombre/marca y
-- filtra/particiona por familia_olfativa, ninguno de los dos con índice.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_perfumes_familia_olfativa ON perfumes (familia_olfativa);
CREATE INDEX IF NOT EXISTS idx_perfumes_activo_estado_nombre ON perfumes (activo, estado, nombre);
CREATE INDEX IF NOT EXISTS idx_perfumes_nombre_trgm ON perfumes USING gin (nombre gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_perfumes_marca_trgm ON perfumes USING gin (marca gin_trgm_ops);
