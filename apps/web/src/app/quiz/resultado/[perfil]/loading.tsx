import { PerfumeCardSkeleton } from "@/components/perfume/PerfumeCard";

export default function Loading() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 p-6 lg:p-10" aria-busy="true" aria-live="polite">
      <section className="rounded-card border border-line bg-surface p-10 text-center shadow-lux lg:p-16">
        <div className="mx-auto h-3 w-20 animate-pulse rounded bg-soft" />
        <div className="mx-auto mt-3 h-9 w-64 animate-pulse rounded bg-soft" />
        <div className="mx-auto mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-soft" />
        <div className="mx-auto mt-2 h-4 w-2/3 max-w-xl animate-pulse rounded bg-soft" />
      </section>

      <section>
        <div className="h-7 w-40 animate-pulse rounded bg-soft" />
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PerfumeCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
