import { HeroHeaderSkeleton } from "@/components/perfume/HeroHeader";
import { PriceTableSkeleton } from "@/components/perfume/PriceTable";
import { SkinEvolutionSkeleton } from "@/components/perfume/SkinEvolution";
import { CommunityReviewsSkeleton } from "@/components/perfume/CommunityReviews";

export default function Loading() {
  return (
    <main
      className="mx-auto flex max-w-5xl flex-col gap-8 p-6 lg:p-10"
      aria-busy="true"
      aria-live="polite"
    >
      <HeroHeaderSkeleton />
      <PriceTableSkeleton />
      <SkinEvolutionSkeleton />
      <CommunityReviewsSkeleton />
    </main>
  );
}
