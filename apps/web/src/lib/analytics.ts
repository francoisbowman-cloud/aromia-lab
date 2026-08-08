declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Envía un evento a GA4 si gtag está disponible (NEXT_PUBLIC_GA_ID seteado
 * y el script de GoogleAnalytics.tsx ya cargó). No falla si no lo está —
 * dev local sin GA_ID, SSR, o el script todavía no terminó de cargar son
 * casos normales, no errores.
 */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
