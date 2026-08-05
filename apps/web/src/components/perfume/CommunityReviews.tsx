function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <div aria-hidden="true" className="flex gap-0.5 text-gold-contrast">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i}>{i <= full ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export function CommunityReviewsSkeleton() {
  return (
    <section
      className="grid grid-cols-1 gap-6 rounded-card border border-line bg-surface p-8 md:grid-cols-[.42fr_.58fr]"
      aria-busy="true"
    >
      <div className="h-16 w-24 animate-pulse rounded bg-soft" />
      <div className="h-16 w-full animate-pulse rounded bg-soft" />
    </section>
  );
}

export function CommunityReviews({
  ratingPromedio,
  resenaSintetizada,
}: {
  ratingPromedio?: number;
  resenaSintetizada?: string;
}) {
  if (!ratingPromedio) {
    return (
      <section className="rounded-card border border-line bg-surface p-8 text-center">
        <p className="font-display text-4xl text-muted">—</p>
        <div className="mt-2 flex justify-center gap-0.5 text-line" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i}>☆</span>
          ))}
        </div>
        <p className="mt-4 font-sans text-sm text-muted">Aún no hay reseñas disponibles.</p>
        <p className="mt-1 font-sans text-xs text-muted">0 reseñas</p>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-8 rounded-card border border-line bg-surface p-8 md:grid-cols-[.42fr_.58fr]">
      <div>
        <p className="font-display text-[56px] leading-none text-ink">
          {ratingPromedio.toFixed(1)}
        </p>
        <Stars rating={ratingPromedio} />
      </div>
      <div>
        <p className="font-display text-lg text-ink">
          {resenaSintetizada ?? "Reseña editorial próximamente."}
        </p>
      </div>
    </section>
  );
}
