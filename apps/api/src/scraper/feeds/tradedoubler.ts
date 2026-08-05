import type { FeedProduct } from "../types";

// NO VALIDADO — Perfume's Club corre en Tradedoubler, no Awin, y el
// formato de su feed de producto no está confirmado (a diferencia de
// Awin, cuyo formato CSV está documentado públicamente). Tradedoubler
// expone datafeeds por programa vía panel propio, normalmente XML o CSV,
// pero la URL/columnas exactas dependen de cómo Perfume's Club configuró
// su feed — no hay forma de confirmar esto sin acceso real a la cuenta
// de afiliado. Dejar sin activar hasta que Brey se registre en
// Tradedoubler y comparta la URL de descarga real del feed; en ese
// momento hay que ajustar el parseo de abajo contra el formato real.
export async function fetchTradedoublerFeed(
  _programId: string,
  _token: string,
): Promise<FeedProduct[]> {
  throw new Error(
    "Feed de Tradedoubler (Perfume's Club) sin implementar todavía — falta validar el formato real contra credenciales de afiliado reales.",
  );
}
