-- Agrega 'club' como fuente válida de suscripción (lista de espera de
-- /club, decisión #54 de ESTADO-aromia.md). Postgres no permite alterar
-- un CHECK in place: hay que borrarlo y recrearlo.
ALTER TABLE subscribers DROP CONSTRAINT IF EXISTS subscribers_fuente_check;
ALTER TABLE subscribers ADD CONSTRAINT subscribers_fuente_check
  CHECK (fuente IN ('home', 'quiz', 'club'));
