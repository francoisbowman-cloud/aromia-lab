import Link from "next/link";
import { getPerfumes } from "@/lib/api";

export const revalidate = 60;

export default async function PerfumesPage() {
  let perfumes: Awaited<ReturnType<typeof getPerfumes>> = [];
  let error: string | null = null;

  try {
    perfumes = await getPerfumes();
  } catch (err) {
    console.error("DIAG getPerfumes failed:", err);
    error = "No se pudo conectar con el backend (¿está corriendo la API?).";
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-bold tracking-tight">Perfumes</h1>

      {error && (
        <p className="rounded border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          {error}
        </p>
      )}

      {!error && perfumes.length === 0 && (
        <p className="text-black/60 dark:text-white/60">
          Todavía no hay perfumes cargados en la base.
        </p>
      )}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {perfumes.map((perfume) => (
          <li
            key={perfume.slug}
            className="rounded border border-black/10 p-4 dark:border-white/10"
          >
            <Link href={`/perfumes/${perfume.slug}`} className="font-medium hover:underline">
              {perfume.nombre}
            </Link>
            <p className="text-sm text-black/60 dark:text-white/60">
              {perfume.marca} · {perfume.familia_olfativa}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
