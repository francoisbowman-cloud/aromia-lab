import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Academia — Aromia",
  description:
    "Academia de perfumería: historia, pirámide olfativa, familias, concentraciones y los ingredientes uno a uno.",
};

const timeline = [
  { anio: "~4000 a.C.", titulo: "Los primeros perfumes", texto: 'Mesopotamia y Egipto queman resinas e incienso en rituales. La palabra "perfume" llegaría siglos después del latín per fumum: "a través del humo".' },
  { anio: "1190", titulo: "Grasse, la capital", texto: "La ciudad francesa comienza a perfumar guantes para suavizar el olor del cuero y termina convirtiéndose en un centro mundial de perfumería." },
  { anio: "1370", titulo: 'El "Agua de Hungría"', texto: "Una de las primeras fórmulas modernas a base de alcohol mezcla aceites esenciales con espíritu de vino." },
  { anio: "1882", titulo: "La revolución sintética", texto: "Fougère Royale introduce la cumarina sintética y demuestra que un perfume también puede crear un olor que no existe en la naturaleza." },
  { anio: "1921", titulo: "Chanel N°5", texto: "Ernest Beaux lleva los aldehídos a una nueva escala y consolida la perfumería abstracta moderna." },
  { anio: "Hoy", titulo: "Nicho y personalización", texto: "Casas independientes y grandes maisons conviven con una perfumería más diversa, experimental y personal." },
];

const piramide = [
  { etiqueta: "Salida · 0–15 minutos", titulo: "Notas de salida", texto: "Cítricos, especias ligeras y notas verdes suelen formar la primera impresión: brillante, volátil y breve." },
  { etiqueta: "Corazón · 15 min – 2 horas", titulo: "Notas de corazón", texto: "Flores, frutas y especias aparecen cuando la salida se disipa y definen buena parte del carácter de la fragancia." },
  { etiqueta: "Fondo · 2+ horas", titulo: "Notas de fondo", texto: "Maderas, almizcles, resinas y ámbar permanecen más tiempo sobre la piel y sostienen el rastro final del perfume." },
];

const familias = [
  { nombre: "Cítrica", color: "linear-gradient(135deg,#f2c46d,#c98a2e)", texto: "Bergamota, limón y mandarina: frescura luminosa y gran presencia en la salida." },
  { nombre: "Floral", color: "linear-gradient(135deg,#e8a2b0,#c15b74)", texto: "Rosa, jazmín y ylang-ylang: desde perfiles transparentes hasta composiciones opulentas." },
  { nombre: "Amaderada", color: "linear-gradient(135deg,#c9a15a,#7a5c2e)", texto: "Sándalo, cedro y vetiver: textura seca, cálida y estructural." },
  { nombre: "Amberada / oriental", color: "linear-gradient(135deg,#8a6a4a,#4a3520)", texto: "Ámbar, vainilla y resinas: calidez, densidad y sensación envolvente." },
  { nombre: "Chipre", color: "linear-gradient(135deg,#8fae7a,#4f6b3c)", texto: "Bergamota, musgo de roble y labdanum: contraste entre luz cítrica y fondo terroso." },
  { nombre: "Acuática / fresca", color: "linear-gradient(135deg,#7fa8b8,#3c6b7d)", texto: "Acordes marinos y ozónicos que evocan aire, agua y limpieza." },
  { nombre: "Especiada", color: "linear-gradient(135deg,#b08d6a,#6b4a2e)", texto: "Canela, cardamomo y pimienta rosa: calor, tensión y carácter." },
  { nombre: "Gourmand", color: "linear-gradient(135deg,#e8c9a0,#a67c4a)", texto: "Vainilla, cacao y notas dulces inspiradas en sabores y postres." },
];

const concentraciones = [
  { nombre: "Parfum / Extrait", ancho: "100%", pct: "20–40%" },
  { nombre: "Eau de Parfum", ancho: "65%", pct: "15–20%" },
  { nombre: "Eau de Toilette", ancho: "35%", pct: "5–15%" },
  { nombre: "Eau de Cologne", ancho: "15%", pct: "2–4%" },
];

