import type { Perfume } from "./types";

export interface OlfactiveSubfamily {
  name: string;
  /** How this subfamily departs from the parent family. */
  note: string;
}

export interface OlfactiveFamily {
  slug: string;
  name: string;
  /** "A qué huele" — plain language, no perfume-specific claims. */
  smellsLike: string;
  /** Materias frecuentes. */
  materials: string[];
  subfamilies: OlfactiveSubfamily[];
  /** Sensación / carácter. */
  character: string[];
  context: {
    clima: string;
    momento: string;
    presencia: string;
  };
  /** Substrings matched, case-insensitively, against a perfume's familia_olfativa. */
  matchKeywords: string[];
  /** Curated editorial stories (existing slugs) that genuinely discuss this family. */
  storySlugs: string[];
}

export const OLFACTIVE_FAMILIES: OlfactiveFamily[] = [
  {
    slug: "citrica",
    name: "Cítrica",
    smellsLike:
      "Luminosa, limpia, vibrante. Recuerda a cáscara recién cortada, hojas verdes y aire fresco; es la familia que más rápido se percibe y también la que antes se disipa.",
    materials: ["bergamota", "limón", "mandarina", "petitgrain", "neroli", "pomelo"],
    subfamilies: [
      { name: "Cítrica aromática", note: "suma hierbas y especias secas que alargan la salida." },
      { name: "Cítrica floral", note: "apoya el cítrico en flores blancas para darle cuerpo." },
      { name: "Cítrica amaderada", note: "cierra con maderas secas para ganar persistencia." },
    ],
    character: ["fresca", "luminosa", "seca", "energética", "elegante"],
    context: {
      clima: "calor y humedad; pierde presencia en frío",
      momento: "mañana y primeras horas",
      presencia: "cercana y breve, pide reaplicación",
    },
    matchKeywords: ["citric", "cítric", "citrus"],
    storySlugs: [],
  },
  {
    slug: "floral",
    name: "Floral",
    smellsLike:
      "El corazón histórico de la perfumería. Va de perfiles transparentes y acuosos a composiciones densas y cremosas, según qué flor domine y cuánto se concentre.",
    materials: ["rosa", "jazmín", "ylang-ylang", "tuberosa", "flor de azahar", "iris"],
    subfamilies: [
      { name: "Floral verde", note: "añade tallo y hoja aplastada; menos dulce, más nítido." },
      { name: "Floral afrutado", note: "combina la flor con fruta madura; más redondo y accesible." },
      { name: "Floral amaderado almizclado", note: "asienta la flor sobre un fondo de piel y madera." },
    ],
    character: ["delicada", "opulenta", "romántica", "textural", "reconocible"],
    context: {
      clima: "templado; el calor amplifica las flores blancas",
      momento: "tarde y noche",
      presencia: "de media a alta según la flor",
    },
    matchKeywords: ["floral", "flower", "rose", "jasmin", "jazmín"],
    storySlugs: ["el-perfumista-que-no-teme-exagerar"],
  },
  {
    slug: "amaderada",
    name: "Amaderada",
    smellsLike:
      "Seca, cálida y estructural. Es el esqueleto de muchas fragancias: aporta textura de corteza, lápiz y serrería, y sostiene el resto de la composición sobre la piel.",
    materials: ["sándalo", "cedro", "vetiver", "pachulí", "guayaco", "ambroxan"],
    subfamilies: [
      { name: "Amaderada aromática", note: "cruza la madera con lavanda y hierbas; más fresca en salida." },
      { name: "Amaderada especiada", note: "suma pimienta y cardamomo; añade calor y tensión." },
      { name: "Amaderada almizclada", note: "difumina la madera con almizcles; efecto de piel limpia." },
    ],
    character: ["seca", "cálida", "sobria", "envolvente", "persistente"],
    context: {
      clima: "frío y entretiempo",
      momento: "tarde, noche, oficina",
      presencia: "de media a alta, muy duradera",
    },
    matchKeywords: ["amaderad", "woody", "wood", "sandal", "cedar", "vetiver"],
    storySlugs: ["el-ambar-que-nunca-toco-una-ballena", "el-perfume-que-encargo-un-sultan"],
  },
  {
    slug: "ambar-oriental",
    name: "Ámbar / Oriental",
    smellsLike:
      "Calidez densa y envolvente, con un fondo dulce-balsámico. Resinas, vainilla y especias que dejan una estela reconocible y persistente.",
    materials: ["vainilla", "benjuí", "labdanum", "incienso", "haba tonka", "ámbar gris"],
    subfamilies: [
      { name: "Ámbar especiado", note: "clavo, canela y pimienta sobre la base dulce; más picante." },
      { name: "Ámbar floral", note: "una flor opulenta ilumina la resina; menos pesado." },
      { name: "Ámbar gourmand", note: "vira a notas comestibles: cacao, caramelo, licor." },
    ],
    character: ["cálida", "densa", "dulce", "sensual", "expansiva"],
    context: {
      clima: "frío; el calor la vuelve empalagosa",
      momento: "noche, invierno, ocasión",
      presencia: "alta y de larga duración",
    },
    matchKeywords: ["oriental", "ambarad", "ambery", "amber", "vainilla", "vanilla"],
    storySlugs: ["el-ambar-que-nunca-toco-una-ballena", "el-perfume-que-encargo-un-sultan"],
  },
  {
    slug: "chipre",
    name: "Chipre",
    smellsLike:
      "Un contraste construido: luz cítrica arriba, fondo terroso y amargo abajo. Musgo de roble, labdanum y pachulí sobre una apertura de bergamota.",
    materials: ["bergamota", "musgo de roble", "labdanum", "pachulí", "jara", "cuero"],
    subfamilies: [
      { name: "Chipre floral", note: "una flor de corazón suaviza el amargor del musgo." },
      { name: "Chipre afrutado", note: "melocotón o ciruela redondean el contraste; más moderno." },
      { name: "Chipre de cuero", note: "acentúa el fondo animal y ahumado." },
    ],
    character: ["elegante", "amarga", "seca", "sofisticada", "vintage"],
    context: {
      clima: "entretiempo y frío suave",
      momento: "tarde y noche",
      presencia: "media-alta, muy característica",
    },
    matchKeywords: ["chipre", "chypre"],
    storySlugs: [],
  },
  {
    slug: "fougere",
    name: "Fougère",
    smellsLike:
      "El acorde que definió la perfumería masculina moderna: lavanda, cumarina y musgo. Una frescura aromática limpia sobre un fondo de heno y madera.",
    materials: ["lavanda", "cumarina", "musgo de roble", "geranio", "haba tonka", "roble"],
    subfamilies: [
      { name: "Fougère aromática", note: "refuerza hierbas y menta; más verde y afeitado." },
      { name: "Fougère ambarada", note: "endulza y calienta el fondo; más nocturna." },
      { name: "Fougère especiada", note: "canela y clavo tensan el acorde clásico." },
    ],
    character: ["limpia", "clásica", "seca", "fresca", "familiar"],
    context: {
      clima: "todo el año, mejor en templado",
      momento: "día y oficina",
      presencia: "media, discreta",
    },
    matchKeywords: ["fougere", "fougère", "fern"],
    storySlugs: [],
  },
  {
    slug: "aromatica",
    name: "Aromática",
    smellsLike:
      "Hierbas de cocina y de monte: tomillo, romero, salvia, menta, albahaca. Verde, seca y algo medicinal; suele acompañar a cítricos o maderas más que ir sola.",
    materials: ["romero", "salvia", "tomillo", "menta", "albahaca", "artemisa"],
    subfamilies: [
      { name: "Aromática fresca", note: "empuja los cítricos y lo mentolado; efecto casi frío." },
      { name: "Aromática amaderada", note: "asienta las hierbas sobre cedro y vetiver." },
      { name: "Aromática especiada", note: "pimienta y comino le dan calor y cuerpo." },
    ],
    character: ["verde", "seca", "vigorosa", "sobria", "masculina por tradición"],
    context: {
      clima: "calor y entretiempo",
      momento: "día, deporte, mañana",
      presencia: "media, fresca",
    },
    matchKeywords: ["aromatic", "aromátic", "aromatico", "herbal", "verde", "green"],
    storySlugs: [],
  },
  {
    slug: "gourmand",
    name: "Gourmand",
    smellsLike:
      "Notas comestibles llevadas a perfume: vainilla, caramelo, cacao, praliné, café, azúcar quemado. Puede ser goloso y cercano o casi salado según cómo se trabaje.",
    materials: ["vainilla", "haba tonka", "cacao", "caramelo", "café", "praliné"],
    subfamilies: [
      { name: "Gourmand floral", note: "una flor evita que el dulce se vuelva plano." },
      { name: "Gourmand amaderado", note: "madera y patchouli le dan estructura y lo secan." },
      { name: "Gourmand salado", note: "notas lácteas o de avellana tostada con un giro salino." },
    ],
    character: ["dulce", "cálida", "envolvente", "adictiva", "juvenil"],
    context: {
      clima: "frío; el calor lo satura",
      momento: "noche e invierno",
      presencia: "alta y pegajosa a la ropa",
    },
    matchKeywords: ["gourmand", "vanilla", "vainilla", "caramel", "cacao", "chocolate"],
    storySlugs: [],
  },
  {
    slug: "acuatica",
    name: "Acuática",
    smellsLike:
      "Aire de mar, roca mojada, brisa y melón de agua. Un efecto de limpieza y espacio que nace sobre todo de moléculas de síntesis (calone y derivados).",
    materials: ["notas marinas", "sal", "algas", "melón", "loto", "calone"],
    subfamilies: [
      { name: "Acuática aromática", note: "hierbas y cítricos sobre la nota marina; más nítida." },
      { name: "Acuática amaderada", note: "madera flotada y almizcle; más cuerpo y duración." },
      { name: "Acuática floral", note: "una flor acuosa (loto, nenúfar) suaviza la sal." },
    ],
    character: ["fresca", "limpia", "abierta", "ligera", "contemporánea"],
    context: {
      clima: "calor y humedad",
      momento: "día y verano",
      presencia: "media, transparente",
    },
    matchKeywords: ["acuatic", "acuátic", "aquatic", "marin", "marine", "ozonic", "ozónic"],
    storySlugs: [],
  },
  {
    slug: "cuero",
    name: "Cuero",
    smellsLike:
      "El olor de la piel curtida: ahumado, seco, a veces con un fondo animal o floral. Nace de materiales como el abedul, la jara y notas de tabaco.",
    materials: ["abedul", "labdanum", "azafrán", "tabaco", "castóreo", "isobutil quinoleína"],
    subfamilies: [
      { name: "Cuero floral", note: "violeta o jazmín amortiguan el ahumado; el cuero clásico." },
      { name: "Cuero seco / ahumado", note: "abedul y birch tar al frente; áspero y de humo." },
      { name: "Cuero suede", note: "efecto ante: más aterciopelado, dulce y sin humo." },
    ],
    character: ["seca", "ahumada", "animal", "sobria", "distintiva"],
    context: {
      clima: "frío y entretiempo",
      momento: "noche, invierno",
      presencia: "de media a alta, muy identificable",
    },
    matchKeywords: ["cuero", "leather", "cuir", "suede"],
    storySlugs: [],
  },
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function familyBySlug(slug: string): OlfactiveFamily | null {
  return OLFACTIVE_FAMILIES.find((family) => family.slug === slug) ?? null;
}

/** Does an arbitrary text (a signature, a familia_olfativa value) belong to this family? */
export function familyMatchesText(family: OlfactiveFamily, text: string | null | undefined): boolean {
  if (!text) return false;
  const haystack = normalize(text);
  return family.matchKeywords.map(normalize).some((key) => haystack.includes(key));
}

/** Perfumes whose free-text familia_olfativa contains one of the family keywords. */
export function perfumesForFamily(family: OlfactiveFamily, perfumes: Perfume[]): Perfume[] {
  const keys = family.matchKeywords.map(normalize);
  return perfumes.filter((perfume) => {
    if (!perfume.familia_olfativa) return false;
    const haystack = normalize(perfume.familia_olfativa);
    return keys.some((key) => haystack.includes(key));
  });
}

/** Best-effort: which canonical families a single free-text value maps to. */
export function familiesForValue(value: string | null): OlfactiveFamily[] {
  if (!value) return [];
  const haystack = normalize(value);
  return OLFACTIVE_FAMILIES.filter((family) =>
    family.matchKeywords.map(normalize).some((key) => haystack.includes(key)),
  );
}
