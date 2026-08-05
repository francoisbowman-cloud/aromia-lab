-- Columnas para distinguir retailers cargados a mano desde el admin
-- (fuente='manual', default) de los que mantiene el scraper de precios
-- (fuente='awin_douglas', 'awin_primor', 'tradedoubler_perfumesclub', etc.).
-- El scraper solo hace upsert sobre sus propias filas (índice único parcial
-- que excluye 'manual') — nunca toca ni borra lo que cargó un admin a mano.
ALTER TABLE retailers
  ADD COLUMN IF NOT EXISTS fuente TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS sincronizado_en TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_retailers_perfume_fuente_sync
  ON retailers (perfume_id, fuente)
  WHERE fuente <> 'manual';
