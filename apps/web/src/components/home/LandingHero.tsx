import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, GraduationCap, Mail, Users } from "lucide-react";

const DOORS = [
  { href: "/magazine", label: "Historias", copy: "Ensayos, materias y relatos que empiezan por una pregunta.", Icon: BookOpen },
  { href: "/academia", label: "Saber", copy: "Estructura, familias y concentración, explicadas con calma.", Icon: GraduationCap },
  { href: "/perfumistas", label: "Personas", copy: "Las autorías detrás de las fragancias y las obras revisadas.", Icon: Users },
  { href: "/descubrir", label: "Discovery", copy: "Explora familias, materias y caminos olfativos propios.", Icon: Compass },
  { href: "/club", label: "Club", copy: "Una carta breve cuando haya algo que valga la pena oler.", Icon: Mail },
] as const;

const NOTES = [
  { href: "/descubrir/familias/citrica", label: "Cítricas", src: "/editorial-v1/bergamot-fresh-portrait.webp", alt: "Bergamota fresca entera con una hoja verde, sobre fondo gris claro.", credit: "Imagen generada con IA · AROMIA" },
  { href: "/descubrir/familias/floral", label: "Florales", src: "/editorial-v1/rose-fresh-portrait.webp", alt: "Rosa rosada en flor con tallo y hoja, sobre fondo gris claro.", credit: "Imagen generada con IA · AROMIA" },
  { href: "/descubrir/familias/amaderada", label: "Amaderadas", src: "/editorial-v1/sandalwood-fresh-portrait.webp", alt: "Troncos partidos de sándalo con virutas, sobre fondo gris claro.", credit: "Imagen generada con IA · AROMIA" },
  { href: "/descubrir/familias/ambar-oriental", label: "Ámbar", src: "/editorial-v1/resin-fresh-portrait.webp", alt: "Lágrimas de resina de incienso doradas, sobre fondo gris claro.", credit: "Imagen generada con IA · AROMIA" },
  { href: "/descubrir/familias/chipre", label: "Chipre", src: "/editorial-v1/oakmoss-fresh-portrait.webp", alt: "Musgo de roble y hojas de pachulí, sobre fondo gris claro.", credit: "Imagen generada con IA · AROMIA" },
  { href: "/descubrir/familias/aromatica", label: "Aromáticas", src: "/editorial-v1/clary-sage-herbarium.jpg", alt: "Lámina botánica histórica de Salvia sclarea.", credit: "Jacob Sturm, 1796 · dominio público" },
] as const;

const FACTS = [
  { value: "125", label: "fragancias en el archivo" },
  { value: String(NOTES.length), label: "familias olfativas para empezar" },
  { value: "↗", label: "créditos de imagen a la vista" },
] as const;

/** Escena 2.5D: cada capa se desplaza según su profundidad (--d) con puntero y scroll. */
export function LandingHero() {
  return (
    <>
      <section className="d25-hero" data-depth-stage aria-labelledby="landing-title">
        <div aria-hidden="true" className="d25-hero-glow d25-layer" style={{ "--d": -14 } as React.CSSProperties} />
        <div className="d25-hero-inner">
          <div className="d25-hero-copy">
            <p className="d25-eyebrow">La autoridad en perfumería</p>
            <h1 id="landing-title">Cada fragancia cuenta <em>una historia</em>.</h1>
            <span aria-hidden="true" className="d25-rule" />
            <p className="d25-lede">Historias, materias y personas para entender el perfume con más contexto y menos ruido.</p>
            <div className="d25-actions">
              <Link href="/magazine" className="d25-btn">Explorar las historias <ArrowRight aria-hidden="true" size={18} strokeWidth={1.6} /></Link>
              <Link href="/descubrir" className="d25-link">Abrir Discovery</Link>
            </div>
          </div>

          <figure className="d25-scene" aria-label="Composición ilustrada: un frasco ámbar entre materias primas">
            <div aria-hidden="true" className="d25-arch d25-layer" style={{ "--d": -10 } as React.CSSProperties} />
            <div aria-hidden="true" className="d25-pedestal d25-layer" style={{ "--d": -4 } as React.CSSProperties} />
            <div className="d25-plate d25-layer" style={{ "--d": 12 } as React.CSSProperties}>
              <Image src="/editorial-v1/perfume-silk-cover.webp" alt="Un frasco de vidrio ámbar sobre travertino, seda vino y flores de cítrico." fill priority sizes="(max-width: 1023px) 86vw, 520px" />
              <span aria-hidden="true" className="d25-sheen" />
            </div>
            <div aria-hidden="true" className="d25-med d25-med--a d25-layer" style={{ "--d": 40 } as React.CSSProperties}>
              <span><Image src="/editorial-v1/bergamot-fresh-square.webp" alt="" fill sizes="160px" /></span>
            </div>
            <div aria-hidden="true" className="d25-med d25-med--b d25-layer" style={{ "--d": 58 } as React.CSSProperties}>
              <span><Image src="/editorial-v1/rose-documentary.jpg" alt="" fill sizes="110px" /></span>
            </div>
            <div aria-hidden="true" className="d25-med d25-med--c d25-layer" style={{ "--d": 30 } as React.CSSProperties}>
              <span><Image src="/editorial-v1/frankincense-documentary.jpg" alt="" fill sizes="120px" /></span>
            </div>
            <div aria-hidden="true" className="d25-dust d25-layer" style={{ "--d": 72 } as React.CSSProperties}>
              {Array.from({ length: 9 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}
            </div>
            <figcaption>
              Ilustración digital · AROMIA. Bergamota: imagen generada con IA · Rosa: Vatadoshu Phyto (CC0) · Incienso: Krzysztof Ziarnek (<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>).
            </figcaption>
          </figure>
        </div>
      </section>

      <nav className="d25-doors" aria-label="Secciones de Aromia">
        <ul>
          {DOORS.map(({ href, label, copy, Icon }, index) => (
            <li key={href} data-depth-reveal style={{ "--i": index } as React.CSSProperties}>
              <Link href={href} className="d25-door" data-tilt>
                <span className="d25-door-icon"><Icon aria-hidden="true" size={22} strokeWidth={1.3} /></span>
                <span className="d25-door-label">{label}</span>
                <span className="d25-door-copy">{copy}</span>
                <ArrowRight aria-hidden="true" className="d25-door-arrow" size={16} strokeWidth={1.5} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="d25-notes" aria-labelledby="notes-title">
        <div className="d25-section-head" data-depth-reveal>
          <div>
            <p className="d25-eyebrow">Explora por familias</p>
            <h2 id="notes-title">Encuentra tu esencia.</h2>
          </div>
          <Link href="/descubrir" className="d25-link">Ver todas las familias <ArrowRight aria-hidden="true" size={16} strokeWidth={1.5} /></Link>
        </div>
        <ul className="d25-notes-grid">
          {NOTES.map((note, index) => (
            <li key={note.href} data-depth-reveal style={{ "--i": index } as React.CSSProperties}>
              <Link href={note.href} className="d25-note" data-tilt>
                <span className="d25-note-media"><Image src={note.src} alt={note.alt} fill sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 15vw" /></span>
                <span className="d25-note-label">{note.label}</span>
              </Link>
              <p className="d25-credit">{note.credit}</p>
            </li>
          ))}
        </ul>
      </section>

      <ul className="d25-facts" aria-label="Datos de Aromia">
        {FACTS.map((fact) => (
          <li key={fact.label} data-depth-reveal><strong>{fact.value}</strong><span>{fact.label}</span></li>
        ))}
      </ul>
    </>
  );
}
