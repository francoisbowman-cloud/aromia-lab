import type { Perfume } from "./types";

export type QuizTag =
  | "citrico_fresco"
  | "floral"
  | "gourmand_dulce"
  | "amaderado_seco"
  | "oriental_especiado"
  | "nicho_statement"
  | "clasico_comercial";

export interface QuizOption {
  letra: string;
  texto: string;
  puntos: Partial<Record<QuizTag, number>>;
}

export interface QuizQuestion {
  id: number;
  pregunta: string;
  opciones: QuizOption[];
}

export const QUIZ_TAGS: QuizTag[] = [
  "citrico_fresco",
  "floral",
  "gourmand_dulce",
  "amaderado_seco",
  "oriental_especiado",
  "nicho_statement",
  "clasico_comercial",
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    pregunta: "¿Para qué momento estás buscando un perfume?",
    opciones: [
      {
        letra: "A",
        texto: "Uso diario, oficina, algo que no canse",
        puntos: { citrico_fresco: 2, clasico_comercial: 1 },
      },
      {
        letra: "B",
        texto: "Una salida nocturna o un evento especial",
        puntos: { oriental_especiado: 2, nicho_statement: 1 },
      },
      {
        letra: "C",
        texto: "Algo para sentirme cómodo/a en casa o clima frío",
        puntos: { gourmand_dulce: 2 },
      },
      {
        letra: "D",
        texto: "Quiero algo que hable de mí, distinto a lo que usa todo el mundo",
        puntos: { nicho_statement: 2, amaderado_seco: 1 },
      },
    ],
  },
  {
    id: 2,
    pregunta: "Si tuvieras que elegir una textura, ¿cuál te representa más?",
    opciones: [
      { letra: "A", texto: "Fresca y ligera, como recién duchado/a", puntos: { citrico_fresco: 2 } },
      {
        letra: "B",
        texto: "Cálida y envolvente, como una manta",
        puntos: { gourmand_dulce: 2, oriental_especiado: 1 },
      },
      { letra: "C", texto: "Seca y elegante, sin ser dulce", puntos: { amaderado_seco: 2 } },
      { letra: "D", texto: "Delicada y romántica", puntos: { floral: 2 } },
    ],
  },
  {
    id: 3,
    pregunta: "¿Cuál es tu estación favorita del año?",
    opciones: [
      { letra: "A", texto: "Verano", puntos: { citrico_fresco: 2 } },
      { letra: "B", texto: "Otoño/invierno", puntos: { oriental_especiado: 2, gourmand_dulce: 1 } },
      { letra: "C", texto: "Primavera", puntos: { floral: 2 } },
      {
        letra: "D",
        texto: "Me da igual, uso lo mismo todo el año",
        puntos: { amaderado_seco: 1, clasico_comercial: 1 },
      },
    ],
  },
  {
    id: 4,
    pregunta: "Cuando alguien te huele, ¿qué te gustaría que piense?",
    opciones: [
      {
        letra: "A",
        texto: '"Huele genial, pero no sabría decir a qué"',
        puntos: { amaderado_seco: 2, nicho_statement: 1 },
      },
      { letra: "B", texto: '"¿Qué perfume es ese? Nunca lo olí"', puntos: { nicho_statement: 2 } },
      { letra: "C", texto: '"Huele delicioso, como algo rico"', puntos: { gourmand_dulce: 2 } },
      {
        letra: "D",
        texto: '"Huele clásico, elegante, de siempre"',
        puntos: { clasico_comercial: 2, floral: 1 },
      },
    ],
  },
  {
    id: 5,
    pregunta: "¿Qué tan dispuesto/a estás a invertir en un perfume?",
    opciones: [
      {
        letra: "A",
        texto: "Prefiero algo accesible y efectivo",
        puntos: { clasico_comercial: 2, citrico_fresco: 1 },
      },
      {
        letra: "B",
        texto: "Puedo pagar más si vale la pena",
        puntos: { nicho_statement: 1, oriental_especiado: 1 },
      },
      {
        letra: "C",
        texto: "El precio no es el criterio principal, busco algo que me represente",
        puntos: { nicho_statement: 2, amaderado_seco: 1 },
      },
    ],
  },
  {
    id: 6,
    pregunta: "Si tu perfume ideal fuera un color, ¿cuál sería?",
    opciones: [
      { letra: "A", texto: "Blanco o celeste, algo limpio", puntos: { citrico_fresco: 2 } },
      { letra: "B", texto: "Dorado o ámbar, algo cálido", puntos: { oriental_especiado: 2 } },
      { letra: "C", texto: "Rosa o lavanda, algo suave", puntos: { floral: 2 } },
      {
        letra: "D",
        texto: "Marrón o negro, algo profundo",
        puntos: { amaderado_seco: 2, nicho_statement: 1 },
      },
    ],
  },
];

