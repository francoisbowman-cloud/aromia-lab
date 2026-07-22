"use client";

import { MAGAZINE_TABS } from "@/lib/magazineCategories";

export function MagazineCategoryNav({
  activeKey,
  onSelect,
}: {
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="sticky top-0 z-40 border-b border-line bg-paper/[.88] backdrop-blur-md">
      <nav className="mx-auto flex h-[66px] max-w-[1440px] items-center gap-8 overflow-x-auto whitespace-nowrap px-6 lg:gap-12 lg:px-10">
        {MAGAZINE_TABS.map((tab) => {
          const active = tab.key === activeKey;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelect(tab.key)}
              className={`relative shrink-0 pb-[13px] font-sans text-[12px] uppercase tracking-[.11em] transition-colors duration-150 ${
                active ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {tab.label}
              {active ? (
                <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gold" aria-hidden />
              ) : null}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
