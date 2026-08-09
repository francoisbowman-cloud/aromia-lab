function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <div aria-hidden="true" className="flex gap-1 text-gold-contrast">
      {[1, 2, 3, 4, 5].map((i) => <span key={i}>{i <= full ? "★" : "☆"}</span>)}
    </div>
  );
}

export function CommunityReviewsSkeleton() {
  return <section className="min-h-[240px] animate-pulse border-y border-line bg-soft" aria-busy="true" />;
}

export function CommunityReviews({ ratingPromedio, resenaSintetizada }: { ratingPromedio?: number; resenaSintetizada?: string }) {
  if (!ratingPromedio) {
    return (
      <section className="grid grid-cols-1 gap-10 border-y border-line py-10 lg:grid-cols-[.42fr_.58fr] lg:py-14">
        <div><p className="font-display text-[72px] leading-none text-muted">—</p><p className="mt-3 font-plex text-[9px] uppercase tracking-[.16em] text-muted">Sin puntuación todavía</p></div>
        <div className="lg:border-l lg:border-line lg:pl-10"><p className="max-w-[18ch] font-display text-[34px] italic leading-[1.05] text-muted">La conversación de la comunidad empieza cuando llegan las primeras reseñas.</p></div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-10 border-y border-line py-10 lg:grid-cols-[.42fr_.58fr] lg:py-14">
      <div>
        <p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Community signal</p>
        <p className="mt-5 font-display text-[82px] leading-[.8] tracking-[-.05em] text-ink">{ratingPromedio.toFixed(1)}</p>
        <div className="mt-5"><Stars rating={ratingPromedio} /></div>
        <p className="mt-3 font-plex text-[8px] uppercase tracking-[.14em] text-muted">Promedio actual</p>
      </div>
      <div className="lg:border-l lg:border-line lg:pl-10">
        <p className="font-plex text-[9px] uppercase tracking-[.18em] text-muted">Síntesis editorial</p>
        <p className="mt-5 max-w-[24ch] font-display text-[34px] italic leading-[1.06] text-ink lg:text-[42px]">{resenaSintetizada ?? "Reseña editorial próximamente."}</p>
      </div>
    </section>
  );
}
