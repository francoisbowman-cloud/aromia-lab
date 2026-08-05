import { ArticleMetaRailSkeleton } from "@/components/magazine/ArticleMetaRail";

export default function MagazineArticleLoading() {
  return (
    <main>
      <div className="border-b border-line">
        <div className="mx-auto flex h-[66px] max-w-[1440px] items-center px-6 lg:px-10" />
      </div>

      <div className="relative flex min-h-[500px] items-end overflow-hidden bg-soft lg:min-h-[650px]" aria-busy="true">
        <div className="mx-auto w-full max-w-[1180px] px-6 pb-14 lg:px-10 lg:pb-20">
          <div className="h-16 w-2/3 animate-pulse rounded bg-line/40" />
          <div className="mt-4 h-16 w-1/2 animate-pulse rounded bg-line/40" />
        </div>
      </div>

      <section className="mx-auto max-w-[1180px] px-6 py-10 lg:px-10 lg:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(220px,.55fr)_minmax(0,1.45fr)] lg:gap-20">
          <ArticleMetaRailSkeleton />
          <div className="flex flex-col gap-4" aria-busy="true">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-5 animate-pulse rounded bg-soft"
                style={{ width: i % 3 === 2 ? "70%" : "100%" }}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
