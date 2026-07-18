export function AdminTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-admin-card border border-admin-border bg-admin-surface">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse border-b border-admin-border bg-admin-bg/40 last:border-0" />
      ))}
    </div>
  );
}
