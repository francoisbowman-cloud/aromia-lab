import type { CSSProperties } from "react";

/**
 * P-04 · Proportion Marks — REUSABLE_PRIMITIVE
 *
 * Hace legible una proporción REAL sin numerales decorativos: N marcas iguales,
 * K entintadas, el resto al 13–16% de tinta, con su lectura textual en Plex.
 *
 * Restricciones: SOLO con cifra verificable. La lectura textual es obligatoria
 * (la marca sola no es accesible). Máx. una por fila. El acento episódico de la
 * historia puede teñir la parte entintada; por defecto es tinta.
 *
 * Para un intervalo citado (ej. "30–40%") usar `mode="range"`: no se dibuja una
 * medición exacta, se dibuja una banda entre dos extremos.
 */

export interface ProportionMarksProps {
  /** Lectura textual obligatoria — es también el nombre accesible. */
  reading: string;
  /** mode "count" / "percent": N marcas, K entintadas. mode "range": banda entre from–to. */
  mode?: "count" | "percent" | "range";
  total?: number;
  inked?: number;
  /** Para mode="range": extremos citados, 0–100. */
  from?: number;
  to?: number;
  /** Color de la parte entintada / la banda. Por defecto tinta. */
  accent?: string;
  label?: string;
  className?: string;
}

export function ProportionMarks({
  reading,
  mode = "count",
  total = 10,
  inked = 1,
  from = 30,
  to = 40,
  accent,
  label,
  className,
}: ProportionMarksProps) {
  const inkedColor = accent ?? "var(--ed-ink)";
  const restColor = "rgba(31, 27, 21, 0.14)";

  return (
    <div
      className={className}
      role="img"
      aria-label={reading}
      style={{ maxWidth: 240 }}
    >
      {label ? <span className="ed-label" style={{ marginBottom: 8, display: "block" }}>{label}</span> : null}

      {mode === "range" ? (
        <div aria-hidden="true" style={{ position: "relative", height: 6, background: restColor }}>
          <span
            style={{
              position: "absolute",
              left: `${from}%`,
              right: `${100 - to}%`,
              top: 0,
              bottom: 0,
              background: inkedColor,
            }}
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          style={{ display: "flex", flexWrap: "wrap", gap: 3 }}
        >
          {Array.from({ length: total }, (_, i) => {
            const on = i < inked;
            const s: CSSProperties = {
              width: 5,
              height: 22,
              background: on ? inkedColor : restColor,
            };
            return <span key={i} style={s} />;
          })}
        </div>
      )}

      <p
        style={{
          marginTop: 8,
          fontFamily: "var(--font-plex), Inter, system-ui, sans-serif",
          fontSize: "var(--ed-note-size)",
          lineHeight: "var(--ed-note-lh)",
          color: "var(--ed-muted)",
        }}
      >
        {reading}
      </p>
    </div>
  );
}