export interface QuizProfile {
  tag: QuizTag;
  slug: string;
  emoji: string;
  titulo: string;
  descripcion: string;
  familias: string[];
  nichoFiltro: "nicho" | "comercial" | null;
}

export const QUIZ_PROFILES: QuizProfile[] = [
  {
    tag: "citrico_fresco",
    slug: "fresco-clasico",
    emoji: "🍋",
    titulo: "Eres Fresco Clásico",
    descripcion:
      "Tu firma olfativa es la frescura que no se impone: cítricos y acuáticos que funcionan en cualquier contexto. Descubre qué perfumes de nuestro catálogo coinciden con tu perfil.",
    familias: ["citrico fresco", "aromatico fresco", "acuatico aromatico"],
    nichoFiltro: null,
  },
  {
    tag: "floral",
    slug: "alma-floral",
    emoji: "🌸",
    titulo: "Eres Alma Floral",
    descripcion:
      "Eliges lo delicado sin perder presencia. Tu perfil olfativo se inclina por ramos florales que suman romanticismo a cualquier ocasión.",
    familias: ["floral", "floral afrutado", "floral amaderado"],
    nichoFiltro: null,
  },
  {
    tag: "gourmand_dulce",
    slug: "gourmand-adictivo",
    emoji: "🍯",
    titulo: "Eres Gourmand Adictivo",
    descripcion:
      "Vainilla, café, praliné: tu perfil busca calidez y dulzura con carácter. Nada de sutilezas tibias — vas directo al placer.",
    familias: ["oriental gourmand", "amaderado gourmand"],
    nichoFiltro: null,
  },
  {
    tag: "amaderado_seco",
    slug: "amaderado-silencioso",
    emoji: "🌲",
    titulo: "Eres Amaderado Silencioso",
    descripcion:
      "Prefieres la elegancia seca antes que el dulzor evidente. Tu perfil olfativo construye presencia sin necesidad de gritarla.",
    familias: ["amaderado", "amaderado aromatico", "amaderado especiado"],
    nichoFiltro: null,
  },
  {
    tag: "oriental_especiado",
    slug: "especiado-nocturno",
    emoji: "🔥",
    titulo: "Eres Especiado Nocturno",
    descripcion:
      "Cálido, envolvente, memorable. Tu perfil olfativo se siente mejor cuando cae el sol y sube la intensidad.",
    familias: ["oriental especiado", "ambarado especiado", "ambarado"],
    nichoFiltro: null,
  },
  {
    tag: "nicho_statement",
    slug: "statement-de-nicho",
    emoji: "💎",
    titulo: "Eres un Statement de Nicho",
    descripcion:
      "No buscas lo que usa todo el mundo. Tu perfil olfativo se define por la originalidad y el descubrimiento, no por la popularidad.",
    familias: [],
    nichoFiltro: "nicho",
  },
  {
    tag: "clasico_comercial",
    slug: "clasico-atemporal",
    emoji: "⏳",
    titulo: "Eres un Clásico Atemporal",
    descripcion:
      "Prefieres lo que ya demostró funcionar. Tu perfil olfativo se apoya en fragancias reconocidas y queridas, sin necesidad de reinventar nada.",
    familias: [],
    nichoFiltro: "comercial",
  },
];

export function getProfileBySlug(slug: string): QuizProfile | undefined {
  return QUIZ_PROFILES.find((p) => p.slug === slug);
}

/** Tag dominante = mayor puntaje; empate se resuelve por orden de aparición en QUIZ_TAGS. */
export function getDominantTag(scores: Partial<Record<QuizTag, number>>): QuizTag {
  let best: QuizTag = QUIZ_TAGS[0];
  let bestScore = -1;
  for (const tag of QUIZ_TAGS) {
    const score = scores[tag] ?? 0;
    if (score > bestScore) {
      bestScore = score;
      best = tag;
    }
  }
  return best;
}

export interface QuizRecommendation {
  aspiracionales: Perfume[];
  accesibles: Perfume[];
}

export function getRecommendationsForProfile(
  profile: QuizProfile,
  perfumes: Perfume[],
): QuizRecommendation {
  const matched = perfumes.filter((p) => {
    if (profile.nichoFiltro && p.nicho_o_comercial !== profile.nichoFiltro) return false;
    if (profile.familias.length > 0 && !profile.familias.includes(p.familia_olfativa)) {
      return false;
    }
    return true;
  });

  const sorted = [...matched].sort(
    (a, b) => Number(b.precio_referencia) - Number(a.precio_referencia),
  );

  const aspiracionales = sorted.slice(0, 3);
  const usedSlugs = new Set(aspiracionales.map((p) => p.slug));
  const accesibles = sorted
    .slice()
    .reverse()
    .filter((p) => !usedSlugs.has(p.slug))
    .slice(0, 3);

  return { aspiracionales, accesibles };
}
