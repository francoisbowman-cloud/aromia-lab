import type { Metadata } from "next";
import { getArticulos } from "@/lib/api";
import { buildEditorialIndex } from "@/lib/editorialIndex";
import { EditorialArchive } from "@/components/magazine/EditorialArchive";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Historias — Archivo Aromia",
  description: "Archivo de historias, materias, personas, guías y reflexiones publicadas en Aromia.",
  alternates: { canonical: "/magazine" },
};

export default async function MagazinePage() {
  const articulos = await getArticulos();
  const items = buildEditorialIndex(articulos);
  return <main><EditorialArchive items={items} /></main>;
}
