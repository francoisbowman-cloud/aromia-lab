export function RatingStars({ rating, className }: { rating: number; className?: string }) {
  const full = Math.round(rating);
  return (
    <div className={`flex items-center gap-1.5 ${className ?? ""}`}>
      <span aria-hidden="true" className="text-gold-contrast">
        {[1, 2, 3, 4, 5].map((i) => (i <= full ? "★" : "☆")).join("")}
      </span>
      <span className="font-sans text-xs text-muted">{rating.toFixed(1)}</span>
    </div>
  );
}
