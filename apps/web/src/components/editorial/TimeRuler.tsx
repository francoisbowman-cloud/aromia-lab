/**
 * P-06 · Time Ruler — REUSABLE_PRIMITIVE
 *
 * Representa DURACIÓN cuando solo los extremos son verificables: filete + N
 * marcas equidistantes + dos etiquetas (inicio / hoy) + una nota que declara
 * qué NO está etiquetado.
 *
 * Las marcas intermedias no se etiquetan si el dato no está verificado.
 * La nota de honestidad es parte de la primitiva, no un añadido opcional.
 */

export interface TimeRulerProps {
  startLabel: string;
  endLabel: string;
  /** Nota de honestidad — obligatoria. Declara qué representan (y qué no) las marcas. */
  honestyNote: string;
  marks?: number;
  className?: string;
}

export function TimeRuler({
  startLabel,
  endLabel,
  honestyNote,
  marks = 8,
  className,
}: TimeRulerProps) {
  return (
    <div className={className} style={{ maxWidth: 240 }}>
      <div
        aria-hidden="true"
        style={{
          borderTop: "1px solid var(--ed-line-strong)",
          paddingTop: 10,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {Array.from({ length: marks }, (_, i) => (
          <span key={i} style={{ width: 1, height: 12, background: "var(--ed-line-strong)" }} />
        ))}
      </div>
      <div
        style={{
          marginTop: 6,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-plex), Inter, system-ui, sans-serif",
          fontSize: "var(--ed-label-size)",
          letterSpacing: "var(--ed-label-tracking)",
          textTransform: "uppercase",
          color: "var(--ed-muted)",
        }}
      >
        <span>{startLabel}</span>
        <span>{endLabel}</span>
      </div>
      <p
        style={{
          marginTop: 10,
          fontFamily: "var(--font-plex), Inter, system-ui, sans-serif",
          fontSize: "var(--ed-note-size)",
          lineHeight: "var(--ed-note-lh)",
          color: "var(--ed-muted)",
        }}
      >
        {honestyNote}
      </p>
    </div>
  );
}
