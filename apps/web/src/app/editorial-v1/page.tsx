import Link from "next/link";
import "./editorial-v1.css";
import { VisualField } from "./editorialV1Visuals";

const stories = [
  {
    kicker: "Materia",
    title: "El ámbar que nunca tocó una ballena",
    slug: "el-ambar-que-nunca-toco-una-ballena",
    tone: "mineral",
    slot: "ambroxan-material-interpretive",
    note: "Una molécula familiar cuya historia empieza con una rareza del mar y termina en una hoja de salvia.",
  },
  {
    kicker: "Personas",
    title: "El perfumista que no teme exagerar",
    slug: "el-perfumista-que-no-teme-exagerar",
    tone: "ropion",
    slot: "ropion-overdose-interpretive",
    note: "Dominique Ropion y el arte de llevar las flores hasta el límite sin perder precisión.",
  },
];

export default function EditorialV1Page() {
  return (
    <main className="ev1">
      <header className="ev1-nav">
        <Link href="/" className="ev1-brand">
          AROMIA
        </Link>
        <nav aria-label="Navegación editorial">
          <a href="#historias">Historias</a>
          <a href="#perfumes">Perfumes</a>
          <a href="#materia">Materia</a>
          <a href="#personas">Personas</a>
          <a href="#saber">Saber</a>
          <a href="#discovery">Discovery</a>
        </nav>
        <Link href="/buscar" aria-label="Buscar">
          ⌕
        </Link>
      </header>

      <section className="ev1-lead" id="historias">
        <div className="ev1-lead-copy">
          <p className="ev1-kicker">Fuera del radar · Historias</p>
          <h1>
            El perfume que
            <br />
            encargó un sultán
          </h1>
          <p className="ev1-deck">
            En 1982, un perfumista francés subió a un avión rumbo a Mascate. No
            iba de vacaciones. Iba a componer un perfume por encargo directo de
            un sultán.
          </p>
          <Link
            className="ev1-read"
            href="/editorial-v1/el-perfume-que-encargo-un-sultan"
          >
            Leer historia <span>→</span>
          </Link>
        </div>
        <VisualField
          slotId="amouage-material-density-interpretive"
          className="ev1-resin"
          marker="RESINA · TERRITORIO · ENCUENTRO"
          sizes="(max-width: 800px) 100vw, 60vw"
        />
      </section>

      <section className="ev1-counterpoints" aria-label="Historias destacadas">
        {stories.map((s) => (
          <article className={`ev1-story ${s.tone}`} key={s.slug}>
            <VisualField
              slotId={s.slot}
              className="ev1-material"
              sizes="(max-width: 800px) 100vw, 50vw"
            />
            <div className="ev1-story-copy">
              <p className="ev1-kicker">{s.kicker}</p>
              <h2>{s.title}</h2>
              <p>{s.note}</p>
              <Link className="ev1-read" href={`/editorial-v1/${s.slug}`}>
                Leer historia <span>→</span>
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="ev1-thinking" id="discovery">
        <p className="ev1-kicker">Discovery</p>
        <p className="ev1-question">¿Qué te mueve cuando eliges un perfume?</p>
        <p>
          No empezamos por notas ni por una lista de productos. Empezamos por la
          sensación que intentas encontrar.
        </p>
        <Link href="/descubrir" className="ev1-read">
          Explorar <span>→</span>
        </Link>
      </section>

      <footer className="ev1-footer">
        <span>AROMIA</span>
        <p>Una fragancia, una historia.</p>
        <small>Materias e historias, con contexto</small>
      </footer>
    </main>
  );
}
