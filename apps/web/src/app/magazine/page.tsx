import { getArticulos } from "@/lib/api";
import { MagazineHub } from "@/components/magazine/MagazineHub";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Magazine — Aromia",
  description: "Reseñas, guías y análisis de perfumería.",
};

export default async function MagazinePage() {
  const articulos = await getArticulos();

  return (
    <main>
      <MagazineHub articulos={articulos} />
    </main>
  );
}
