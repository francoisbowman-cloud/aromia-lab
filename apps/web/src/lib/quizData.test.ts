import { describe, expect, it } from "vitest";
import {
  QUIZ_QUESTIONS,
  QUIZ_TAGS,
  QUIZ_PROFILES,
  getDominantTag,
  getProfileBySlug,
  getRecommendationsForProfile,
  type QuizTag,
} from "./quizData";
import type { Perfume } from "./types";

describe("getDominantTag", () => {
  it("elige el tag con mayor puntaje", () => {
    expect(getDominantTag({ floral: 3, citrico_fresco: 5 })).toBe("citrico_fresco");
  });

  it("en empate, gana el que aparece primero en QUIZ_TAGS", () => {
    // citrico_fresco aparece antes que floral en QUIZ_TAGS
    expect(getDominantTag({ floral: 4, citrico_fresco: 4 })).toBe("citrico_fresco");
  });

  it("con scores vacíos, devuelve el primer tag de QUIZ_TAGS", () => {
    expect(getDominantTag({})).toBe(QUIZ_TAGS[0]);
  });

  it("ignora tags con puntaje 0 frente a cualquier puntaje positivo", () => {
    expect(getDominantTag({ citrico_fresco: 0, nicho_statement: 1 })).toBe("nicho_statement");
  });
});

describe("getProfileBySlug", () => {
  it("encuentra un perfil por slug real", () => {
    expect(getProfileBySlug("fresco-clasico")?.tag).toBe("citrico_fresco");
  });

  it("devuelve undefined para un slug que no existe", () => {
    expect(getProfileBySlug("no-existe")).toBeUndefined();
  });
});

describe("integridad de QUIZ_QUESTIONS / QUIZ_PROFILES", () => {
  it("cada pregunta tiene 3 o 4 opciones", () => {
    for (const q of QUIZ_QUESTIONS) {
      expect(q.opciones.length).toBeGreaterThanOrEqual(3);
      expect(q.opciones.length).toBeLessThanOrEqual(4);
    }
  });

  it("todos los tags usados en `puntos` existen en QUIZ_TAGS (detecta typos)", () => {
    const validTags = new Set(QUIZ_TAGS);
    for (const q of QUIZ_QUESTIONS) {
      for (const opcion of q.opciones) {
        for (const tag of Object.keys(opcion.puntos) as QuizTag[]) {
          expect(validTags.has(tag)).toBe(true);
        }
      }
    }
  });

  it("hay exactamente un QuizProfile por cada QuizTag, sin duplicados", () => {
    const tags = QUIZ_PROFILES.map((p) => p.tag);
    expect(new Set(tags).size).toBe(QUIZ_TAGS.length);
    for (const tag of QUIZ_TAGS) {
      expect(tags).toContain(tag);
    }
  });

  it("todos los slugs de perfil son únicos", () => {
    const slugs = QUIZ_PROFILES.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

function makePerfume(overrides: Partial<Perfume>): Perfume {
  return {
    id: 1,
    slug: "test",
    nombre: "Test",
    marca: "Marca",
    genero: "unisex",
    familia_olfativa: "citrico fresco",
    precio_referencia: 100,
    moneda: "USD",
    categoria_precio: "medio",
    imagen_url: "https://example.com/x.jpg",
    link_afiliado: "https://example.com/x",
    ...overrides,
  };
}

describe("getRecommendationsForProfile", () => {
  const perfilFresco = getProfileBySlug("fresco-clasico")!;
  const perfilNicho = getProfileBySlug("statement-de-nicho")!;

  it("filtra por familia_olfativa cuando el perfil declara familias", () => {
    const perfumes = [
      makePerfume({ slug: "a", familia_olfativa: "citrico fresco", precio_referencia: 50 }),
      makePerfume({ slug: "b", familia_olfativa: "oriental especiado", precio_referencia: 200 }),
    ];
    const { aspiracionales, accesibles } = getRecommendationsForProfile(perfilFresco, perfumes);
    const todos = [...aspiracionales, ...accesibles];
    expect(todos.every((p) => p.slug !== "b")).toBe(true);
    expect(todos.some((p) => p.slug === "a")).toBe(true);
  });

  it("filtra por nicho_o_comercial cuando el perfil lo exige", () => {
    const perfumes = [
      makePerfume({ slug: "nicho1", nicho_o_comercial: "nicho", precio_referencia: 300 }),
      makePerfume({ slug: "comercial1", nicho_o_comercial: "comercial", precio_referencia: 300 }),
    ];
    const { aspiracionales, accesibles } = getRecommendationsForProfile(perfilNicho, perfumes);
    const todos = [...aspiracionales, ...accesibles];
    expect(todos.every((p) => p.slug !== "comercial1")).toBe(true);
  });

  it("aspiracionales son los más caros y accesibles los más baratos, sin superponerse", () => {
    const perfumes = [10, 20, 30, 40, 50, 60].map((precio, i) =>
      makePerfume({ slug: `p${i}`, precio_referencia: precio }),
    );
    const { aspiracionales, accesibles } = getRecommendationsForProfile(perfilFresco, perfumes);

    expect(aspiracionales.map((p) => p.precio_referencia)).toEqual([60, 50, 40]);
    expect(accesibles.map((p) => p.precio_referencia)).toEqual([10, 20, 30]);

    const aspiracionalSlugs = new Set(aspiracionales.map((p) => p.slug));
    expect(accesibles.some((p) => aspiracionalSlugs.has(p.slug))).toBe(false);
  });

  it("con menos de 6 perfumes coincidentes, no repite el mismo perfume en ambas listas", () => {
    const perfumes = [10, 20, 30].map((precio, i) =>
      makePerfume({ slug: `p${i}`, precio_referencia: precio }),
    );
    const { aspiracionales, accesibles } = getRecommendationsForProfile(perfilFresco, perfumes);
    const aspiracionalSlugs = new Set(aspiracionales.map((p) => p.slug));
    expect(accesibles.every((p) => !aspiracionalSlugs.has(p.slug))).toBe(true);
  });

  it("con cero perfumes coincidentes, devuelve listas vacías sin explotar", () => {
    const { aspiracionales, accesibles } = getRecommendationsForProfile(perfilNicho, []);
    expect(aspiracionales).toEqual([]);
    expect(accesibles).toEqual([]);
  });
});
