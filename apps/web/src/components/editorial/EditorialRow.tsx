import type { CSSProperties, ReactNode } from "react";

/**
 * P-01 · Editorial Row — AROMIA_FOUNDATION
 *
 * La única relación espacial que hace reconocible cualquier página de Aromia:
 * `carril · campo de lectura · zona marginal`. Las tres ranuras siempre
 * existen; cualquiera puede ir vacía (vacío = silencio editorial).
 *
 * Lo que varía de historia a historia es CUÁNTO de cada zona está ocupado y el
 * gap vertical entre filas (`space`) — no la retícula. El colapso responsive es
 * intrínseco (flex-wrap), sin media queries del lado del consumidor.
 *
 * Editable: ancho del campo (token --ed-field-max), presencia de cada ranura,
 * gap vertical (la palanca de densidad).
 */

type Density = "long" | "normal" | "compress" | "saturate";

const SPACE_TOKEN: Record<Density, string> = {
  long: "var(--ed-space-long)",
  normal: "var(--ed-space-normal)",
  compress: "var(--ed-space-compress)",
  saturate: "var(--ed-space-saturate)",
};

export interface EditorialRowProps {
  rail?: ReactNode;
  /** Contenido del campo de lectura. `children` tiene prioridad si se pasa. */
  field?: ReactNode;
  margin?: ReactNode;
  children?: ReactNode;
  /**
   * Gap vertical POR ENCIMA de esta fila. Palabra clave de la escala
   * fundacional, o cualquier valor CSS crudo para casos story-specific
   * (ej. la liberación de "Sí, pero").
   */
  space?: Density | string;
  /** Alinea las tres zonas por su base en vez de por arriba. */
  align?: "start" | "baseline";
  /**
   * Por defecto la fila trae su propio .ed-container (ancho máximo + padding
   * lateral). `bare` lo omite para cuando ya está dentro de un contenedor
   * (ArchiveSurface, ContextualClose, un wrapper propio).
   */
  bare?: boolean;
  className?: string;
  id?: string;
}

export function EditorialRow({
  rail,
  field,
  margin,
  children,
  space,
  align = "start",
  bare = false,
  className,
  id,
}: EditorialRowProps) {
  const marginTop = space
    ? SPACE_TOKEN[space as Density] ?? space
    : undefined;
  const style: CSSProperties = {
    marginTop,
    alignItems: align === "baseline" ? "baseline" : "flex-start",
  };
  const row = (
    <div
      id={bare ? id : undefined}
      className={`ed-row${className ? ` ${className}` : ""}`}
      style={style}
    >
      <div className="ed-rail">{rail}</div>
      <div className="ed-field">{children ?? field}</div>
      <div className="ed-margin">{margin}</div>
    </div>
  );
  if (bare) return row;
  return (
    <div id={id} className="ed-container">
      {row}
    </div>
  );
}
