import type { Metadata } from "next";
import Link from "next/link";
import "../../editorial.css";
import "./coleccionista.css";
import { VisualField } from "../../editorialVisuals";

const SLUG = "el-coleccionista";
const TITLE = "El coleccionista";
const DECK =
  "Hay un cajón, un estante o una repisa de baño en algún lugar de la casa que ya no tiene espacio. Y sin embargo, frente a un frasco nuevo, el primer pensamiento no es «no entra». Es «¿a qué huele?».";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Aromia` },
  description:
    "No hace falta tener doscientos perfumes para ser coleccionista. Alcanza con notar que la pregunta «¿lo necesito?» dejó de ser la que uno realmente se hace antes de comprar uno.",
  alternates: { canonical: `/historias/${SLUG}` },
  openGraph: { title: TITLE, description: DECK, type: "article" },
};

export default function ElColeccionista() {
  return (
    <main className="ev1 coll">
      <header className="ev1-nav">
        <Link href="/" className="ev1-brand">
          AROMIA
        </Link>
        <nav>
          <Link href="/">Portada</Link>
          <span>Perfume como puerta</span>
        </nav>
        <Link href="/buscar" aria-label="Buscar">
          ⌕
        </Link>
      </header>

      <article>
        {/* 1 · Recognition — asymmetric opening */}
        <header className="coll-open">
          <div className="coll-open-copy">
            <p className="ev1-kicker">Perfume como puerta · Reflexión</p>
            <h1>{TITLE}</h1>
            <p className="coll-deck">{DECK}</p>
          </div>
          <VisualField
            slotId="coleccionista-shelf-interpretive"
            className="coll-shelf"
            marker="ESTANTE · SIN ESPACIO · APERTURA"
            sizes="(max-width: 800px) 100vw, 48vw"
          />
        </header>

        {/* first silence — let one line land alone */}
        <div className="coll-intro">
          <p className="coll-alone">Eso ya dice algo.</p>
          <p>
            No hace falta tener doscientos perfumes para ser coleccionista.
            Alcanza con notar que la pregunta «¿lo necesito?» dejó de ser la que
            realmente se hace antes de comprar uno.
            <span className="coll-tick" aria-hidden="true">
              ·
            </span>
          </p>
        </div>

        {/* 2 · La distinción — primarily typographic */}
        <section className="coll-section">
          <p className="coll-rail" aria-hidden="true">
            {"01\n·"}
          </p>
          <div className="coll-body">
            <h2>La distinción que nadie quiere hacer del todo</h2>
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
              <em>stockpiling</em> — guarda de más, por las dudas — y que aun así
              se sigue viendo más como coleccionista que como acaparadora. Si
              hasta ella, con medio siglo de colección encima, necesita hacer ese
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
          <p className="coll-note">Michelyn Camen, sobre su propia colección.</p>
        </section>

        {/* 3 · El objeto tiene la culpa — density begins */}
        <section className="coll-section multiplying">
          <p className="coll-rail" aria-hidden="true">
            {"02\n·\n·\n· ·\n· · ·"}
          </p>
          <div className="coll-body">
            <h2>El objeto tiene la culpa</h2>
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
            <p>
              Los flankers —esas variantes que prolongan un perfume exitoso— no
              son un capricho ocasional de la industria. Johanna Monange,
              fundadora de Maison 21G y exdirectora creativa de IFF, estimó en{" "}
              <em>Glossy</em> que en las grandes marcas pueden representar
              alrededor del 30 al 40% de la producción, mientras un perfume
              completamente nuevo aparece con mucha menos frecuencia.
            </p>
            <p>
              En la misma pieza, Dora Baghriche, perfumista principal de
              dsm-firmenich, explicó que las marcas quieren que su portafolio sea
              lo bastante completo para alcanzar al mayor número posible de
              consumidores. Dicho de otra forma: cada parte del público que
              todavía no encuentra una versión para sí deja abierta la
              posibilidad de otra.
            </p>
            <p>
              Le Male de Jean Paul Gaultier, lanzado en 1995, sigue acompañado
              por una familia que cambia y crece. En la gama oficial convive hoy
              con Le Male Le Parfum, Le Male Elixir y Le Male Elixir Absolu, entre
              otras variantes y ediciones. Ninguno de esos frascos existía cuando
              se compró el primero. El «último Le Male» nunca fue una promesa
              real — fue, como mucho, una pausa.
            </p>
          </div>

          {/* Le Male lineage — typographic (Asset B fallback, approved as stronger) */}
          <figure className="coll-lineage">
            <h3>Le Male · Jean Paul Gaultier — la familia sin punto final</h3>
            <ol>
              <li>
                <span className="yr">1995</span>
                <span>Le Male</span>
              </li>
              <li>
                <span className="yr">·</span>
                <span>Le Male Le Parfum</span>
              </li>
              <li>
                <span className="yr">·</span>
                <span>Le Male Elixir</span>
              </li>
              <li>
                <span className="yr">·</span>
                <span>Le Male Elixir Absolu</span>
              </li>
              <li>
                <span className="yr">…</span>
                <span>la gama oficial sigue sumando variantes</span>
              </li>
            </ol>
            <figcaption>
              Selección mínima de la gama oficial vigente (jeanpaulgaultier.com,
              2026), no la grilla completa. Sin fechas de flanker verificadas: se
              listan por nombre.
            </figcaption>
          </figure>
        </section>

        {/* abrupt whitespace transition: multiplication → scarcity */}
        <div className="coll-gap" aria-hidden="true">
          <hr />
        </div>

        {/* 4 · El otro miedo — steel-gray register, layout only */}
        <section className="coll-section preserving">
          <p className="coll-rail" aria-hidden="true">
            {"03\n·"}
          </p>
          <div className="coll-body">
            <h2>El otro miedo: que se termine de verdad</h2>
            <p>
              Hay una segunda razón para acumular, y es casi la opuesta a la
              anterior. No es «quiero probar lo nuevo». Es «tengo miedo de que
              dejen de hacer lo que ya amo».
            </p>
            <p>
              Las reformulaciones y las descontinuaciones son reales, y el
              mercado de reventa de perfumes vintage creció justamente sobre ese
              miedo — gente comprando frascos de hace veinte años, de marcas de
              lujo y también de marcas de shopping que nadie tomaba en serio
              hasta que dejaron de existir. Aventus, de Creed, lanzado en 2010,
              es uno de los nombres alrededor de los que más se discuten
              versiones y cambios a lo largo del tiempo en comunidades de
              perfumería. Comprar un segundo frasco de algo que se ama no es
              redundancia. Es una apuesta contra el tiempo.
            </p>
            <p>
              Así que el coleccionista no está atrapado entre dos impulsos raros.
              Está atrapado entre dos miedos razonables: quedarse afuera de lo
              nuevo, y perder lo de siempre. Ambos, al mismo tiempo, garantizan
              que nunca haya un punto final.
            </p>
          </div>
          <div className="coll-timenote">
            <ul>
              <li>lo que uso</li>
              <li>lo que guardo</li>
              <li>lo que recuerdo</li>
            </ul>
            <small>Notación interpretativa.</small>
          </div>
          <p className="coll-converge" aria-hidden="true">
            <span>lo próximo</span>
            <span />
            <span>lo último</span>
          </p>
        </section>

        {/* 5 · Sí, pero — hard reset: no number, no ticks, no image */}
        <section className="coll-reset">
          <h2>Sí, pero</h2>
          <p>
            Todo esto puede sonar a una explicación demasiado generosa de por qué
            el estante no cierra.
          </p>
          <p>
            A veces no hay ningún miedo filosófico de por medio. A veces es
            simplemente que olió bien en la muestra, estaba en oferta, y ya.
          </p>
          <p className="coll-breath">
            No hace falta convertir cada frasco de más en una tesis sobre la
            memoria y el deseo. A veces uno solo quiere otro perfume.
          </p>
          <p>
            Pero la próxima vez que aparezca un frasco que técnicamente no hacía
            falta, quizás valga la pena notar cuál de los dos miedos lo movió: el
            de perderse algo que todavía no existe, o el de perder algo que ya se
            tiene.
          </p>
          <p>
            Ninguna de las dos respuestas es vergonzosa. Las dos, eso sí,
            aseguran que haya un frasco más después de este.
          </p>
        </section>

        {/* commerce close — contextual footnotes, affiliation disclosed */}
        <section className="coll-commerce" aria-label="Enlaces de afiliado">
          <p className="coll-commerce-note">
            Nota: reflexión editorial de Aromia. Los enlaces de compra dirigen a
            retailers autorizados y son enlaces de afiliado.
          </p>
          <ul>
            <li>
              <a
                href="https://www.amazon.com/dp/B0733677R6?tag=aromialab-20"
                rel="sponsored nofollow"
              >
                Le Male de Jean Paul Gaultier
              </a>{" "}
              — aparece como ejemplo de una familia que no deja de extenderse.
            </li>
            <li>
              <a
                href="https://www.amazon.com/dp/B071CYS5ZZ?tag=aromialab-20"
                rel="sponsored nofollow"
              >
                Aventus de Creed
              </a>{" "}
              — aparece en el pasaje sobre conservación, versiones y miedo a
              perder lo que ya se ama.
            </li>
          </ul>
        </section>

        <aside className="coll-close">
          <p className="ev1-kicker">Seguir explorando</p>
          <p>
            El perfume puede ser el final de una compra. Aquí preferimos que sea
            el principio de otra pregunta.
          </p>
          <Link href="/" className="ev1-read">
            Volver a la portada →
          </Link>
        </aside>
      </article>
    </main>
  );
}
