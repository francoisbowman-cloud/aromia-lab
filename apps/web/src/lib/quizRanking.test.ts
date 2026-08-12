import { describe, expect, it } from "vitest";
import type { Perfume } from "./types";
import type { QuizProfile } from "./quizData";
import { rankPerfumesForProfile } from "./quizRanking";

const profile: QuizProfile = { tag: "amaderado_seco", slug: "amaderado-silencioso", emoji: "🌲", titulo: "Amaderado", descripcion: "", familias: ["amaderado"], nichoFiltro: null };
const perfume = (slug: string, family: string, rating = 4): Perfume => ({ id: slug.length, slug, nombre: slug, marca: "Casa", genero: "unisex", familia_olfativa: family, precio_referencia: 100, moneda: "USD", categoria_precio: "premium", imagen_url: null, link_afiliado: null, rating_promedio: rating });

describe("quiz catalog ranking", () => {
  it("prioritizes a matching family", () => {
    const ranked = rankPerfumesForProfile(profile, [perfume("floral", "floral", 5), perfume("wood", "amaderado", 3)]);
    expect(ranked[0]?.perfume.slug).toBe("wood");
  });
  it("respects the requested limit", () => expect(rankPerfumesForProfile(profile, [perfume("a", "amaderado"), perfume("b", "amaderado")], 1)).toHaveLength(1));
});
