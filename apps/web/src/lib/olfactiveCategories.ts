/**
 * Agrupa las ~27 combinaciones reales de `familia_olfativa` en categorías
 * principales — usado tanto por los accesos rápidos del Catálogo (decisión
 * #90 de ESTADO-aromia.md) como por los tiles "Explora por notas" de Home.
 * Compartido en un solo lugar para no duplicar el mapeo entre ambos.
 */
export const CATEGORIAS_PRINCIPALES: { label: string; familias: string[]; gradient: string }[] = [
  {
    label: "Floral",
    familias: [
      "floral",
      "floral afrutado",
      "floral afrutado gourmand",
      "floral almizclado",
      "floral amaderado",
      "floral aromatico",
      "floral chipre",
      "floral oriental",
    ],
    gradient: "linear-gradient(160deg,#f2d9df,#c98fa0)",
  },
  {
    label: "Amaderados",
    familias: [
      "amaderado",
      "amaderado acuatico",
      "amaderado aromatico",
      "amaderado especiado",
      "almizclado amaderado",
    ],
    gradient: "linear-gradient(160deg,#cdb89a,#6e5638)",
  },
  {
    label: "Cítricos",
    familias: ["afrutado citrico", "citrico fresco"],
    gradient: "linear-gradient(160deg,#f4e4a1,#c9a227)",
  },
  {
    label: "Acuáticos",
    familias: ["acuatico aromatico"],
    gradient: "linear-gradient(160deg,#cfe8e6,#4f8f8a)",
  },
  {
    label: "Afrutados",
    familias: ["afrutado amaderado", "afrutado verde", "aromatico afrutado"],
    gradient: "linear-gradient(160deg,#f2c9a1,#c96a3f)",
  },
  {
    label: "Fougère",
    familias: ["aromatico fougere"],
    gradient: "linear-gradient(160deg,#d8e4c4,#6f8f4f)",
  },
  {
    label: "Frescos",
    familias: ["aromatico fresco"],
    gradient: "linear-gradient(160deg,#dbeaf0,#5f8ca3)",
  },
  {
    label: "Árabes",
    familias: [
      "ambarado especiado",
      "ambarado floral",
      "oriental especiado",
      "oriental gourmand",
      "almizclado mineral",
    ],
    gradient: "linear-gradient(160deg,#e8c48a,#7a3d1f)",
  },
];

export function categoriaDe(familiaOlfativa: string): string | null {
  const encontrada = CATEGORIAS_PRINCIPALES.find((c) => c.familias.includes(familiaOlfativa));
  return encontrada?.label ?? null;
}
