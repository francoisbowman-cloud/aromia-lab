import type { CSSProperties, ReactNode } from "react";

/**
 * P-03 · Specimen Slot — REUSABLE_PRIMITIVE
 *
 * Reserva y ESPECIFICA un activo visual todavía inexistente sin fabricarlo ni
 * dejar un hueco gris. El placeholder es una ficha de encargo, no un error.
 *
 * La especificación (`spec`) es obligatoria y debe nombrar la FUNCIÓN EDITORIAL
 * del activo, no su estética. Cuando llega la imagen real se pasa como
 * `children` y sustituye a las rayas SIN cambiar la caja.
 *
 * Regla fundacional de imagen (§5): ninguna imagen se presenta como evidencia
 * documental de un hecho (fórmula, lote, año) que no esté verificado.
 */

export interface SpecimenSlotProps {
  /** Función editorial del activo. Obligatoria mientras sea placeholder. */
  spec: string;
  state?: "documental" | "pendiente";
  /** Recorte por el borde derecho del contenedor: el objeto continúa fuera de página. */
  bleed?: boolean;
  /** aspect-ratio CSS (ej. "16 / 9", "3 / 4"). Libre; nunca object-fit:cover con producto real. */
  ratio?: string;
  minHeight?: string;
  label?: string;
  /** Activo real ya disponible. Si se pasa, se renderiza en lugar de la ficha. */
  children?: ReactNode;
  className?: string;
}

export function SpecimenSlot({
  spec,
  state = "pendiente",
  bleed = false,
  ratio,
  minHeight,
  label = "Espécimen",
  children,
  className,
}: SpecimenSlotProps) {
  const style: CSSProperties = {
    aspectRatio: ratio,
    // Con `ratio`, la altura la manda la proporción sobre el ancho del campo.
    // Sin él, cae al min-height de .ed-specimen (o al que se pase).
    minHeight: minHeight ?? (ratio ? 0 : undefined),
  };

  if (children) {
    return (
      <figure
        className={`${bleed ? "ed-specimen--bleed " : ""}${className ?? ""}`.trim() || undefined}
        style={style}
      >
        {children}
      </figure>
    );
  }

  return (
    <figure
      className={`ed-specimen ed-specimen--${state}${bleed ? " ed-specimen--bleed" : ""}${className ? ` ${className}` : ""}`}
      style={style}
      aria-label={`Activo visual pendiente — ${spec}`}
    >
      <figcaption className="ed-specimen__spec">
        <span className="ed-label" style={{ marginBottom: 6 }}>
          {label} · {state === "pendiente" ? "pendiente" : "documental"}
        </span>
        {spec}
      </figcaption>
    </figure>
  );
}
