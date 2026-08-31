import type { ReactNode } from "react";
import {
  ActIndicator,
  ArchiveSurface,
  CaptionCredit,
  ContextualClose,
  EditorialBar,
  EditorialRow,
  ProportionMarks,
  SpecimenSlot,
  TimeRuler,
} from "@/components/editorial";

/**
 * Inspección del sistema editorial extraído de "El Coleccionista".
 * Editar aquí es editar el sistema: cada bloque renderiza el código real de
 * components/editorial/* y las variables de app/editorial.css.
 */

function Section({ title, kicker, children }: { title: string; kicker: string; children: ReactNode }) {
  return (
    <section style={{ marginTop: "var(--ed-space-long)" }}>
      <div className="ed-container">
        <span className="ed-label">{kicker}</span>
        <h2 className="ed-subhead" style={{ marginTop: 8, maxWidth: "24ch" }}>{title}</h2>
      </div>
      <div style={{ marginTop: "var(--ed-space-normal)" }}>{children}</div>
    </section>
  );
}

const CLASS_COLORS: Record<string, string> = {
  AROMIA_FOUNDATION: "#1f1b15",
  REUSABLE_PRIMITIVE: "#4e463a",
  STORY_SPECIFIC: "#8a3a2e",
  EXPERIMENT: "#6b6155",
};

function Tag({ kind }: { kind: keyof typeof CLASS_COLORS }) {
  return (
    <span
      className="ed-label"
      style={{ color: CLASS_COLORS[kind], border: `1px solid ${CLASS_COLORS[kind]}`, padding: "2px 6px", display: "inline-block" }}
    >
      {kind.replace("_", " ")}
    </span>
  );
}

