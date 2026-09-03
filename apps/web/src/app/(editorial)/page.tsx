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
const counterpoints = [
  coverStory("el-ambar-que-nunca-toco-una-ballena"),
  coverStory("el-perfumista-que-no-teme-exagerar"),
];

const DISCOVERY_FAMILIES = ["Cítrica", "Floral", "Amaderada", "Ámbar", "Chipre"];

export default function EditorialHome() {
  return (
    <main className="ev1">
      <section className="ev1-lead" id="historias">
        <div className="ev1-lead-copy">
          <p className="ev1-kicker">{lead.kicker}</p>
          <h1>{lead.title}</h1>
          <p className="ev1-deck">
            En 1982, un perfumista francés subió a un avión rumbo a Mascate. No
            iba de vacaciones. Iba a componer un perfume por encargo directo de
            un sultán.
          </p>
          <Link className="ev1-read" href={lead.href}>
            Leer historia <span>→</span>
          </Link>
        </div>
        <VisualField
          slotId={lead.slot}
          className="ev1-resin"
          sizes="(max-width: 800px) 100vw, 60vw"
        />
      </section>

      <section className="ev1-counterpoints" aria-label="Historias destacadas">
        {counterpoints.map((s) => (
          <article className={`ev1-story ${s.tone}`} key={s.slug}>
            <VisualField
              slotId={s.slot}
              className="ev1-material"
              sizes="(max-width: 800px) 100vw, 58vw"
            />
            <div className="ev1-story-copy">
              <p className="ev1-kicker">{s.kicker}</p>
              <h2>{s.title}</h2>
              <p>{s.summary}</p>
              <Link className="ev1-read" href={s.href}>
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
        <ul className="ev1-thinking-families" aria-label="Empezar por una familia">
          {DISCOVERY_FAMILIES.map((family) => (
            <li key={family}>
              <Link href={`/buscar?q=${encodeURIComponent(family.toLowerCase())}`}>
                {family}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/descubrir" className="ev1-read">
          Explorar Discovery <span>→</span>
        </Link>
      </section>
    </main>
  );
}
