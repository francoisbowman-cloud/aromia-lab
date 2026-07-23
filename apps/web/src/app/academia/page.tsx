import Link from "next/link";
import { IngredientesGrid } from "@/components/academia/IngredientesGrid";
import { pickEditorialImage } from "@/lib/editorialImages";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Academia — Aromia",
  description:
    "Academia de perfumería: historia, pirámide olfativa, familias, concentraciones y los ingredientes uno a uno.",
};

const timeline = [
  {
    anio: "~4000 a.C.",
    titulo: "Los primeros perfumes",
    texto:
      'Mesopotamia y Egipto queman resinas e incienso en rituales religiosos. La palabra "perfume" vendría siglos después del latín per fumum, "a través del humo".',
  },
  {
    anio: "1190",
    titulo: "Grasse, la capital",
    texto:
      "La ciudad francesa, ya curtidora de cuero, empieza a perfumar guantes para disimular el olor del curtido. Con el tiempo se convierte en la capital mundial de la perfumería.",
  },
  {
    anio: "1370",
    titulo: 'El "Agua de Hungría"',
    texto:
      "Considerado el primer perfume moderno a base de alcohol, mezclando aceites esenciales con espíritu de vino en lugar de solo aceites o grasas.",
  },
  {
    anio: "1882",
    titulo: "La revolución sintética",
    texto:
      "Fougère Royale de Houbigant introduce la cumarina sintética. Por primera vez, un perfume no intenta imitar una flor real: crea un olor que no existe en la naturaleza.",
  },
  {
    anio: "1921",
    titulo: "Chanel N°5",
    texto:
      "Ernest Beaux usa aldehídos en concentraciones nunca vistas. Nace la perfumería abstracta moderna: el perfume como firma, no como copia de una flor.",
  },
  {
    anio: "Hoy",
    titulo: "Nicho y personalización",
    texto:
      "Casas independientes (Le Labo, Amouage, Xerjoff) desafían a las grandes maisons con lotes pequeños, ingredientes crudos de mayor calidad y narrativas más íntimas.",
  },
];

const piramide = [
  {
    etiqueta: "Salida · 0–15 minutos",
    titulo: "Notas de salida (top notes)",
    texto:
      "Las primeras en evaporarse — cítricos, especias ligeras, notas verdes. Son la primera impresión, la más volátil y la que menos dura sobre la piel.",
  },
  {
    etiqueta: "Corazón · 15 min – 2 horas",
    titulo: "Notas de corazón (heart notes)",
    texto:
      'El "carácter" del perfume — flores, especias más pesadas, frutas. Aparecen cuando las notas de salida se disipan y definen la personalidad central de la fragancia.',
  },
  {
    etiqueta: "Fondo · 2+ horas",
    titulo: "Notas de fondo (base notes)",
    texto:
      "Maderas, almizcles, resinas, ámbar — las moléculas más pesadas y duraderas. Es lo que realmente llevás puesto varias horas después de aplicarlo; el rastro que la gente recuerda.",
  },
];

const familias = [
  { nombre: "Cítrica", color: "linear-gradient(135deg,#f2c46d,#c98a2e)", texto: "Bergamota, limón, mandarina. Fresca, ligera, poca duración — ideal como nota de salida." },
  { nombre: "Floral", color: "linear-gradient(135deg,#e8a2b0,#c15b74)", texto: "Rosa, jazmín, ylang ylang. La familia más grande y versátil, desde lo delicado hasta lo opulento." },
  { nombre: "Amaderada", color: "linear-gradient(135deg,#c9a15a,#7a5c2e)", texto: "Sándalo, cedro, vetiver. Cálida y seca, la base de la mayoría de los perfumes masculinos." },
  { nombre: "Amberada / oriental", color: "linear-gradient(135deg,#8a6a4a,#4a3520)", texto: "Ámbar, vainilla, resinas. Densa, dulce y envolvente — ideal para climas fríos y ocasiones nocturnas." },
  { nombre: "Chipre", color: "linear-gradient(135deg,#8fae7a,#4f6b3c)", texto: "Bergamota + musgo de roble + labdanum. Elegante y clásica, a medio camino entre floral y amaderada." },
  { nombre: "Acuática / fresca", color: "linear-gradient(135deg,#7fa8b8,#3c6b7d)", texto: "Notas marinas, ozónicas. Nació en los 90, evoca limpieza y aire libre — muy popular en verano." },
  { nombre: "Especiada", color: "linear-gradient(135deg,#b08d6a,#6b4a2e)", texto: "Canela, cardamomo, pimienta rosa. Aporta calidez y carácter, casi nunca se usa sola." },
  { nombre: "Gourmand", color: "linear-gradient(135deg,#e8c9a0,#a67c4a)", texto: "Vainilla, caramelo, cacao. La familia más joven (desde los 90), inspirada en postres y golosinas." },
];

const concentraciones = [
  { nombre: "Parfum / Extrait", ancho: "100%", pct: "20–40%" },
  { nombre: "Eau de Parfum", ancho: "65%", pct: "15–20%" },
  { nombre: "Eau de Toilette", ancho: "35%", pct: "5–15%" },
  { nombre: "Eau de Cologne", ancho: "15%", pct: "2–4%" },
];