export default function DesignLabPage() {
  return (
    <main style={{ paddingBottom: "var(--ed-space-long)" }}>
      <EditorialBar section="Design Lab" right={<span className="ed-label">Sistema editorial · v0</span>} />

      <header className="ed-container" style={{ paddingTop: "var(--ed-space-normal)" }}>
        <h1 className="ed-headline" style={{ fontSize: "clamp(40px, 7vw, 92px)" }}>
          Design&nbsp;<span style={{ fontStyle: "italic" }}>lab</span>
        </h1>
        <p className="ed-standfirst" style={{ marginTop: "var(--ed-space-normal)", maxWidth: "52ch" }}>
          Foundation y primitivas extraídas del espécimen fundador <em>El Coleccionista</em>.
          Repite identidad; varía composición. Los gestos propios de esa historia
          viven en su ruta, no acá.
        </p>
      </header>

      {/* ---------------------------------------------------------------- COLOR */}
      <Section kicker="Foundation · §4" title="Color y material">
        <div className="ed-container" style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {[
            ["--ed-paper", "#FAF8F4", "papel base"],
            ["--ed-paper-lifted", "#FDFCFA", "papel liberado"],
            ["--ed-vellum", "#EFEAE0", "vitela / archivo"],
            ["--ed-ink", "#1F1B15", "tinta (negro cálido)"],
            ["--ed-muted", "#6B6155", "secundario · AA"],
            ["--ed-muted-strong", "#4E463A", "sobre espécimen rayado"],
            ["--ed-specimen-a", "#DFD8C9", "espécimen"],
          ].map(([token, hex, use]) => (
            <div key={token} style={{ width: 150 }}>
              <div style={{ height: 72, background: hex, border: "1px solid var(--ed-line)" }} />
              <p className="ed-label" style={{ marginTop: 8 }}>{token}</p>
              <p style={{ fontFamily: "var(--font-plex)", fontSize: 13, color: "var(--ed-muted)" }}>{hex} · {use}</p>
            </div>
          ))}
        </div>
        <div className="ed-container" style={{ marginTop: "var(--ed-space-normal)", maxWidth: 640 }}>
          <p className="ed-body">
            No hay dorado y no existe un tercer gris más claro que <code>--ed-muted</code>.
            La jerarquía terciaria se sostiene con tamaño, tracking, mayúsculas y
            posición — nunca bajando la luminancia. El acento de color es
            <em> episódico</em>: cada historia deriva el suyo de su materia real y
            lo usa solo en enlaces y gráficos de proporción.
          </p>
        </div>
      </Section>

      {/* ----------------------------------------------------------- TIPOGRAFÍA */}
      <Section kicker="Foundation · §2" title="Escala tipográfica verificada">
        <div className="ed-container" style={{ display: "grid", gap: "var(--ed-space-normal)", maxWidth: 900 }}>
          <div>
            <p className="ed-label">titular · Newsreader 300 · clamp(44→138px) / .86 / -.045em</p>
            <p className="ed-headline" style={{ marginTop: 8 }}>El <span style={{ fontStyle: "italic" }}>coleccionista</span></p>
          </div>
          <div>
            <p className="ed-label">entradilla · Newsreader 400 · clamp(21→27px) / 1.48</p>
            <p className="ed-standfirst" style={{ marginTop: 8, maxWidth: "48ch" }}>
              No hace falta tener doscientos perfumes para ser coleccionista.
            </p>
          </div>
          <div>
            <p className="ed-label">subtítulo · Newsreader 400 · clamp(30→46px) · máx 12–15ch</p>
            <p className="ed-subhead" style={{ marginTop: 8 }}>La distinción que nadie quiere hacer</p>
          </div>
          <div>
            <p className="ed-label">cuerpo · Newsreader 400 · clamp(18→21px) / 1.72</p>
            <div className="ed-body" style={{ marginTop: 8, maxWidth: "var(--ed-field-max)" }}>
              <p>
                El cuerpo del ensayo va en serif, no en la sans de interfaz. Esa
                distinción —cuerpo serif, interfaz sans— es lo que separa
                &laquo;revista&raquo; de &laquo;sitio de producto&raquo; sin recurrir a ornamento.
              </p>
            </div>
          </div>
          <div>
            <p className="ed-label">nota / rótulo · IBM Plex · 13px · 12px suelo</p>
            <p className="ed-note" style={{ marginTop: 8 }}>
              Metadata, captions, notas marginales, datos. Nada por debajo de 12px.
            </p>
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------------- RITMO */}
      <Section kicker="Foundation (escala) · Story-specific (curva)" title="Espacio y ritmo">
        <div className="ed-container" style={{ display: "grid", gap: 14, maxWidth: 720 }}>
          {[
            ["respiro largo", "--ed-space-long", "clamp(52, 9vh, 110)"],
            ["respiro normal", "--ed-space-normal", "clamp(30, 5vh, 56)"],
            ["compresión", "--ed-space-compress", "clamp(20, 3.2vh, 36)"],
            ["saturación", "--ed-space-saturate", "clamp(12, 1.8vh, 22)"],
          ].map(([name, token, val]) => (
            <div key={token} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span className="ed-label" style={{ width: 130 }}>{name}</span>
              <span style={{ height: 10, width: `var(${token})`, background: "var(--ed-ink)", minWidth: 8 }} />
              <span style={{ fontFamily: "var(--font-plex)", fontSize: 12, color: "var(--ed-muted)" }}>{token} · {val}</span>
            </div>
          ))}
        </div>
        <div className="ed-container" style={{ marginTop: 20, maxWidth: 640 }}>
          <p className="ed-note">
            Que exista una <em>curva</em> de densidad es fundacional. Que la curva
            concreta sea 110 → 56 → 36 → 22 → saturación → liberación pertenece a
            El Coleccionista y no se promueve a token global.
          </p>
        </div>
      </Section>

      {/* --------------------------------------------------------- P-01 · ROW */}
      <Section kicker="Primitiva P-01" title="Editorial Row — carril · campo · zona marginal">
        <div className="ed-container"><Tag kind="AROMIA_FOUNDATION" /></div>
        <div style={{ marginTop: 20, outline: "1px dashed var(--ed-line-strong)", outlineOffset: -1 }}>
          <EditorialRow
            rail={<CaptionCredit variant="note">Carril: notas, series, atribuciones. Nunca cuerpo de texto.</CaptionCredit>}
            margin={<CaptionCredit variant="data" label="Zona marginal">Datos como material, marcas contables, interludios.</CaptionCredit>}
          >
            <div className="ed-body">
              <p>
                Campo de lectura: medida fija, nunca supera 640px con cuerpo. Las
                tres zonas siempre existen; cualquiera puede ir vacía y eso es
                silencio editorial, no espacio sin usar. El colapso por debajo de
                ~760px convierte carril y margen en interludios en línea — es
                comportamiento diseñado, no fallback.
              </p>
            </div>
          </EditorialRow>
        </div>
        <div className="ed-container" style={{ marginTop: 16 }}>
          <p className="ed-note">
            Variantes: quiet (solo campo) · annotated · data · wide (hasta 820 para
            tablas) · bleed. Editable: ancho del campo, presencia de cada ranura,
            gap vertical (la palanca de densidad).
          </p>
        </div>
      </Section>

      {/* ----------------------------------------------------- P-02 · CAPTION */}
      <Section kicker="Primitiva P-02" title="Caption / Credit">
        <div className="ed-container" style={{ display: "flex", flexWrap: "wrap", gap: 40 }}>
          <Tag kind="REUSABLE_PRIMITIVE" />
          <CaptionCredit variant="note">Filete superior, nunca caja, nunca dentro del campo de lectura.</CaptionCredit>
          <CaptionCredit variant="data">35 de cada 100 lanzamientos de una gran casa.</CaptionCredit>
          <CaptionCredit variant="credit">Fotografía documental con licencia.</CaptionCredit>
        </div>
      </Section>

      {/* --------------------------------------------------- P-03 · SPECIMEN */}
      <Section kicker="Primitiva P-03" title="Specimen Slot — ficha de encargo, no hueco">
        <div className="ed-container" style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", maxWidth: 900 }}>
          <div><Tag kind="REUSABLE_PRIMITIVE" /></div>
          <SpecimenSlot state="documental" spec="Función: reconocimiento. Colección real vivida, alturas mezcladas, huecos sin ordenar. No tienda, no campaña." />
          <SpecimenSlot state="pendiente" spec="Función: apertura. Se sustituye por la imagen real sin cambiar la caja." />
        </div>
      </Section>

      {/* -------------------------------------------------- P-04 · PROPORTION */}
      <Section kicker="Primitiva P-04" title="Proportion Marks — solo con cifra verificable">
        <div className="ed-container" style={{ display: "flex", flexWrap: "wrap", gap: 48 }}>
          <div><Tag kind="REUSABLE_PRIMITIVE" /></div>
          <ProportionMarks mode="count" total={10} inked={4} reading="Casi 4 de cada 10 (ejemplo — requiere fuente)." label="10" />
          <ProportionMarks mode="range" from={30} to={40} reading="Estimación citada de entre el 30 % y el 40 %." label="rango" />
        </div>
      </Section>

      {/* ---------------------------------------------------- P-05 · ARCHIVE */}
      <Section kicker="Primitiva P-05" title="Archive Surface — máximo una por artículo">
        <div className="ed-container" style={{ marginBottom: 16 }}><Tag kind="REUSABLE_PRIMITIVE" /></div>
        <ArchiveSurface>
          <EditorialRow
            rail={<CaptionCredit variant="note" label="Registro">Documental / conservación</CaptionCredit>}
            margin={
              <TimeRuler
                startLabel="2010"
                endLabel="hoy"
                honestyNote="Las marcas intermedias indican paso del tiempo; no representan reformulaciones fechadas."
              />
            }
          >
            <div className="ed-body">
              <p>
                Fondo vitela + filete arriba y abajo. Misma retícula, mismos tipos.
                Cambia el registro emocional por superficie, no por ornamento.
              </p>
            </div>
          </EditorialRow>
        </ArchiveSurface>
      </Section>

      {/* --------------------------------------------- P-08 · ACT INDICATOR */}
      <Section kicker="Primitiva P-08" title="Act Indicator — orientación, no telemetría">
        <div className="ed-container"><Tag kind="REUSABLE_PRIMITIVE" /></div>
        <div style={{ position: "sticky", top: 52, background: "var(--ed-paper)", borderBottom: "1px solid var(--ed-line)", zIndex: 5 }}>
          <div className="ed-container" style={{ display: "flex", justifyContent: "flex-end", height: 40, alignItems: "center" }}>
            <ActIndicator />
          </div>
        </div>
        {["Reconocer", "Acumular", "Conservar", "Soltar"].map((act) => (
          <section key={act} data-act={act} style={{ minHeight: "70vh" }} className="ed-container">
            <p className="ed-subhead" style={{ paddingTop: "var(--ed-space-normal)" }}>{act}</p>
            <p className="ed-note" style={{ marginTop: 12 }}>
              Scrollea: la etiqueta de arriba a la derecha cambia (no anima) según
              la sección visible. 3–6 actos, nombres de la historia.
            </p>
          </section>
        ))}
      </Section>

      {/* --------------------------------------------------- P-07 · CLOSE */}
      <Section kicker="Primitiva P-07" title="Contextual Close — comercio subordinado">
        <div className="ed-container"><Tag kind="REUSABLE_PRIMITIVE" /></div>
        <ContextualClose
          references={[
            {
              name: "Le Male",
              house: "Jean Paul Gaultier",
              reason: "Aparece como ejemplo de una familia que no deja de extenderse.",
              actionLabel: "Ver opciones disponibles",
              href: "https://www.amazon.com/dp/B0733677R6?tag=aromialab-20",
            },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------- ANTI-TEMPLATE */}
      <section className="ed-container" style={{ marginTop: "var(--ed-space-long)", borderTop: "1px solid var(--ed-line-strong)", paddingTop: "var(--ed-space-normal)", maxWidth: 640 }}>
        <span className="ed-label">Regla</span>
        <p className="ed-body" style={{ marginTop: 12 }}>
          Antes de promover cualquier relación a Foundation: ¿la misma disposición
          exacta serviría sin cambios para los próximos cinco artículos? Si sí, se
          está estandarizando de más. <strong>Repeat identity. Vary composition.</strong>
        </p>
      </section>
    </main>
  );
}
