import { pool } from "../db/pool";
import { matchProductToPerfume } from "./matcher";
import type { RetailerFeedConfig, SyncResult } from "./types";

export async function syncRetailerFeed(config: RetailerFeedConfig): Promise<SyncResult> {
  const productos = await config.fetchFeed();
  let actualizados = 0;
  let sinMatch = 0;

  for (const producto of productos) {
    const perfumeId = await matchProductToPerfume(producto);
    if (!perfumeId) {
      sinMatch++;
      continue;
    }

    await pool.query(
      `INSERT INTO retailers (perfume_id, nombre, precio, moneda, link_afiliado, logo_url, fuente, sincronizado_en)
       VALUES ($1, $2, $3, $4, $5, $6, $7, now())
       ON CONFLICT (perfume_id, fuente) WHERE fuente <> 'manual'
       DO UPDATE SET
         precio = EXCLUDED.precio,
         moneda = EXCLUDED.moneda,
         link_afiliado = EXCLUDED.link_afiliado,
         logo_url = EXCLUDED.logo_url,
         actualizado_en = now(),
         sincronizado_en = now()`,
      [
        perfumeId,
        config.nombreVisible,
        producto.precio,
        producto.moneda,
        producto.link,
        producto.imagenUrl ?? null,
        config.fuente,
      ],
    );
    actualizados++;
  }

  await pool.query(`INSERT INTO activity_log (descripcion, actor) VALUES ($1, 'Sistema')`, [
    `Sync de precios ${config.nombreVisible}: ${actualizados} actualizados, ${sinMatch} sin match de ${productos.length} productos del feed`,
  ]);

  return { fuente: config.fuente, total: productos.length, actualizados, sinMatch };
}
