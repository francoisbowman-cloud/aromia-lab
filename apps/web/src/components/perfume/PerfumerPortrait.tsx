import Image from "next/image";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Portrait slot for a perfumer. When a reviewed photograph exists (`portrait`),
 * it is used. Otherwise this renders a deliberate editorial monogram plate on
 * the shared material field — clearly a designed placeholder, never a broken
 * image or a generic silhouette, and never an AI-invented face.
 */
export function PerfumerPortrait({
  name,
  portrait,
  credit,
  era,
  variant = "card",
}: {
  name: string;
  portrait?: string;
  credit?: string;
  era?: string;
  variant?: "card" | "detail";
}) {
  if (portrait) {
    return (
      <figure className="m-0">
        <div className="relative aspect-[4/5] overflow-hidden border border-line">
          <Image
            src={portrait}
            alt={`Retrato fotográfico de ${name}.`}
            fill
            sizes={variant === "detail" ? "(max-width: 900px) 100vw, 34vw" : "(max-width: 768px) 100vw, 30vw"}
            style={{ objectFit: "cover" }}
          />
        </div>
        {credit && variant === "detail" ? (
          <figcaption className="mt-2 font-plex text-[10px] leading-snug tracking-[.04em] text-muted">{credit}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${name} — retrato editorial`}
      className="aromia-material-wash relative aspect-[4/5] overflow-hidden border border-line"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center font-display leading-none tracking-[-.05em] text-ink opacity-[0.12]"
        style={{ fontSize: variant === "detail" ? "clamp(72px,11vw,150px)" : "clamp(52px,9vw,96px)" }}
      >
        {initials(name)}
      </span>
      <span className="absolute inset-x-4 bottom-4 flex items-center justify-between border-t border-line pt-2 font-plex text-[9px] uppercase tracking-[.15em] text-muted">
        <span>Personas</span>
        {era ? <span>{era}</span> : null}
      </span>
    </div>
  );
}
