import type { Metadata } from "next";
import Link from "next/link";
import "./editorial.css";
import "./home-story-rhythm.css";
import { VisualField } from "./editorialVisuals";
import { EDITORIAL_STORIES } from "@/lib/editorialIndex";

export const metadata: Metadata = {
  title: { absolute: "Aromia — Una fragancia, una historia" },
  description:
    "Revista de perfumería: las materias, las historias y las personas detrás de las fragancias.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Aromia — Una fragancia, una historia",
    description:
      "Revista de perfumería: las materias, las historias y las personas detrás de las fragancias.",
    type: "website",
  },
};

const HOME_PRESENTATION: Record<string, { kicker: string; tone: string; slot: string }> = {
  "el-perfume-que-encargo-un-sultan": {
    kicker: "Fuera del radar · Historias",
    tone: "amouage",
    slot: "amouage-material-density-interpretive",
  },
  "el-ambar-que-nunca-toco-una-ballena": {
    kicker: "Materia",
    tone: "mineral",
    slot: "ambroxan-material-interpretive",
  },
  "el-perfumista-que-no-teme-exagerar": {
    kicker: "Personas",
    tone: "ropion",
    slot: "ropion-overdose-interpretive",
  },
};

function coverStory(slug: string) {
  const entry = EDITORIAL_STORIES.find((story) => story.slug === slug);
  if (!entry) throw new Error("Editorial story not indexed: " + slug);
  return { ...entry, ...HOME_PRESENTATION[slug] };
}

const lead = coverStory("el-perfume-que-encargo-un-sultan");
const materialStory = coverStory("el-ambar-que-nunca-toco-una-ballena");
const personStory = coverStory("el-perfumista-que-no-teme-exagerar");

const SECTION_INDEX = [
  {
    number: "01",
    label: "Historias",
    copy: "Ensayos, materias y relatos que empiezan por una pregunta.",
    href: "/magazine",
  },
  {
    number: "02",
    label: "Saber",
    copy: "Una base clara para entender estructura, familias y concentración.",
    href: "/academia",
  },
  {
    number: "03",
    label: "Personas",
    copy: "Las autorías detrás de las fragancias y las obras revisadas.",
    href: "/perfumistas",
  },
  {
    number: "04",
    label: "Discovery",
    copy: "Explora familias, subfamilias, materias y caminos olfativos.",
    href: "/descubrir",
  },
] as const;

const DISCOVERY_FAMILIES = [
  ["Cítrica", "citrica"],
  ["Floral", "floral"],
  ["Amaderada", "amaderada"],
  ["Ámbar", "ambar-oriental"],
  ["Chipre", "chipre"],
] as const;

export default function EditorialHome() {
  return (
    <main className="ev1 ev1-cover">
      <section className="ev1-cover-masthead" aria-labelledby="cover-title">
        <div className="ev1-cover-masthead-mark">
          <p className="ev1-kicker">Aromia · Edición actual</p>
          <p className="ev1-cover-folio">Revista de perfumería</p>
        </div>
        <div>
          <h1 id="cover-title" className="ev1-cover-title">
            Perfume, materia y personas.
          </h1>
        </div>
        <p className="ev1-cover-intro">
          Una portada para entrar por curiosidad, no por catálogo. Cada historia
          abre una ruta distinta dentro del mismo mundo.
        </p>
      </section>

      <section className="ev1-cover-lead" id="historias" aria-label="Historia principal">
        <div className="ev1-cover-lead-index" aria-hidden="true">
          <span>Portada</span>
          <strong>01</strong>
        </div>

        <div className="ev1-cover-media-shell">
          <VisualField
            slotId={lead.slot}
            className="ev1-resin ev1-cover-media"
            sizes="(max-width: 800px) 100vw, 58vw"
          />
          <p className="ev1-cover-media-note">Mascate · Omán · 1982</p>
        </div>

        <div className="ev1-cover-lead-copy">
          <p className="ev1-kicker">{lead.kicker}</p>
          <h2>{lead.title}</h2>
          <p className="ev1-deck">
            En 1982, un perfumista francés subió a un avión rumbo a Mascate. No
            iba de vacaciones. Iba a componer un perfume por encargo directo de
            un sultán.
          </p>
          <Link className="ev1-read" href={lead.href}>
            Leer historia <span>→</span>
          </Link>
        </div>
      </section>

      <section className="ev1-cover-supporting" aria-label="Historias destacadas">
        <article className="ev1-cover-feature ev1-cover-feature--material">
          <div className="ev1-cover-feature-copy">
            <div className="ev1-cover-feature-meta">
              <span>02</span>
              <span>{materialStory.kicker}</span>
            </div>
            <h2>{materialStory.title}</h2>
            <p>{materialStory.summary}</p>
            <Link className="ev1-read" href={materialStory.href}>
              Leer historia <span>→</span>
            </Link>
          </div>
          <div className="ev1-cover-media-shell ev1-cover-media-shell--wide">
            <VisualField
              slotId={materialStory.slot}
              className="ev1-material ev1-cover-media"
              sizes="(max-width: 800px) 100vw, 62vw"
            />
            <p className="ev1-cover-media-note">Materia · origen · transformación</p>
          </div>
        </article>

        <article className="ev1-cover-feature ev1-cover-feature--person">
          <div className="ev1-cover-media-shell ev1-cover-media-shell--portrait">
            <VisualField
              slotId={personStory.slot}
              className="ev1-material ev1-cover-media"
              sizes="(max-width: 800px) 100vw, 38vw"
            />
            <p className="ev1-cover-media-note">Dominique Ropion · intensidad y precisión</p>
          </div>
          <div className="ev1-cover-feature-copy ev1-cover-feature-copy--person">
            <div className="ev1-cover-feature-meta">
              <span>03</span>
              <span>{personStory.kicker}</span>
            </div>
            <h2>{personStory.title}</h2>
            <p>{personStory.summary}</p>
            <Link className="ev1-read" href={personStory.href}>
              Leer historia <span>→</span>
            </Link>
          </div>
        </article>
      </section>

      <section className="ev1-cover-index" aria-labelledby="cover-index-title">
        <div className="ev1-cover-index-heading">
          <p className="ev1-kicker">Índice</p>
          <h2 id="cover-index-title">Cuatro puertas de entrada.</h2>
        </div>
        <div className="ev1-cover-index-list">
          {SECTION_INDEX.map((item) => (
            <Link key={item.href} href={item.href} className="ev1-cover-index-item">
              <span className="ev1-cover-index-number">{item.number}</span>
              <span className="ev1-cover-index-label">{item.label}</span>
              <span className="ev1-cover-index-copy">{item.copy}</span>
              <span className="ev1-cover-index-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="ev1-thinking ev1-cover-discovery" id="discovery">
        <p className="ev1-kicker">Discovery</p>
        <div>
          <p className="ev1-question">¿Qué te mueve cuando eliges un perfume?</p>
          <p className="ev1-cover-discovery-copy">
            No empezamos por una lista de productos. Puedes entrar por una familia
            y seguir desde ahí hacia materias, fragancias, personas e historias.
          </p>
          <ul className="ev1-thinking-families" aria-label="Empezar por una familia">
            {DISCOVERY_FAMILIES.map(([family, slug]) => (
              <li key={slug}>
                <Link href={`/descubrir/familias/${slug}`}>{family}</Link>
              </li>
            ))}
          </ul>
          <Link href="/descubrir" className="ev1-read">
            Abrir Discovery <span>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