export default function AcademiaPage() {
  const heroImage = pickEditorialImage("academia-hero");

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-24 p-6 pb-24 lg:p-10">
      <section className="relative -mx-6 flex flex-col items-center gap-5 overflow-hidden px-6 py-12 text-center lg:-mx-10 lg:px-10 lg:py-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage.src}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/92 via-paper/85 to-paper" />
        <div className="relative flex flex-col items-center gap-5">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold-contrast" />
            <p className="font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast">
              La Academia Aromia
            </p>
            <span className="h-px w-8 bg-gold-contrast" />
          </div>
          <h1 className="max-w-2xl font-display text-[40px] font-semibold leading-[1.02] text-ink lg:text-[56px]">
            Entiende el perfume <em className="text-gold-contrast not-italic">antes de elegirlo.</em>
          </h1>
          <p className="max-w-xl font-sans text-lg text-muted">
            Historia, estructura, familias olfativas, concentraciones y los ingredientes uno a uno
            — todo lo que necesitás para leer una fragancia como quien la crea, no solo como quien
            la compra.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {[
              ["#historia", "Historia"],
              ["#piramide", "La pirámide"],
              ["#familias", "Familias olfativas"],
              ["#concentraciones", "Concentraciones"],
              ["#ingredientes", "Los ingredientes"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full border border-line px-4 py-2 font-sans text-[11px] uppercase tracking-[.1em] text-muted transition hover:border-gold hover:text-ink"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="historia" className="scroll-mt-20 border-t border-line pt-16">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast">Origen</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink lg:text-4xl">
            Una historia de 6.000 años
          </h2>
          <p className="mt-3 font-sans text-sm text-muted">
            Del incienso quemado en templos a la molécula sintética de laboratorio: la perfumería
            es una de las artesanías más antiguas del mundo.
          </p>
        </div>
        <div className="mx-auto flex max-w-3xl flex-col">
          {timeline.map((item) => (
            <div
              key={item.anio}
              className="grid grid-cols-1 gap-2 border-b border-line py-6 last:border-none sm:grid-cols-[90px_1fr] sm:gap-6"
            >
              <div className="font-display text-2xl leading-none text-gold-contrast">{item.anio}</div>
              <div>
                <h4 className="font-display text-lg font-semibold text-ink">{item.titulo}</h4>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted">{item.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="piramide" className="scroll-mt-20 border-t border-line pt-16">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast">Estructura</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink lg:text-4xl">
            La pirámide olfativa
          </h2>
          <p className="mt-3 font-sans text-sm text-muted">
            Un perfume no es un olor: son tres actos que se suceden en el tiempo sobre tu piel.
          </p>
        </div>
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {piramide.map((tier) => (
            <div key={tier.titulo} className="rounded-card border border-line bg-surface p-7">
              <p className="font-sans text-[11px] uppercase tracking-[.16em] text-gold-contrast">
                {tier.etiqueta}
              </p>
              <h4 className="mt-2 font-display text-xl font-semibold text-ink">{tier.titulo}</h4>
              <p className="mt-2 font-sans text-sm leading-relaxed text-muted">{tier.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="familias" className="scroll-mt-20 border-t border-line pt-16">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast">Clasificación</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink lg:text-4xl">
            Las 8 familias olfativas
          </h2>
          <p className="mt-3 font-sans text-sm text-muted">
            Toda fragancia pertenece a una o más familias según su acorde dominante. Conocerlas te
            ayuda a predecir si un perfume nuevo te va a gustar antes de olerlo.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {familias.map((fam) => (
            <div
              key={fam.nombre}
              className="rounded-card border border-line bg-surface p-6 transition hover:-translate-y-1 hover:border-gold"
            >
              <div
                className="mb-4 h-7 w-7 rounded-full"
                style={{ background: fam.color }}
              />
              <h4 className="font-display text-lg font-semibold text-ink">{fam.nombre}</h4>
              <p className="mt-2 font-sans text-[13px] leading-relaxed text-muted">{fam.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="concentraciones" className="scroll-mt-20 border-t border-line pt-16">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast">Cómo elegir</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink lg:text-4xl">
            Concentraciones: qué diferencia hay
          </h2>
          <p className="mt-3 font-sans text-sm text-muted">
            El mismo perfume puede venir en distintas concentraciones de aceite aromático — eso
            cambia intensidad, duración y precio.
          </p>
        </div>
        <div className="mx-auto flex max-w-2xl flex-col">
          {concentraciones.map((c) => (
            <div
              key={c.nombre}
              className="grid grid-cols-1 gap-2 border-b border-line py-4 last:border-none sm:grid-cols-[120px_1fr_60px] sm:items-center sm:gap-4"
            >
              <span className="font-display text-lg text-ink">{c.nombre}</span>
              <span className="relative h-2 overflow-hidden rounded-full bg-gold/20">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-gold-contrast"
                  style={{ width: c.ancho }}
                />
              </span>
              <span className="font-sans text-xs text-muted sm:text-right">{c.pct}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="ingredientes" className="scroll-mt-20 border-t border-line pt-16">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast">Materia prima</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink lg:text-4xl">
            Los ingredientes, uno a uno
          </h2>
          <p className="mt-3 font-sans text-sm text-muted">
            Toca un ingrediente para descubrir su origen, su familia olfativa y en qué perfumes
            del catálogo aparece.
          </p>
        </div>
        <IngredientesGrid />
      </section>

      <section className="rounded-card bg-ink px-8 py-16 text-center text-paper">
        <h2 className="font-display text-3xl font-semibold lg:text-4xl">¿Ya sabés qué buscás?</h2>
        <p className="mx-auto mt-3 max-w-md font-sans text-sm text-paper/70">
          Volvé al comparador y usá los filtros con criterio de experto.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/catalogo">Ir al catálogo →</Link>
        </Button>
      </section>
    </main>
  );
}
