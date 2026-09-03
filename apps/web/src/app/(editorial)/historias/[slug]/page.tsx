import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import "../../editorial.css";
import "./story.css";
import { VisualField } from "../../editorialVisuals";
import { EDITORIAL_STORIES } from "@/lib/editorialIndex";

interface StorySection {
  h: string;
  paras: string[];
  /** Gate 3 visual slot rendered after the section body, if any */
  slot?: string;
  slotClass?: string;
}

interface Story {
  serie: string;
  territory: string;
  title: string;
  deck: string;
  intro: string[];
  heroSlot: string;
  sections: StorySection[];
  commerceNote: string;
  commerce: { label: string; href: string; note: string }[];
}

const ROPION_MATERIALS = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Red_rose_close-up.jpg",
    alt: "Primer plano documental de una rosa roja.",
    width: 2160,
    height: 1440,
    caption: "Rosa. Foto: Vatadoshu Phyto, Wikimedia Commons, CC0 1.0.",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Patchouli.jpg",
    alt: "Planta de pachulí, Pogostemon cablin, fotografiada en Seychelles.",
    width: 640,
    height: 427,
    caption: "Pachulí (Pogostemon cablin). Foto: Joe Laurence / Seychelles News Agency, CC BY 4.0.",
  },
] as const;

