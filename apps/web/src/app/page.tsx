import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-8">
      <h1 className="text-3xl font-bold tracking-tight">Aromia v2.0</h1>
      <p className="max-w-2xl text-black/70 dark:text-white/70">
        Comparador y recomendador de perfumes. Placeholder de Sprint 1 —
        estructura navegable, sin diseño final.
      </p>
      <div className="flex gap-4 text-sm">
        <Link href="/perfumes" className="underline">
          Ver listado de perfumes
        </Link>
        <Link href="/quiz" className="underline">
          Hacer el quiz
        </Link>
      </div>
    </main>
  );
}
