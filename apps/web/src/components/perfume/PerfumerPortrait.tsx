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
    return (
      <figure className="m-0">
        <div className="relative aspect-[4/5] overflow-hidden border border-line bg-soft">
          <Image
            src={portrait}
            alt={`Retrato fotográfico de ${name}.`}
            fill
            sizes={variant === "detail" ? "(max-width: 900px) 100vw, 34vw" : "(max-width: 768px) 100vw, 30vw"}
            style={{ objectFit: "cover" }}
          />
        </div>
        {portraitCredit ? (
          <figcaption className="border-x border-b border-line px-3 py-2 font-sans text-xs leading-5 text-muted">
            {portraitCreditHref ? (
              <a
                href={portraitCreditHref}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-line underline-offset-2 transition hover:text-ink"
              >
                {portraitCredit}
              </a>
            ) : portraitCredit}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return <div role="img" aria-label={`Monograma de ${name}`} className="ed-portrait-monogram">{initials(name)}</div>;
}
