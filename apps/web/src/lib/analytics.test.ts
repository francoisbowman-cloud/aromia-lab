import { afterEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "./analytics";

// Entorno de test es "node" (sin DOM) — no hay `window` global hasta que lo
// stubeamos explícitamente con vi.stubGlobal, que es justo el escenario real
// que trackEvent tiene que manejar sin explotar (SSR).
describe("trackEvent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("no lanza cuando no hay `window` (SSR / entorno sin DOM)", () => {
    expect(() => trackEvent("affiliate_click", { retailer: "Amazon" })).not.toThrow();
  });

  it("no lanza cuando `window` existe pero gtag no está definido (sin GA_ID)", () => {
    vi.stubGlobal("window", {});
    expect(() => trackEvent("affiliate_click")).not.toThrow();
  });

  it("llama a window.gtag con 'event', el nombre y los params cuando gtag existe", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    trackEvent("newsletter_signup", { fuente: "home" });

    expect(gtag).toHaveBeenCalledWith("event", "newsletter_signup", { fuente: "home" });
  });

  it("funciona sin params", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    trackEvent("quiz_completed");

    expect(gtag).toHaveBeenCalledWith("event", "quiz_completed", undefined);
  });
});
