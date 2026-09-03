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
 * it is used with visible attribution. Otherwise this renders a deliberate
 * editorial monogram plate — clearly a fallback, never a broken image or an
 * AI-invented face.
 */
export function PerfumerPortrait({
  name,
  portrait,
  portraitCredit,
  portraitCreditHref,
  era,
  variant = "card",
}: {
  name: string;
  portrait?: string;
  portraitCredit?: string;
  portraitCreditHref?: string;
  era?: string;
  variant?: "card" | "detail";
}) {
  if (portrait) {
    const external = /^https?:\/\//.test(portrait);
    return (
      <figure className="relative aspect-[4/5] overflow-hidden border border-line bg-soft">
        <Image
          src={portrait}
          alt={`Retrato fotográfico de ${name}.`}
          fill
          sizes={variant === "detail" ? "(max-width: 900px) 100vw, 34vw" : "(max-width: 768px) 100vw, 30vw"}
          unoptimized={external}
          style={{ objectFit: "cover" }}
        />
        {portraitCredit ? (
          <figcaption className="absolute inset-x-0 bottom-0 bg-[rgba(244,240,232,.9)] px-3 py-2 font-sans text-[9px] leading-4 text-ink backdrop-blur-sm">
            {portraitCreditHref ? (
              <a href={portraitCreditHref} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-2">
                {portraitCredit}
              </a>
            ) : portraitCredit}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${name} — retrato editorial pendiente de fuente reutilizable`}
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
