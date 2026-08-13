import { describe, expect, it } from "vitest";
import type { Perfume } from "./types";
import { emptyDiscoveryProfile } from "./discoveryProfile";
import { personalizedPerfumeScore, rankPersonalizedPerfumes } from "./personalization";

function perfume(slug: string, family: string, notes: string[]): Perfume {
  return { id: slug.length, slug, nombre: slug, marca: "Casa", genero: "unisex", familia_olfativa: family, notas_salida: notes, notas_corazon: [], notas_fondo: [], precio_referencia: null, moneda: null, categoria_precio: null, imagen_url: null, link_afiliado: null };
}

describe("personalized discovery", () => {
  it("rewards learned family and note affinities", () => {
    const profile = emptyDiscoveryProfile();
    profile.families.amaderado = 5;
    profile.notes.vetiver = 4;
    const result = personalizedPerfumeScore(perfume("wood", "amaderado", ["vetiver"]), profile);
    expect(result.score).toBeGreaterThan(0);
    expect(result.reasons.join(" ")).toContain("amaderado");
    expect(result.reasons.join(" ")).toContain("vetiver");
  });

  it("deprioritizes repeatedly seen perfumes", () => {
    const profile = emptyDiscoveryProfile();
    profile.families.amaderado = 4;
    profile.perfumes.seen = 8;
    const ranked = rankPersonalizedPerfumes([perfume("seen", "amaderado", []), perfume("fresh", "amaderado", [])], profile);
    expect(ranked[0]?.perfume.slug).toBe("fresh");
  });
});
