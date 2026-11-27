import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { EditorialImage } from "@/components/editorial/EditorialImage";
import "./editorial.css";
import "./home-story-rhythm.css";
import { VisualField, visualCredit } from "./editorialVisuals";
import { EDITORIAL_STORIES } from "@/lib/editorialIndex";
import { LandingHero } from "@/components/home/LandingHero";

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
      <LandingHero />

      <section className="ev1-cover-supporting" aria-label="Historias destacadas">
        <article className="ev1-cover-feature ev1-cover-feature--person" data-depth-reveal>
          <div className="ev1-cover-media-shell ev1-cover-media-shell--portrait">
            <EditorialImage
              src="/editorial-v1/red-rose-interpretive.jpg"
              alt="Una rosa rojo profundo, imagen editorial del volumen floral asociado a Dominique Ropion."
              className="ev1-cover-media"
              sizes="(max-width: 800px) 100vw, 52vw"
            />

            <p className="ev1-cover-media-credit">{visualCredit(personStory.slot)}</p>
          </div>
          <div className="ev1-cover-feature-copy ev1-cover-feature-copy--person">
            <div className="ev1-cover-feature-meta">
              <span>{personStory.kicker}</span>
            </div>
            <h2>
              <Link className="ev1-story-link" href={personStory.href}>
                {personStory.title}
              </Link>
            </h2>
            <p>{personStory.summary}</p>
            <Link className="ev1-read" href={personStory.href} aria-label={`Leer «${personStory.title}»`}>
              Leer historia <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
        <article className="ev1-cover-feature ev1-cover-feature--material" data-depth-reveal>
          <div className="ev1-cover-feature-copy">
            <div className="ev1-cover-feature-meta">
              <span>{materialStory.kicker}</span>
            </div>
            <h2>
              <Link className="ev1-story-link" href={materialStory.href}>
                {materialStory.title}
              </Link>
            </h2>
            <p>{materialStory.summary}</p>
            <Link className="ev1-read" href={materialStory.href} aria-label={`Leer «${materialStory.title}»`}>
              Leer historia <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="ev1-cover-media-shell ev1-cover-media-shell--wide">
            <Image src="/editorial-v1/clary-sage-herbarium.jpg" width={801} height={1200}
              sizes="(max-width: 800px) 66vw, 30vw" className="ev1-cover-herbarium"
              alt="Lámina botánica histórica de Salvia sclarea: hojas, flores y semillas." />
            <p className="ev1-cover-media-credit">Salvia sclarea · Jacob Sturm, 1796 · Dominio público</p>
          </div>
        </article>

      </section>

      <article className="cover-dispatch" id="historias" data-depth-reveal>
        <div className="cover-dispatch-heading">
          <p className="cover-eyebrow">Fuera del radar · Omán</p>
          <h2><Link className="ev1-story-link" href={lead.href}>{lead.title}</Link></h2>
          <p>En 1982, un perfumista francés subió a un avión rumbo a Mascate.</p>
          <Link className="ev1-read" href={lead.href}>Leer historia <ArrowUpRight aria-hidden="true" size={22} strokeWidth={1.4} /></Link>
        </div>
        <div>
          <VisualField slotId={lead.slot} className="ev1-cover-media" sizes="(max-width: 700px) 100vw, 70vw" />
          <p className="ev1-cover-media-credit">{visualCredit(lead.slot)}</p>
        </div>
      </article>

      <section className="ev1-cover-discovery" id="discovery" aria-labelledby="cover-discovery-title" data-depth-reveal>
        <div>
          <h2 id="cover-discovery-title" className="ev1-question">¿Qué te mueve cuando eliges un perfume?</h2>
          <p className="ev1-cover-discovery-copy">
            Puedes entrar por una familia
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
            Abrir Discovery <span aria-hidden="true">→</span>
          </Link>
        </div>
        <aside className="ev1-cover-marginalia" aria-label="Dos materias para explorar">
          <figure data-tilt>
            <Link href="/descubrir/familias/citrica" aria-label="Explorar la familia cítrica">
              <Image src="/editorial-v1/bergamot-editorial-v2.webp" width={640} height={640} sizes="(max-width: 800px) 38vw, 15vw" alt="Estudio reinterpretado de una bergamota verde: luz lateral y textura de la cáscara." />
            </Link>
            <figcaption><em>Bergamota</em><span>Adaptación digital a partir de <a href="https://commons.wikimedia.org/wiki/File:Bergamotfruit.jpg">Xenocryst / Antares Scorpii</a> · <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a></span></figcaption>
          </figure>
          <figure data-tilt>
            <Link href="/descubrir/familias/ambar-oriental" aria-label="Explorar la familia ámbar">
              <Image src="/editorial-v1/frankincense-documentary.jpg" width={1920} height={1440} sizes="(max-width: 800px) 38vw, 15vw" alt="Detalle documental de resina de Boswellia sacra en la corteza." />
            </Link>
            <figcaption><em>Incienso</em><span><a href="https://commons.wikimedia.org/wiki/File:Boswellia_sacra_kz05.jpg">Krzysztof Ziarnek</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a></span></figcaption>
          </figure>
        </aside>
      </section>
    </main>
  );
}
