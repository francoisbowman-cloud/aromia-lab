import { getArticulos, getPerfumes } from "@/lib/api";
import { CATEGORIAS_PRINCIPALES } from "@/lib/olfactiveCategories";
import { AromiaHome2026 } from "@/components/home/AromiaHome2026";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [perfumes, articulos] = await Promise.all([getPerfumes(), getArticulos()]);
  const familias = new Set(perfumes.map((perfume) => perfume.familia_olfativa).filter((familia): familia is string => Boolean(familia)));
  const categorias = CATEGORIAS_PRINCIPALES.filter((categoria) => categoria.familias.some((familia) => familias.has(familia)));
  const articulosOrdenados = [...articulos].sort((a, b) => (a.publicado_en < b.publicado_en ? 1 : -1));

  return <AromiaHome2026 perfumes={perfumes} articulos={articulosOrdenados} categorias={categorias} />;
}
