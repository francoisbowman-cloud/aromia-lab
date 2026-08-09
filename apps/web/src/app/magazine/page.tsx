import type { Metadata } from "next";
import { getArticulos } from "@/lib/api";
import { MagazineHub } from "@/components/magazine/MagazineHub";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Magazine de perfumería",
  description: "Reseñas, guías, cultura y análisis de perfumes con una mirada editorial.",
  alternates: { canonical: "/magazine" },
};

export default async function MagazinePage() {
  const articulos = await getArticulos();
  const articulosSinAcademia = articulos.filter((a) => a.categoria !== "academia");
  return <main><MagazineHub articulos={articulosSinAcademia} /></main>;
}