export default function AcademiaPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-24 p-6 pb-24 lg:p-10">
      <section className="relative -mx-6 overflow-hidden bg-[#f0e5d5] px-6 py-16 text-center dark:bg-[#17120d] lg:-mx-10 lg:px-10 lg:py-24">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,255,255,.88),transparent_28%),radial-gradient(circle_at_84%_76%,rgba(182,138,68,.18),transparent_34%),linear-gradient(135deg,#fbf7f0_0%,#eee1ce_58%,#e4d0ad_100%)] dark:bg-[radial-gradient(circle_at_14%_18%,rgba(200,168,107,.09),transparent_30%),radial-gradient(circle_at_84%_76%,rgba(182,138,68,.08),transparent_34%),linear-gradient(135deg,#17120d_0%,#100d0a_70%,#21180f_100%)]" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-5">
          <p className="font-sans text-xs uppercase tracking-[.17em] text-gold-contrast">La Academia Aromia</p>
          <h1 className="max-w-2xl font-display text-[38px] font-semibold leading-[1.04] text-ink sm:text-[46px] lg:text-[54px]">
            Entiende el perfume <em className="text-gold-contrast not-italic">antes de elegirlo.</em>
          </h1>
          <p className="max-w-xl font-sans text-base leading-7 text-muted">Aprende a leer una fragancia a través de su estructura, sus familias y su concentración.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {[["#piramide", "La pirámide"], ["#familias", "Familias olfativas"], ["#concentraciones", "Concentraciones"], ["#historia", "Origen"]].map(([href, label]) => (
              <a key={href} href={href} className="inline-flex min-h-11 items-center px-1 font-sans text-xs uppercase tracking-[.1em] text-muted transition hover:text-ink">{label}</a>
            ))}
          </div>
        </div>
      </section>

      <section id="piramide" className="scroll-mt-20 pt-6">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="font-sans text-xs uppercase tracking-[.14em] text-gold-contrast">Estructura</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink lg:text-4xl">La pirámide olfativa</h2>
          <p className="mt-3 font-sans text-base leading-7 text-muted">Una fragancia cambia con el tiempo: salida, corazón y fondo cuentan momentos distintos.</p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
          {piramide.map((tier) => (
            <div key={tier.titulo} className="rounded-card bg-surface p-7">
              <p className="font-sans text-xs uppercase tracking-[.12em] text-gold-contrast">{tier.etiqueta}</p>
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">{tier.titulo}</h3>
              <p className="mt-3 font-sans text-sm leading-6 text-muted">{tier.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="familias" className="scroll-mt-20 pt-6">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="font-sans text-xs uppercase tracking-[.14em] text-gold-contrast">Clasificación</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink lg:text-4xl">Las 8 familias olfativas</h2>
          <p className="mt-3 font-sans text-base leading-7 text-muted">Reconocer la familia dominante ayuda a anticipar el carácter de una fragancia.</p>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {familias.map((fam) => (
            <div key={fam.nombre} className="p-1">
              <div className="mb-4 h-7 w-7 rounded-full" style={{ background: fam.color }} />
              <h3 className="font-display text-lg font-semibold text-ink">{fam.nombre}</h3>
              <p className="mt-2 font-sans text-sm leading-6 text-muted">{fam.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="concentraciones" className="scroll-mt-20 pt-6">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="font-sans text-xs uppercase tracking-[.14em] text-gold-contrast">Cómo elegir</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink lg:text-4xl">Qué cambia con la concentración</h2>
          <p className="mt-3 font-sans text-base leading-7 text-muted">La proporción de aceite aromático influye en intensidad, duración y, a menudo, precio.</p>
        </div>
        <div className="mx-auto flex max-w-2xl flex-col gap-7">
          {concentraciones.map((c) => (
            <div key={c.nombre} className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr_60px] sm:items-center sm:gap-5">
              <span className="font-display text-lg text-ink">{c.nombre}</span>
              <span className="relative h-2 overflow-hidden rounded-full bg-gold/20"><span className="absolute inset-y-0 left-0 rounded-full bg-gold-contrast" style={{ width: c.ancho }} /></span>
              <span className="font-sans text-xs text-muted sm:text-right">{c.pct}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Materia prima seguirá oculta hasta integrar activos NO-IA auditados de la nueva biblioteca reusable. */}

      <section id="historia" className="scroll-mt-20 pt-10">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="font-sans text-xs uppercase tracking-[.14em] text-gold-contrast">Origen</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-ink lg:text-4xl">Una historia de 6.000 años</h2>
          <p className="mt-3 font-sans text-base leading-7 text-muted">Del humo ritual a la perfumería abstracta: seis momentos para entender cómo llegamos hasta aquí.</p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-x-12 gap-y-10 sm:grid-cols-2">
          {timeline.map((item) => (
            <article key={item.anio} className="grid grid-cols-[72px_1fr] gap-5">
              <div className="font-display text-xl leading-none text-gold-contrast">{item.anio}</div>
              <div><h3 className="font-display text-lg font-semibold text-ink">{item.titulo}</h3><p className="mt-2 font-sans text-sm leading-6 text-muted">{item.texto}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-card bg-ink px-8 py-14 text-center text-paper">
        <h2 className="font-display text-3xl font-semibold lg:text-4xl">¿Ya sabes qué buscas?</h2>
        <p className="mx-auto mt-3 max-w-md font-sans text-base leading-7 text-paper/75">Seguí leyendo el Magazine: reseñas, comparativas y guías por ocasión y temporada.</p>
        <Button asChild size="lg" className="mt-6"><Link href="/magazine">Ir al Magazine →</Link></Button>
      </section>
    </main>
  );
}
