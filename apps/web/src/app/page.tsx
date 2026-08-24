import { getArticulos, getPerfumes } from "@/lib/api";
import { CATEGORIAS_PRINCIPALES } from "@/lib/olfactiveCategories";
import { AromiaHome2026 } from "@/components/home/AromiaHome2026";

export const dynamic = "force-dynamic";

const MOCKUP_PRIORITY = ["tobacco vanille", "santal 33", "naxos"];

export default async function Home() {
  const [perfumes, articulos] = await Promise.all([getPerfumes(), getArticulos()]);
  const priority = (name: string) => {
    const normalized = name.trim().toLowerCase();
    const index = MOCKUP_PRIORITY.findIndex((item) => normalized.includes(item));
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };
  const perfumesOrdenados = [...perfumes].sort((a, b) => {
    const delta = priority(a.nombre) - priority(b.nombre);
    if (delta !== 0) return delta;
    return Number(Boolean(b.imagen_url)) - Number(Boolean(a.imagen_url));
  });
  const familias = new Set(perfumes.map((perfume) => perfume.familia_olfativa).filter((familia): familia is string => Boolean(familia)));
  const categorias = CATEGORIAS_PRINCIPALES.filter((categoria) => categoria.familias.some((familia) => familias.has(familia)));
  const articulosOrdenados = [...articulos].sort((a, b) => (a.publicado_en < b.publicado_en ? 1 : -1));

  return <AromiaHome2026 perfumes={perfumesOrdenados} articulos={articulosOrdenados} categorias={categorias} />;
}
