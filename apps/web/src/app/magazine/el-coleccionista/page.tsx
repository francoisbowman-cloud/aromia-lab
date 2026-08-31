import type { Metadata } from "next";
import "../../editorial.css";
import "./story.css";
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
import { SerialField } from "./SerialField";

/**
 * "El Coleccionista" — espécimen fundador implementado.
 *
 * Compuesto desde Foundation + primitivas (components/editorial/*) + gestos
 * locales (story.css, SerialField). NO es un ArticleTemplate: la secuencia de
 * actos, la curva de densidad, el campo serial, la liberación de "Sí, pero" y
 * el acento marino pertenecen a esta historia.
 *
 * Estado: IMPLEMENTATION en curso · PUBLISH: PENDING. `noindex` — no publicado.
 * Fuentes: drafts/el-coleccionista.md · research/el-coleccionista-fact-check.md
 * Dirección: art-direction/el-coleccionista.md + composition-study + EARLY_OMNI PASS.
 */

export const metadata: Metadata = {
  title: "El coleccionista",
  description:
    "Una colección de perfumes no se detiene porque el coleccionista vive entre dos miedos razonables: perderse lo nuevo y perder lo de siempre.",
  robots: { index: false, follow: false },
};

export default function ElColeccionistaPage() {
  return (
    <div className="editorial-root story-coleccionista">
      <EditorialBar
        section="Perfume como puerta"
        right={<ActIndicator />}
      />

      <main style={{ paddingBottom: "var(--ed-space-long)" }}>
        {/* ================================================= ACTO I · Reconocer */}
        <section data-act="Reconocer">
          <header className="ed-container" style={{ paddingTop: "var(--ed-space-normal)" }}>
            <p className="ed-label">Reflexión editorial · Serie «Perfume como puerta»</p>
            <h1 className="ed-headline cx-headline" style={{ marginTop: "var(--ed-space-normal)" }}>
              El <em>coleccionista</em>
            </h1>
          </header>

          <EditorialRow
            space="normal"
            rail={
              <CaptionCredit variant="note" label="Serie">
                Perfume como puerta. Reflexiones sobre por qué olemos lo que olemos.
              </CaptionCredit>
            }
            margin={
              <CaptionCredit variant="spec" label="Activo requerido">
                Apertura documental. Colección real y vivida: marcas y alturas
                mezcladas, huecos sin ordenar. Nada que parezca estante de tienda
                ni set de campaña. Candidata en revisión de licencia:
                &laquo;Collection of perfume bottles on shelves&raquo;, Tanya
                Barrow (Unsplash). Si no supera la inspección a resolución final,
                se publica sin imagen.
              </CaptionCredit>
            }
          >
            <div className="ed-body">
              <p className="ed-standfirst" style={{ marginBottom: "1em" }}>
                Hay un cajón, un estante o una repisa de baño en algún lugar de la
                casa que ya no tiene espacio. Y sin embargo, frente a un frasco
                nuevo, el primer pensamiento no es «no entra». Es «¿a qué huele?».
              </p>
              <p>Eso ya dice algo.</p>
              <p>
                No hace falta tener doscientos perfumes para ser coleccionista.
                Alcanza con notar que la pregunta «¿lo necesito?» dejó de ser la
                que realmente se hace antes de comprar uno.
              </p>
            </div>
          </EditorialRow>

          <EditorialRow space="normal">
            <SpecimenSlot
              bleed
              state="pendiente"
              ratio="21 / 9"
              spec="Apertura · reconocimiento. El recorte sale por la derecha porque el estante continúa fuera de la página — no es un hero decorativo. Se sustituye por la fotografía real sin cambiar la caja."
            />
          </EditorialRow>

          <EditorialRow
            space="long"
            rail={<span className="ed-label">La distinción</span>}
            margin={
              <CaptionCredit variant="note">
                Michelyn Camen escribió sobre su propia colección, que ronda los
                600 frascos.
              </CaptionCredit>
            }
          >
            <h2 className="ed-subhead">La distinción que nadie quiere hacer del todo</h2>
            <div className="ed-body" style={{ marginTop: "var(--ed-space-compress)" }}>
              <p>
                Existe una diferencia, al menos en teoría, entre coleccionar y
                acumular. La escritora de perfumería Michelyn Camen lo plantea así
                en un texto sobre su propia colección, que ronda los 600 frascos:
                el acaparador compra por miedo a que algo escasee o desaparezca; el
                coleccionista compra por curiosidad, por el miedo distinto de
                quedarse afuera de algo que todavía no probó.
              </p>
              <p>Es una distinción prolija. Le falta algo.</p>
              <p>
                Porque en la misma nota, Camen admite que también hace{" "}
                <em>stockpiling</em> —guarda de más, por las dudas— y que aun así se
                sigue viendo más como coleccionista que como acaparadora. Si hasta
                ella, con medio siglo de colección encima, necesita hacer ese
                ajuste para quedarse tranquila, la línea entre las dos cosas no es
                tan clara como suena. Es más un relato que nos permitimos que una
                frontera real.
              </p>
              <p>
                Quizás no hace falta resolverlo. Quizás la pregunta interesante no
                es «¿soy coleccionista o acaparo?» sino por qué ese primer frasco
                de más nunca alcanza a ser el último.
              </p>
            </div>
          </EditorialRow>
        </section>

        {/* ================================================= ACTO II · Acumular */}
        <section data-act="Acumular">
          <EditorialRow
            space="long"
            rail={<span className="ed-label">El objeto</span>}
          >
            <h2 className="ed-subhead">El objeto tiene la culpa</h2>
            <div className="ed-body" style={{ marginTop: "var(--ed-space-compress)" }}>
              <p>
                Coleccionar no es una rareza suficiente como para explicar por sí
                sola lo que pasa en ese estante. Una de las ideas que más se repite
                cuando se estudia el coleccionismo es que una colección, casi por
                definición, es un proyecto difícil de terminar: los motivos por los
                que se empieza cambian con la persona, y siempre aparece una razón
                nueva para seguir.
              </p>
              <p>
                Con los perfumes, esto se agrava por un detalle que no tiene el
                sello postal ni la figura de acción: el objeto que se está
                coleccionando se sigue multiplicando activamente mientras uno
                duerme.
              </p>
            </div>
          </EditorialRow>

          <EditorialRow
            space="compress"
            rail={
              <CaptionCredit variant="note" label="Atribución">
                Johanna Monange · fundadora de Maison 21G, exdirectora creativa de
                IFF · citada en <em>Glossy</em>, 2025.
              </CaptionCredit>
            }
            margin={
              <ProportionMarks
                mode="range"
                from={30}
                to={40}
                accent="var(--cx-marino)"
                label="Flankers"
                reading="Estimación de Johanna Monange para grandes marcas: entre el 30 % y el 40 % de la producción. No es una estadística universal de la industria."
              />
            }
          >
            <div className="ed-body">
              <p>
                Los flankers —esas variantes que prolongan un perfume exitoso— no
                son un capricho ocasional de la industria. Johanna Monange,
                fundadora de Maison 21G y exdirectora creativa de IFF, estimó en{" "}
                <em>Glossy</em> que en las grandes marcas pueden representar
                alrededor del 30 al 40 % de la producción, mientras un perfume
                completamente nuevo aparece con mucha menos frecuencia.
              </p>
            </div>
          </EditorialRow>

          <EditorialRow
            space="saturate"
            margin={
              <CaptionCredit variant="note" label="Fuente">
                Dora Baghriche, perfumista principal de dsm-firmenich, en{" "}
                <em>Glossy</em> (2025).
              </CaptionCredit>
            }
          >
            <div className="ed-body">
              <p>
                En la misma pieza, Dora Baghriche, perfumista principal de
                dsm-firmenich, explicó que las marcas quieren que su portafolio sea
                lo bastante completo para alcanzar al mayor número posible de
                consumidores. Dicho de otra forma: cada parte del público que
                todavía no encuentra una versión para sí deja abierta la
                posibilidad de otra.
              </p>
            </div>
          </EditorialRow>

          <EditorialRow
            space="saturate"
            rail={<span className="ed-label">Le Male · desde 1995</span>}
          >
            <div className="ed-body">
              <p>
                Le Male de Jean Paul Gaultier, lanzado en 1995, sigue acompañado
                por una familia que cambia y crece. En la gama oficial convive hoy
                con Le Male Le Parfum, Le Male Elixir y Le Male Elixir Absolu, entre
                otras variantes y ediciones. Ninguno de esos frascos existía cuando
                se compró el primero. El «último Le Male» nunca fue una promesa
                real — fue, como mucho, una pausa.
              </p>
            </div>
            <div style={{ marginTop: "var(--ed-space-compress)" }}>
              <SerialField />
              <CaptionCredit variant="note" label="Lo que muestra">
                La primera banda son nombres actuales verificados de la línea. Las
                líneas vacías representan continuidad, no lanzamientos contados.
              </CaptionCredit>
            </div>
          </EditorialRow>
        </section>

        {/* ================================================ ACTO III · Conservar */}
        <ArchiveSurface data-act="Conservar">
          <EditorialRow
            rail={
              <CaptionCredit variant="note" label="2010">
                Año de lanzamiento de Aventus según el sitio oficial de Creed.
              </CaptionCredit>
            }
            margin={
              <TimeRuler
                startLabel="2010"
                endLabel="hoy"
                honestyNote="Las marcas intermedias indican paso del tiempo; no representan reformulaciones fechadas."
              />
            }
          >
            <h2 className="ed-subhead">El otro miedo: que se termine de verdad</h2>
            <div className="ed-body" style={{ marginTop: "var(--ed-space-compress)" }}>
              <p>
                Hay una segunda razón para acumular, y es casi la opuesta a la
                anterior. No es «quiero probar lo nuevo». Es «tengo miedo de que
                dejen de hacer lo que ya amo».
              </p>
              <p>
                Las reformulaciones y las descontinuaciones son reales, y el
                mercado de reventa de perfumes vintage creció justamente sobre ese
                miedo —gente comprando frascos de hace veinte años, de marcas de
                lujo y también de marcas de shopping que nadie tomaba en serio
                hasta que dejaron de existir—. Aventus, de Creed, lanzado en 2010,
                es uno de los nombres alrededor de los que más se discuten
                versiones y cambios a lo largo del tiempo en comunidades de
                perfumería. Comprar un segundo frasco de algo que se ama no es
                redundancia. Es una apuesta contra el tiempo.
              </p>
            </div>
          </EditorialRow>

          <EditorialRow space="compress" rail={<span className="ed-label">El gesto</span>}>
            <p className="cx-verbs">
              usar <span aria-hidden="true">→</span> guardar{" "}
              <span aria-hidden="true">→</span> guardar otro
            </p>
            <div className="ed-body" style={{ marginTop: "var(--ed-space-compress)" }}>
              <p>
                Así que el coleccionista no está atrapado entre dos impulsos raros.
                Está atrapado entre dos miedos razonables: quedarse afuera de lo
                nuevo, y perder lo de siempre. Ambos, al mismo tiempo, garantizan
                que nunca haya un punto final.
              </p>
            </div>
          </EditorialRow>
        </ArchiveSurface>

        {/* =================================================== ACTO IV · Soltar */}
        <section data-act="Soltar" className="cx-release">
          <div className="ed-container">
            <EditorialRow bare>
              <p className="cx-release-title">Sí, pero</p>
              <div className="cx-release-body" style={{ marginTop: "var(--ed-space-normal)" }}>
                <p>
                  Todo esto puede sonar a una explicación demasiado generosa de por
                  qué el estante no cierra.
                </p>
                <p>
                  A veces no hay ningún miedo filosófico de por medio. A veces es
                  simplemente que olió bien en la muestra, estaba en oferta, y ya.
                </p>
                <p>
                  No hace falta convertir cada frasco de más en una tesis sobre la
                  memoria y el deseo. A veces uno solo quiere otro perfume.
                </p>
              </div>
            </EditorialRow>
          </div>
        </section>

        {/* ==================================================== ACTO V · Cerrar */}
        <section data-act="Cerrar">
          <EditorialRow space="long">
            <div className="ed-body">
              <p>
                Pero la próxima vez que aparezca un frasco que técnicamente no
                hacía falta, quizás valga la pena notar cuál de los dos miedos lo
                movió: el de perderse algo que todavía no existe, o el de perder
                algo que ya se tiene.
              </p>
              <p>
                Ninguna de las dos respuestas es vergonzosa. Las dos, eso sí,
                aseguran que haya un frasco más después de este.
              </p>
            </div>
          </EditorialRow>

          <EditorialRow space="normal" rail={<span className="cx-signature">A.</span>}>
            <p className="ed-note">
              Reflexión editorial de Aromia. Los enlaces de compra dirigen a
              retailers autorizados y están señalados como tales.
            </p>
          </EditorialRow>
        </section>

        <ContextualClose
          references={[
            {
              name: "Le Male",
              house: "Jean Paul Gaultier",
              reason:
                "Aparece como el ejemplo de una familia que no deja de extenderse: cuando se compró el primero, ninguna de sus variantes actuales existía.",
              actionLabel: "Ver opciones disponibles",
              href: "https://www.amazon.com/dp/B0733677R6?tag=aromialab-20",
            },
            {
              name: "Aventus",
              house: "Creed",
              reason:
                "Aparece en el pasaje sobre conservación: uno de los perfumes alrededor de los que más se discuten versiones y cambios con el tiempo.",
              actionLabel: "Encontrarla",
              href: "https://www.amazon.com/dp/B071CYS5ZZ?tag=aromialab-20",
            },
          ]}
        />
      </main>
    </div>
  );
}
