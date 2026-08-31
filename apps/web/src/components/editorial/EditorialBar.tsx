import type { ReactNode } from "react";

/**
 * Editorial Bar — AROMIA_FOUNDATION (Visual Grammar Sheet §8)
 *
 * Barra fija de 52px, papel sólido con filete inferior. Sin blur decorativo,
 * sin sombra, sin logo grande.
 *   - Izquierda: `AROMIA` (Archivo 600, .28em) + sección.
 *   - Derecha: continuidad editorial (típicamente <ActIndicator/>).
 *
 * Candidata a shell de artículo para todo el Magazine; hoy se usa solo en el
 * espécimen y en /design-lab. No se ha cableado al pipeline público
 * /magazine/[slug] (ese lo publica el editor por su cuenta).
 */

export interface EditorialBarProps {
  section?: string;
  right?: ReactNode;
}

export function EditorialBar({ section, right }: EditorialBarProps) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        minHeight: 52,
        background: "var(--ed-paper)",
        borderBottom: "1px solid var(--ed-line-strong)",
      }}
    >
      <div
        className="ed-container"
        style={{ minHeight: 52, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, paddingBlock: 8 }}
      >
        <span
          style={{
            fontFamily: "var(--font-body), Inter, system-ui, sans-serif",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--ed-ink)",
          }}
        >
          AROMIA
          {section ? (
            <span data-ed-bar-section style={{ color: "var(--ed-muted)", fontWeight: 400 }}> · {section}</span>
          ) : null}
        </span>
        {right}
      </div>
    </div>
  );
}