function RopionMaterialDiptych() {
  return (
    <div className="ropion-material-diptych" aria-label="Referencias documentales de rosa y pachulí">
      {ROPION_MATERIALS.map((material) => (
        <figure key={material.src}>
          <Image
            src={material.src}
            alt={material.alt}
            width={material.width}
            height={material.height}
            sizes="(max-width: 800px) 100vw, 24vw"
            unoptimized
          />
          <figcaption>{material.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function RopionOmissionPause() {
  return (
    <aside className="ropion-omission-pause" aria-label="Materiales omitidos de la fórmula">
      <p className="ropion-omission-label">La decisión también fue quitar.</p>
      <div className="ropion-omission-terms">
        <span>Hedione</span>
        <span>Iso E Super</span>
      </div>
      <p>
        No porque fueran malos materiales, sino porque esa fórmula concreta no los necesitaba.
      </p>
    </aside>
  );
}

const data: Record<string, Story> = {
  "el-ambar-que-nunca-toco-una-ballena": {
    serie: "Materia",
    territory: "Materia",
    title: "El ámbar que nunca tocó una ballena",
    deck: `Casi cualquier perfume ambarado que alguien haya olido en los últimos treinta años contiene una molécula que no viene del mar, no viene de un animal y, en sentido estricto, tampoco viene del ámbar.`,
    intro: [
      `Se llama ambroxan. Y antes de tener ese nombre, existía un problema.`,
    ],
    heroSlot: "ambroxan-material-interpretive",
    sections: [
      {
        h: "El problema tenía forma de ballena",
        paras: [
          `El ámbar gris de verdad no sale de un árbol resinoso, como sugiere el nombre. Sale del intestino del cachalote — una secreción que el animal produce, a veces, para proteger sus órganos de los picos duros de calamar que no puede digerir. Ese material puede flotar durante años, curarse al sol y al agua salada, y aparecer varado en una playa con un olor que ningún laboratorio había logrado imitar del todo: salino, animal, cálido, capaz de hacer que todo lo demás en un perfume dure más y huela mejor sin robarle protagonismo a nada.`,
          `El problema es evidente apenas se lo piensa dos segundos. No se puede construir una industria entera sobre la esperanza de que un cachalote tenga una mala digestión y que la corriente correcta empuje el resultado hasta una playa correcta. Durante siglos, esa fue, literalmente, la cadena de suministro.`,
        ],
      },
      {
        h: "Una hoja de salvia, no un océano",
        slot: "clary-sage-documentary",
        slotClass: "story-interruption",
        paras: [
          `En 1946, en Zúrich, el químico Leopold Ružička y Fernand Lardon aislaron ambreína, la molécula responsable de buena parte de ese olor tan particular. Identificar el compuesto es una cosa. Fabricarlo sin depender de un cachalote es otra completamente distinta — y esa segunda parte tardó unos años más en resolverse.`,
          `La respuesta llegó, en 1950, desde un lugar bastante menos exótico que el fondo del mar: la salvia romana. Químicos de Firmenich, en Ginebra, lograron sintetizar la molécula a partir del esclareol, un compuesto que se extrae de esa planta. Se presentó la patente. La producción podía empezar a escala, con calidad consistente, sin ningún océano involucrado.`,
          `Todavía faltaba una confirmación incómoda. No fue hasta 1977 que estudios cromatográficos de químicos de IFF terminaron de establecer algo que cambia la manera de contar toda esta historia: el aroma característico del ámbar gris envejecido no era, como se asumía, una mezcla compleja de muchos compuestos trabajando juntos. Era, abrumadoramente, esa única molécula.`,
          `Dicho de otro modo: durante décadas, la perfumería persiguió un aroma "complejo" que en realidad dependía casi por completo de una sola pieza. Encontrar esa pieza y aprender a fabricarla no fue un atajo hacia el ámbar gris. Fue, en los hechos, encontrarlo.`,
        ],
      },
      {
        h: "Lo que cuesta no depender de una ballena",
        paras: [
          `El ámbar gris natural, cuando aparece, se cotiza por encima de los 40.000 euros el kilogramo — cuando aparece, porque su disponibilidad siempre dependió de una cadena de eventos que nadie controla. La ruta sintética, derivada de una planta que se cultiva a propósito, bajó ese costo a unos pocos cientos de euros por kilogramo.`,
          `Eso no es solamente una historia de ahorro. Es la diferencia entre un ingrediente que existe si el mar decide entregarlo y un ingrediente que existe porque alguien lo cultivó, lo procesó y lo puso en un frasco. La ética de no depender de un subproducto de cetáceos importa, pero probablemente importó menos, en su momento, que la certeza de tener siempre la misma cantidad, del mismo material, al mismo precio.`,
          `Hoy la molécula circula bajo varios nombres según quién la fabrica — Ambrofix, Ambermor, Ambrox Super, Ambroxide, Orcanox — cada casa con su propia ruta de síntesis, algunas incluso biotecnológicas, a partir de caña de azúcar. El resultado que le llega a la nariz es, en esencia, el mismo.`,
        ],
      },
      {
        h: "Cuando alguien decide mostrar la molécula sola",
        paras: [
          `La mayoría de las veces, el ambroxan trabaja escondido: sostiene una base, alarga una proyección, le da cuerpo cálido a un acorde sin que nadie note su nombre. Pero en 2005, el perfumista alemán Geza Schoen tomó una decisión distinta. Fundó Escentric Molecules a partir de una idea casi provocadora: en vez de esconder las moléculas de base detrás de composiciones elaboradas, ¿por qué no dejar que una sola de ellas sea todo el perfume?`,
          `Molecule 01, lanzado en 2006, no lleva flores, ni maderas, ni cítricos. Lleva Iso E Super, otra molécula de base, sola. Sobre esa decisión, Schoen dijo algo que explica bastante bien por qué la propuesta funcionó: que ese ingrediente es de los que "te hacen querer acurrucarte en él" — cómodo, envolvente, casi como un abrazo químico.`,
          `Dos años más tarde llegó Molecule 02, la misma filosofía aplicada a la molécula que ya conocemos: ambroxan, sin acompañamiento. Ese ámbar gris que dejó de necesitar un cachalote, presentado, por primera vez para mucha gente, sin nada más alrededor.`,
        ],
      },
      {
        h: "Sí, pero",
        paras: [
          `Nada de esto vuelve al ambroxan menos "real". La molécula que huele a piel cálida en una base ambarada es exactamente la misma, la haya escupido un cachalote hace un siglo o la haya sintetizado un laboratorio la semana pasada.`,
          `Lo que cambia es la pregunta que uno se hace al oler un perfume ambarado y darse cuenta de que ese calor, esa persistencia, esa sensación de piel tibia, probablemente nunca pasó cerca del mar.`,
        ],
      },
    ],
    commerceNote:
      "Nota: reflexión editorial de Aromia. Los enlaces de compra dirigen a retailers autorizados.",
    commerce: [
      {
        label: "Molecule 01 de Escentric Molecules",
        href: "https://www.amazon.com/s?k=Escentric+Molecules+Molecule+01&tag=aromialab-20",
        note: "el experimento de una sola molécula que abrió el concepto.",
      },
      {
        label: "Molecule 02 de Escentric Molecules",
        href: "https://www.amazon.com/s?k=Escentric+Molecules+Molecule+02&tag=aromialab-20",
        note: "el ambroxan, mostrado sin nada alrededor.",
      },
    ],
  },

  "el-perfumista-que-no-teme-exagerar": {
    serie: "Personas",
    territory: "Personas",
    title: "El perfumista que no teme exagerar",
    deck: `Hay una frase de Dominique Ropion que podría sonar, fuera de contexto, a la excusa de alguien que se le fue la mano: "un buen perfume siempre debe parecer obvio."`,
    intro: [
      `No es una excusa. Es, más o menos, la descripción de cómo construyó algunos de los perfumes más vendidos de las últimas dos décadas.`,
    ],
    heroSlot: "ropion-overdose-interpretive",
    sections: [
      {
        h: "Formado en Grasse, conocido por no medirse",
        paras: [
          `Ropion se entrenó en Roure Bertrand Dupont, la escuela de perfumería en Grasse que hoy forma parte de Givaudan — el lugar donde varias generaciones de narices francesas aprendieron el oficio antes de firmar nada con su nombre. Se unió a International Flavors & Fragrances (IFF) en el año 2000, y ahí sigue.`,
          `Su currículum incluye Ysatis de Givenchy en 1984, Amarige en 1991, Pure Poison de Dior en 2001, Flowerbomb de Viktor & Rolf en 2004, Lady Million en 2010 y La Vie Est Belle de Lancôme en 2012 — este último, uno de los perfumes femeninos más vendidos del mundo durante años. En 2012 recibió el Chevalier de l'Ordre des Arts et des Lettres, y en 2018 IFF le otorgó el título de Master Perfumer.`,
          `Ninguno de esos datos explica, por sí solo, por qué huelen como huelen.`,
        ],
      },
      {
        h: "La técnica tiene nombre: sobredosis",
        paras: [
          `En perfumería, "overdose" no es un accidente ni una sobreactuación. Es una decisión deliberada: tomar un ingrediente y usarlo en una concentración mucho más alta de lo habitual, apostando a que esa exageración es exactamente lo que la composición necesita para tener carácter.`,
          `Es un recurso antiguo — el jazmín de Chanel N°5, en 1921, ya lo usaba — pero no todos los perfumistas lo abrazan con la misma comodidad. Ropion sí. Frédéric Malle, la casa para la que compuso Portrait of a Lady en 2010, lo describe sin rodeos: alguien que suele "equilibrar dosis excesivas de ingredientes potentes con acordes medidos con precisión milimétrica, hasta que la composición se sostiene por sí sola."`,
          `Portrait of a Lady es el ejemplo más citado. Contiene, según la propia casa, la dosis más alta de esencia de rosa y de pachulí cœur disponible en el mercado en ese momento. Rosa y pachulí en cantidades que, en manos de otro perfumista, podrían haber colapsado en un perfume pesado e indistinguible. En sus manos, se convirtió en uno de los perfumes que la industria sigue estudiando quince años después — al punto de que en 2026 la Fragrance Foundation lo incorporó a su Salón de la Fama.`,
        ],
      },
      {
        h: "Lo que decidió no usar",
        paras: [
          `Lo más revelador, sin embargo, no es lo que Ropion decidió exagerar. Es lo que decidió dejar afuera.`,
          `Para Portrait of a Lady evitó, a propósito, dos de los ingredientes sintéticos más usados en la perfumería contemporánea: Hedione e Iso E Super — moléculas que, en palabras de una crítica que analizó la fórmula, "olidas por separado, son deliciosas, pero no aportaron nada a esta fórmula en particular." No las evitó porque fueran malas. Las evitó porque esa composición específica no las necesitaba.`,
          `Eso contradice una intuición bastante común: que un perfumista con reputación de maximalista simplemente le pone más de todo. No es así. La sobredosis de Ropion parece funcionar, en parte, porque sabe exactamente qué no sobrecargar mientras exagera otra cosa.`,
        ],
      },
      {
        h: "Sí, pero",
        paras: [
          `Ninguna técnica, por más que tenga nombre y trayectoria, garantiza el resultado por sí sola. La sobredosis de rosa y pachulí funciona en Portrait of a Lady. En otras manos, con otras materias primas o con menos criterio para saber cuándo parar, la misma decisión podría producir exactamente el desastre que la palabra "exceso" hace temer.`,
          `Quizás la lección no es "hay que exagerar". Es que alguien tiene que decidir, perfume por perfume, qué ingrediente merece la sobredosis y cuáles no deberían aparecer ni en dosis normales. Esa decisión, más que la exageración misma, es lo que separa un perfume memorable de uno simplemente cargado.`,
        ],
      },
    ],
    commerceNote:
      "Nota: reflexión editorial de Aromia. Los enlaces de compra dirigen a retailers autorizados.",
    commerce: [
      {
        label: "Flowerbomb de Viktor & Rolf",
        href: "https://www.amazon.com/s?k=Viktor+Rolf+Flowerbomb&tag=aromialab-20",
        note: "de 2004, otra composición de Ropion.",
      },
      {
        label: "La Vie Est Belle de Lancôme",
        href: "https://www.amazon.com/s?k=Lancome+La+Vie+Est+Belle&tag=aromialab-20",
        note: "de 2012, uno de los perfumes femeninos más vendidos del mundo.",
      },
      {
        label: "Pure Poison de Dior",
        href: "https://www.amazon.com/s?k=Dior+Pure+Poison&tag=aromialab-20",
        note: "de 2001, la primera de sus grandes composiciones para una casa de lujo.",
      },
    ],
  },

  "el-perfume-que-encargo-un-sultan": {
    serie: "Fuera del radar",
    territory: "Fuera del radar · Historias",
    title: "El perfume que encargó un sultán",
    deck: `En 1982, un perfumista francés de sesenta y pico de años subió a un avión rumbo a Mascate. No iba de vacaciones. Iba a componer un perfume por encargo directo de un sultán.`,
    intro: [
      `Eso, por sí solo, ya sería una anécdota curiosa. Lo que la vuelve una historia es lo que el sultán le pidió que hiciera con él.`,
    ],
    heroSlot: "amouage-material-density-interpretive",
    sections: [
      {
        h: "Un país que vende incienso desde hace milenios",
        slot: "frankincense-documentary",
        slotClass: "story-interruption",
        paras: [
          `Omán no es un lugar cualquiera para fundar una casa de perfumes. Durante siglos, fue uno de los centros comerciales del incienso y la mirra del mundo antiguo — las mismas resinas que, según se cuenta, viajaban en caravanas hacia templos y palacios de medio Mediterráneo. La región literalmente construyó parte de su historia comercial alrededor de lo que huele bien cuando se quema.`,
          `En 1983, el Príncipe Sayyid Hamad bin Hamoud Al Busaidi fundó Amouage a pedido explícito del Sultán Qaboos bin Said. El lema que la casa adoptó desde el principio no dejaba dudas sobre la ambición: The Gift of Kings — el regalo de los reyes. La idea no era competir en el estante de un centro comercial. Era retomar, con perfumería moderna, un oficio que Omán ya dominaba antes de que existiera Francia como la conocemos.`,
        ],
      },
      {
        h: "El hombre detrás de Madame Rochas, ahora en el desierto",
        slot: "oman-place-documentary",
        slotClass: "story-interruption",
        paras: [
          `Para materializar esa ambición, la casa contrató a Guy Robert — perfumista que ya cargaba, en ese momento, con una lista de trabajo que cualquier nariz envidiaría: Madame Rochas, Calèche de Hermès, y Doblis, considerado casi legendario dentro del oficio. No era un debutante buscando su primer cliente importante. Era alguien que ya no tenía nada que demostrar y aun así aceptó volar a Mascate en 1982 para trabajar en un perfume nuevo desde cero.`,
          `Robert no empezó de la nada del todo: adaptó su propia fórmula de Madame Rochas —floral, aldehídico, de 1960— como punto de partida para lo que se convertiría en Gold Woman, lanzado en 1983. Cinco años más tarde llegó su contraparte masculina, Gold Man, en 1988 — el último perfume que Robert compondría en su carrera. Cerca de 140 ingredientes, entre ellos incienso, mirra, ámbar gris, cedro y pachulí, orquestados con lo que una reseña especializada describe como su "toque ligero y diestro" característico.`,
        ],
      },
      {
        h: "¿El perfume más caro del mundo?",
        paras: [
          `Circula, en foros y artículos sobre la casa, la afirmación de que Amouage llegó a tener, en cierto momento, la fórmula de perfume más cara disponible en el mercado. Es una frase que aparece repetida en varias fuentes sobre la marca, sin que ninguna que haya podido consultar cite una cifra concreta o una comparación verificable con otras casas.`,
          `Vale la pena tratarla como lo que es: una reputación que Amouage se ganó y que la industria le repite, no un dato con fuente primaria confirmada. No hace falta inflar la historia con un número que nadie puede probar — la historia ya es suficientemente rara sin necesidad de superlativos exactos: un sultán encargando un perfume, un maestro perfumista francés cruzando medio mundo para componerlo, y un país que decidió que su incienso milenario merecía una segunda vida en un frasco de lujo internacional.`,
        ],
      },
      {
        h: "Sí, pero",
        paras: [
          `Ninguna de estas historias fundacionales — el sultán, el perfumista legendario, las casi 140 materias primas — garantiza que a alguien le vaya a gustar el perfume que resultó de todo eso. Gold Man, con toda su genealogía, sigue siendo un perfume denso, aldehídico y anticuado para muchas narices contemporáneas, exactamente lo opuesto de lo que hoy domina las góndolas.`,
          `Quizás lo interesante de Amouage no es que haya nacido de un encargo real. Es que esa génesis, casi cuarenta años después, sigue determinando lo que la casa decide oler distinto: perfumes que no compiten por ser fáciles de llevar, sino por sostener la ambición original de sonar — literalmente— a algo que un rey querría regalar.`,
        ],
      },
    ],
    commerceNote:
      "Nota: reflexión editorial de Aromia. Los enlaces de compra dirigen a retailers autorizados.",
    commerce: [
      {
        label: "Interlude Man de Amouage",
        href: "https://www.amazon.com/s?k=Amouage+Interlude+Man&tag=aromialab-20",
        note: "perfume nicho de la misma casa, en el catálogo de Aromia.",
      },
      {
        label: "Reflection Man de Amouage",
        href: "https://www.amazon.com/s?k=Amouage+Reflection+Man&tag=aromialab-20",
        note: "otra composición de la casa fundada por encargo real, también en el catálogo.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(data).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = data[params.slug];
  if (!s) return {};
  return {
    title: { absolute: `${s.title} | Aromia` },
    description: s.deck,
    alternates: { canonical: `/historias/${params.slug}` },
    openGraph: {
      title: s.title,
      description: s.deck,
      type: "article",
    },
  };
}

export default function Story({ params }: { params: { slug: string } }) {
  const s = data[params.slug];
  if (!s) notFound();

  const indexEntry = EDITORIAL_STORIES.find((entry) => entry.slug === params.slug);
  const others = EDITORIAL_STORIES.filter((entry) => entry.slug !== params.slug);
  const sameTerritory = indexEntry
    ? others.filter((entry) => entry.territory === indexEntry.territory)
    : [];
  const related = (sameTerritory.length ? sameTerritory : others).slice(0, 2);

  return (
    <main className={`ev1 story-page ${s.heroSlot.split("-")[0]}`}>
      <article>
        <header className="story-hero">
          <div>
            <p className="ev1-kicker">{s.territory}</p>
            <h1>{s.title}</h1>
            <p className="story-deck">{s.deck}</p>
          </div>
          <VisualField
            slotId={s.heroSlot}
            className="story-visual"
            sizes="(max-width: 800px) 100vw, 50vw"
          />
        </header>

        <div className="story-intro">
          {s.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {s.sections.map((section, i) => (
          <section className={`story-section section-${i + 1}`} key={section.h}>
            <p className="section-number">{String(i + 1).padStart(2, "0")}</p>
            <div>
              <h2>{section.h}</h2>
              {section.paras.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
            {section.slot ? (
              <VisualField
                slotId={section.slot}
                className={section.slotClass ?? "story-inline-visual"}
                sizes="(max-width: 800px) 100vw, 33vw"
              />
            ) : null}
            {params.slug === "el-perfumista-que-no-teme-exagerar" && i === 1 ? (
              <RopionMaterialDiptych />
            ) : null}
            {params.slug === "el-perfumista-que-no-teme-exagerar" && i === 2 ? (
              <RopionOmissionPause />
            ) : null}
          </section>
        ))}

        <section className="story-commerce" aria-label="Enlaces de afiliado">
          <p className="story-commerce-note">{s.commerceNote}</p>
          <ul>
            {s.commerce.map((c) => (
              <li key={c.href}>
                <a href={c.href} rel="sponsored nofollow">
                  {c.label}
                </a>{" "}
                — {c.note}
              </li>
            ))}
          </ul>
        </section>

        <aside className="story-close">
          <p className="ev1-kicker">Seguir leyendo</p>
          <p>
            El perfume puede ser el final de una compra. Aquí preferimos que sea
            el principio de otra pregunta.
          </p>
          <ul className="story-close-related">
            {related.map((entry) => (
              <li key={entry.slug}>
                <Link href={entry.href}>
                  <span className="story-close-related-kicker">{entry.territory}</span>
                  <span className="story-close-related-title">{entry.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/magazine" className="ev1-read">
            Ver todo el archivo →
          </Link>
        </aside>
      </article>
    </main>
  );
}
