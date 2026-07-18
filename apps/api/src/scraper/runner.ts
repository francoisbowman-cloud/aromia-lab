import cron from "node-cron";
import { fetchAwinFeed } from "./feeds/awin";
import { syncRetailerFeed } from "./sync";
import type { RetailerFeedConfig } from "./types";

// Fase 2 del rollout de retailers (ver ESTADO-aromia.md): Douglas y Primor
// corren en Awin, Perfume's Club en Tradedoubler (sin activar todavía, ver
// feeds/tradedoubler.ts). Cada config queda deshabilitada hasta que Brey
// se registre como afiliado en la red correspondiente y pase las
// credenciales — sin ellas, buildFeedConfigs() devuelve una lista vacía y
// el cron no se registra (mismo patrón que SendGrid/GA4: no-op si falta
// configuración, nunca rompe el arranque del servidor).
function buildFeedConfigs(): RetailerFeedConfig[] {
  const configs: RetailerFeedConfig[] = [];
  const awinToken = process.env.AWIN_API_TOKEN;

  if (awinToken && process.env.AWIN_MERCHANT_ID_DOUGLAS) {
    const merchantId = process.env.AWIN_MERCHANT_ID_DOUGLAS;
    configs.push({
      fuente: "awin_douglas",
      nombreVisible: "Douglas",
      fetchFeed: () => fetchAwinFeed(merchantId, awinToken),
    });
  }

  if (awinToken && process.env.AWIN_MERCHANT_ID_PRIMOR) {
    const merchantId = process.env.AWIN_MERCHANT_ID_PRIMOR;
    configs.push({
      fuente: "awin_primor",
      nombreVisible: "Primor",
      fetchFeed: () => fetchAwinFeed(merchantId, awinToken),
    });
  }

  return configs;
}

export async function runPriceSync() {
  const configs = buildFeedConfigs();
  if (configs.length === 0) {
    console.log("Sync de precios: sin retailers configurados (faltan credenciales de Awin).");
    return [];
  }

  const results = [];
  for (const config of configs) {
    try {
      results.push(await syncRetailerFeed(config));
    } catch (err) {
      console.error(`Error en sync de ${config.nombreVisible}:`, err);
    }
  }
  return results;
}

export function startPriceSyncCron() {
  if (buildFeedConfigs().length === 0) {
    console.log("Sync de precios: cron no registrado (sin credenciales de retailers configuradas).");
    return;
  }

  // 06:00 todos los días — los precios de perfumería no cambian
  // minuto a minuto, un sync diario alcanza (ver ESTADO-aromia.md,
  // recomendación de frecuencia de la Tarea 2).
  cron.schedule("0 6 * * *", () => {
    runPriceSync().then((results) => console.log("Sync de precios completo:", results));
  });

  console.log("Sync de precios: cron diario registrado (06:00).");
}
