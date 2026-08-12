import { describe, expect, it } from "vitest";
import type { Perfume } from "./types";
import { discoveryTextScore, getSimilarPerfumes, similarityScore } from "./discovery";

const base: Perfume = { id: 1, slug: "base", nombre: "Base", marca: "Casa", genero: "unisex", familia_olfativa: "amaderado", notas_salida: ["bergamota"], notas_corazon: ["cedro"], notas_fondo: ["vetiver"], ocasion: ["oficina"], temporada_recomendada: ["otoño"], precio_referencia: 100, moneda: "USD", categoria_precio: "premium", imagen_url: null, link_afiliado: null, nicho_o_comercial: "nicho" };
const close: Perfume = { ...base, id: 2, slug: "close", nombre: "Close", notas_fondo: ["vetiver", "almizcle"] };
const far: Perfume = { ...base, id: 3, slug: "far", nombre: "Far", familia_olfativa: "floral", notas_salida: ["rosa"], notas_corazon: ["jazmín"], notas_fondo: ["vainilla"], ocasion: ["fiesta"] };

describe("discovery engine", () => {
  it("scores olfactive proximity above generic compatibility", () => expect(similarityScore(base, close).score).toBeGreaterThan(similarityScore(base, far).score));
  it("excludes the source and ranks deterministically", () => expect(getSimilarPerfumes(base, [far, base, close])[0]?.perfume.slug).toBe("close"));
  it("finds brand, family and note terms", () => {
    expect(discoveryTextScore(base, "Casa")).toBeGreaterThan(0);
    expect(discoveryTextScore(base, "amaderado")).toBeGreaterThan(0);
    expect(discoveryTextScore(base, "vetiver")).toBeGreaterThan(0);
  });
});
