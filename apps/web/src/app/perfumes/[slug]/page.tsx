import { notFound } from "next/navigation";
import { getPerfumeBySlug } from "@/lib/api";

export default async function PerfumeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let perfume;

  try {
    perfume = await getPerfumeBySlug(params.slug);
  } catch {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <p className="rounded border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          No se pudo conectar con el backend (¿está corriendo la API?).
        </p>
      </main>
    );
  }

  if (!perfume) notFound();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-bold tracking-tight">{perfume.nombre}</h1>
      <p className="text-black/60 dark:text-white/60">
        {perfume.marca} · {perfume.familia_olfativa} · {perfume.genero}
      </p>
      <p>
        Precio de referencia: {perfume.precio_referencia} {perfume.moneda} (
        {perfume.categoria_precio})
      </p>
    </main>
  );
}
