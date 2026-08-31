/**
 * P-07 · Contextual Close — REUSABLE_PRIMITIVE
 *
 * Cierra comercialmente DESPUÉS del cierre editorial, subordinado y sin romper
 * la lectura: filete superior + rótulo en el carril + por referencia:
 * nombre · casa · RAZÓN por la que apareció en la historia · acción de texto ·
 * divulgación.
 *
 * Restricciones (contrato de comercio contextual del workflow):
 *   - sin cards, sin botones rellenos, sin precios, sin badges, sin imagen de producto;
 *   - la razón editorial precede SIEMPRE a la acción;
 *   - nunca antes del final del artículo;
 *   - 0 a 3 referencias (cero es una variante válida);
 *   - enlaces afiliados: rel="sponsored nofollow noopener", subrayado permanente,
 *     divulgación adyacente y visible.
 */

export interface ContextualReference {
  name: string;
  house?: string;
  /** Por qué esta fragancia apareció en la historia. Precede a la acción. */
  reason: string;
  actionLabel: string;
  href: string;
  disclosure?: string;
}

export interface ContextualCloseProps {
  heading?: string;
  references: ContextualReference[];
  className?: string;
}

const DEFAULT_DISCLOSURE =
  "Enlace de afiliado: Aromia puede recibir una comisión por compras hechas a través de este enlace. No cambia el precio ni la conclusión editorial.";

export function ContextualClose({
  heading = "Para quien quiera seguir oliendo",
  references,
  className,
}: ContextualCloseProps) {
  return (
    <aside
      className={`ed-container${className ? ` ${className}` : ""}`}
      style={{ borderTop: "1px solid var(--ed-line-strong)", paddingTop: "var(--ed-space-normal)", marginTop: "var(--ed-space-long)" }}
    >
      <div className="ed-row">
        <p className="ed-rail ed-label" style={{ color: "var(--ed-muted)" }}>
          {heading}
        </p>
        <div className="ed-field">
          {references.length === 0 ? null : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "var(--ed-space-compress)" }}>
              {references.map((ref) => (
                <li key={ref.href}>
                  <p style={{ margin: 0, fontFamily: "var(--font-display), Georgia, serif", fontSize: "clamp(20px, 2vw, 26px)", lineHeight: 1.2 }}>
                    {ref.name}
                    {ref.house ? (
                      <span style={{ color: "var(--ed-muted)", fontStyle: "italic" }}> · {ref.house}</span>
                    ) : null}
                  </p>
                  <p
                    style={{
                      margin: "6px 0 0",
                      fontFamily: "var(--font-plex), Inter, system-ui, sans-serif",
                      fontSize: "15px",
                      lineHeight: 1.55,
                      color: "var(--ed-muted)",
                      maxWidth: "48ch",
                    }}
                  >
                    {ref.reason}
                  </p>
                  <a
                    data-ed-link
                    href={ref.href}
                    target="_blank"
                    rel="sponsored nofollow noopener"
                    style={{
                      display: "inline-flex",
                      minHeight: 44,
                      alignItems: "center",
                      marginTop: 8,
                      fontFamily: "var(--font-body), Inter, system-ui, sans-serif",
                      fontSize: "14px",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {ref.actionLabel} <span aria-hidden="true" style={{ marginLeft: 8 }}>↗</span>
                  </a>
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontFamily: "var(--font-plex), Inter, system-ui, sans-serif",
                      fontSize: "var(--ed-label-size)",
                      lineHeight: 1.5,
                      color: "var(--ed-muted)",
                      maxWidth: "52ch",
                    }}
                  >
                    {ref.disclosure ?? DEFAULT_DISCLOSURE}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="ed-margin" />
      </div>
    </aside>
  );
}
