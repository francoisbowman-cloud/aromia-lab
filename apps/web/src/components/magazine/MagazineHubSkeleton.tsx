import { MAGAZINE_TABS } from "@/lib/magazineCategories";
import { MagazineCoverStorySkeleton } from "./MagazineCoverStory";
import { MagazineSecondaryStorySkeleton } from "./MagazineSecondaryStory";

export function MagazineHubSkeleton() {
  return (
    <>
      <div className="sticky top-0 z-40 border-b border-line bg-paper/[.88] backdrop-blur-md">
        <nav className="mx-auto flex h-[66px] max-w-[1440px] items-center gap-8 overflow-x-auto whitespace-nowrap px-6 lg:gap-12 lg:px-10">
          {MAGAZINE_TABS.map((tab, i) => (
            <span
              key={tab.key}
              className={`relative shrink-0 pb-[13px] font-sans text-[12px] uppercase tracking-[.11em] ${
                i === 0 ? "text-ink" : "text-muted"
              }`}
            >
              {tab.label}
              {i === 0 ? <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gold" aria-hidden /> : null}
            </span>
          ))}
        </nav>
      </div>

      <section className="mx-auto max-w-[1440px] px-6 pb-20 pt-12 lg:px-10 lg:pt-14">
        <div className="mb-8 flex items-end justify-between">
          <h1 className="font-display text-[clamp(38px,5vw,72px)] leading-none text-ink">
            Magazine
          </h1>
        </div>
        <div
          className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.85fr)_minmax(310px,.65fr)] lg:gap-8"
          aria-busy="true"
        >
          <MagazineCoverStorySkeleton />
          <aside className="grid gap-5 lg:gap-6">
            {[0, 1, 2].map((i) => (
              <MagazineSecondaryStorySkeleton key={i} isFirst={i === 0} />
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
