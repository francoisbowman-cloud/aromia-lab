import { ArticleCardSkeleton } from "@/components/article/ArticleCard";

export default function Loading() {
  return (
    <main
      className="mx-auto flex max-w-6xl flex-col gap-8 p-6 lg:p-10"
      aria-busy="true"
      aria-live="polite"
    >
      <div>
        <div className="h-3 w-20 animate-pulse rounded bg-soft" />
        <div className="mt-2 h-10 w-48 animate-pulse rounded bg-soft" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
