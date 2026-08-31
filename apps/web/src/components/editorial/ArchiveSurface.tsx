import type { ReactNode } from "react";

/**
 * P-05 · Archive Surface — REUSABLE_PRIMITIVE
 *
 * Cambia el registro emocional de un pasaje a documental / conservación
 * mediante SUPERFICIE, no ornamento: fondo vitela + filete arriba y abajo,
 * misma retícula, mismos tipos.
 *
 * Restricción: MÁXIMO UNA POR ARTÍCULO. Si aparece dos veces deja de
 * significar cambio de registro. No se combina con imagen a sangre.
 *
 * El fondo va a ancho completo; el contenido llega ya acotado (los
 * <EditorialRow> traen su propio .ed-container).
 */

export interface ArchiveSurfaceProps {
  children: ReactNode;
  className?: string;
  id?: string;
  "data-act"?: string;
}

export function ArchiveSurface({ children, className, id, ...rest }: ArchiveSurfaceProps) {
  return (
    <section id={id} className={`ed-archive${className ? ` ${className}` : ""}`} {...rest}>
      {children}
    </section>
  );
}
