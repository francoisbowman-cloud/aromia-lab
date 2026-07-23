import { getArticulos } from "@/lib/api";
import { MagazineHub } from "@/components/magazine/MagazineHub";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Magazine — Aromia",
  description: "Reseñas, guías y análisis de perfumería.",
};

export default async function MagazinePage() {
  const articulos = await getArticulos();
  // El contenido "academia" vive en /academia (absorbido el 22/07) — se
  // filtra acá para que no queden tarjetas duplicadas que solo rebotan
  // al lector a la misma página vía redirect.
  const articulosSinAcademia = articulos.filter((a) => a.categoria !== "academia");

  return (
    <main>
      <MagazineHub articulos={articulosSinAcademia} />
    </main>
  );
}
