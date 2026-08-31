import type { ReactNode } from "react";

/**
 * P-02 · Caption / Credit — REUSABLE_PRIMITIVE
 *
 * Una sola voz de anotación para toda la publicación: filete SUPERIOR (no
 * inferior, no caja) + Plex 13px + rótulo opcional en mayúsculas.
 *
 * Restricciones: máx. 240px de ancho; nunca dentro del campo de lectura;
 * nunca con fondo. Al colapsar en móvil conserva el filete y pasa a interludio.
 */

type CaptionVariant = "note" | "data" | "spec" | "credit";

export interface CaptionCreditProps {
  variant?: CaptionVariant;
  /** Rótulo en mayúsculas (opcional). Si se omite se usa el del variant. */
  label?: string | null;
  /** true cuando el caption vive sobre la superficie rayada de un espécimen. */
  onSpecimen?: boolean;
  children: ReactNode;
  className?: string;
}

const DEFAULT_LABEL: Record<CaptionVariant, string | null> = {
  note: null,
  data: "Dato",
  spec: "Activo requerido",
  credit: "Crédito",
};

export function CaptionCredit({
  variant = "note",
  label,
  onSpecimen = false,
  children,
  className,
}: CaptionCreditProps) {
  const resolvedLabel = label === undefined ? DEFAULT_LABEL[variant] : label;
  return (
    <figcaption
      className={`ed-caption${onSpecimen ? " ed-caption--on-specimen" : ""}${className ? ` ${className}` : ""}`}
    >
      {resolvedLabel ? <span className="ed-label">{resolvedLabel}</span> : null}
      {children}
    </figcaption>
  );
}
