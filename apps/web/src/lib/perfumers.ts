export interface PerfumerProfile {
  slug: string;
  name: string;
  era: string;
  signature: string;
  bio: string;
  perfumeSlugs: string[];
  /** Path to a reviewed portrait photograph under /public, when one exists. */
  portrait?: string;
  /** Visible credit line for `portrait`. Required whenever `portrait` is set. */
  portraitCredit?: string;
  /** Full provenance (source page + license) for `portrait`, kept for the record. */
  portraitProvenance?: string;
}

/**
 * Editorial attribution index. Every relationship here is intentionally explicit:
 * we prefer an incomplete, reviewed index over inferring a perfumer from brand,
 * style or launch year. Perfumes without a verified attribution simply omit it.
 */
export const PERFUMERS: PerfumerProfile[] = [
  {
    slug: "francis-kurkdjian",
    name: "Francis Kurkdjian",
    era: "Contemporáneo",
    signature: "transparencia · volumen · contraste",
    bio: "Una escritura de gran claridad técnica que puede pasar de estructuras luminosas a densidades ambaradas sin perder precisión.",
    perfumeSlugs: ["baccarat-rouge-540", "grand-soir", "gentle-fluidity-silver", "gentle-fluidity-gold", "for-her-edp", "burberry-her-edp"],
  },
  {
    slug: "jacques-polge",
    name: "Jacques Polge",
    era: "Moderno",
    signature: "floral · elegante · textural",
    bio: "Figura central de la perfumería francesa moderna, con una obra reconocible por su equilibrio entre estructura clásica y tactilidad contemporánea.",
    perfumeSlugs: ["bleu-de-chanel-edt", "bleu-de-chanel-edp", "chance-eau-tendre", "allure-homme-sport"],
  },
  {
    slug: "olivier-polge",
    name: "Olivier Polge",
    era: "Contemporáneo",
    signature: "pulido · especiado · arquitectónico",
    bio: "Trabaja la materia con una construcción nítida y moderna, frecuentemente apoyada en contrastes entre frescura, especias y fondos envolventes.",
    perfumeSlugs: ["spicebomb-edt", "invictus-edt", "la-vie-est-belle"],
  },
  {
    slug: "dominique-ropion",
    name: "Dominique Ropion",
    era: "Contemporáneo",
    signature: "floral · intensidad · precisión",
    bio: "Conocido por fórmulas de gran presencia y una lectura muy controlada de flores, maderas y contrastes de alta proyección.",
    perfumeSlugs: ["linterdit-edp", "invictus-edt", "la-vie-est-belle", "portrait-of-a-lady"],
  },
  {
    slug: "anne-flipo",
    name: "Anne Flipo",
    era: "Contemporáneo",
    signature: "luz · flores · sensualidad",
    bio: "Su trabajo combina luminosidad y textura, desde florales radiantes hasta composiciones de mayor densidad sensual.",
    perfumeSlugs: ["linterdit-edp", "invictus-edt", "la-vie-est-belle"],
  },
  {
    slug: "quentin-bisch",
    name: "Quentin Bisch",
    era: "Contemporáneo",
    signature: "impacto · flores · contraste",
    bio: "Una firma de alto impacto que suele amplificar materias reconocibles hasta convertirlas en gestos olfativos muy definidos.",
    perfumeSlugs: ["delina", "delina-exclusif", "le-male-elixir", "hibiscus-mahajad"],
  },
  {
    slug: "alberto-morillas",
    name: "Alberto Morillas",
    era: "Moderno / contemporáneo",
    signature: "aire · limpieza · difusión",
    bio: "Maestro de la difusión y la sensación de espacio, con un repertorio que abarca frescos transparentes, florales y maderas pulidas.",
    perfumeSlugs: ["daisy-edt", "acqua-di-gio-edt", "flower-by-kenzo"],
    portrait: "/personas/alberto-morillas.jpg",
    portraitCredit: "Foto: Mizensir, vía Wikimedia Commons (CC BY-SA 4.0).",
    portraitProvenance:
      "https://commons.wikimedia.org/wiki/File:Alberto_Morillas.jpg — autor: Mizensir — CC BY-SA 4.0",
  },
  {
    slug: "olivier-cresp",
    name: "Olivier Cresp",
    era: "Moderno / contemporáneo",
    signature: "gourmand · contraste · legibilidad",
    bio: "Su lenguaje combina ideas inmediatamente legibles con estructuras refinadas, y ha sido decisivo en la evolución del gourmand moderno.",
    perfumeSlugs: ["light-blue-edt", "black-opium-edp", "wanted-edt"],
  },
  {
    slug: "nathalie-lorson",
    name: "Nathalie Lorson",
    era: "Contemporáneo",
    signature: "madera · suavidad · profundidad",
    bio: "Una perfumería de contrastes suaves y fondos trabajados, donde maderas y texturas oscuras pueden convivir con aperturas muy accesibles.",
    perfumeSlugs: ["black-opium-edp", "encre-noire-edt"],
  },
  {
    slug: "frank-voelkl",
    name: "Frank Voelkl",
    era: "Contemporáneo",
    signature: "madera · piel · minimalismo",
    bio: "Asociado a composiciones de gran identidad material, con una sensibilidad contemporánea hacia maderas, almizcles y efectos de piel.",
    perfumeSlugs: ["santal-33-edp"],
  },
  {
    slug: "christine-nagel",
    name: "Christine Nagel",
    era: "Contemporáneo",
    signature: "materia · contraste · intimidad",
    bio: "Su obra explora la materia con una mirada táctil y narrativa, construyendo tensión entre ingredientes familiares y giros inesperados.",
    perfumeSlugs: ["for-her-edp", "h24-edt", "h24-edp"],
    portrait: "/personas/christine-nagel.jpg",
    portraitCredit: "Foto: Comparfums1, vía Wikimedia Commons (CC BY-SA 4.0).",
    portraitProvenance:
      "https://commons.wikimedia.org/wiki/File:Christine_Nagel.jpg — autor: Comparfums1 — CC BY-SA 4.0",
  },
  {
    slug: "alessandro-gualtieri",
    name: "Alessandro Gualtieri",
    era: "Contemporáneo experimental",
    signature: "materia · oscuridad · exceso controlado",
    bio: "Una aproximación radicalmente material y experimental, asociada a composiciones densas, táctiles y deliberadamente difíciles de reducir a una pirámide convencional.",
    perfumeSlugs: ["black-afgano"],
  },
];

export function perfumersForPerfume(slug: string) {
  return PERFUMERS.filter((perfumer) => perfumer.perfumeSlugs.includes(slug));
}

export function getPerfumerProfile(slug: string) {
  return PERFUMERS.find((perfumer) => perfumer.slug === slug) ?? null;
}
