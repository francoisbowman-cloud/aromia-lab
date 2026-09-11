export function ImagePlaceholder({ alt }: { alt: string }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-soft"
      role="img"
      aria-label={alt}
    >
      <svg
        viewBox="0 0 64 96"
        className="h-24 w-16 text-muted/40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="20" y="4" width="24" height="14" rx="3" />
        <rect x="14" y="18" width="36" height="10" rx="3" />
        <rect x="8" y="28" width="48" height="64" rx="8" />
      </svg>
    </div>
  );
}
