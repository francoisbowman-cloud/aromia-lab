import Image from "next/image";
import Link from "next/link";

// SB3: banda documental de materias reales y licenciadas. No define familias
// con una sola imagen; muestra que las familias son abstracciones construidas
// sobre relaciones materiales que se repiten. Discovery lleva la taxonomía
// completa.
const materiaStrip = [
  { nombre: "Bergamota", src: "/editorial-v1/bergamot-documentary.jpg", w: 800, h: 600, credito: "Foto: Xenocryst, Flickr, CC BY-SA 2.0.", familia: "Cítrica", slug: "citrica" },
  { nombre: "Rosa", src: "/editorial-v1/rose-pink-documentary.jpg", w: 1024, h: 768, credito: "Foto: Jon Sullivan, Wikimedia Commons, CC0.", familia: "Floral", slug: "floral" },
  { nombre: "Sándalo", src: "/editorial-v1/sandalwood-documentary.jpg", w: 1200, h: 1200, credito: "Santalum album. Foto: Shyamal, Wikimedia Commons, CC BY-SA 4.0.", familia: "Amaderada", slug: "amaderada" },
  { nombre: "Incienso", src: "/editorial-v1/frankincense-documentary.jpg", w: 1920, h: 1440, credito: "Boswellia sacra. Foto: Kenraiz, Wikimedia Commons, CC BY-SA 4.0.", familia: "Ámbar / oriental", slug: "ambar-oriental" },
  { nombre: "Salvia sclarea", src: "/editorial-v1/clary-sage-documentary.jpg", w: 1309, h: 1746, credito: "Foto: Llez, Wikimedia Commons, CC BY-SA 3.0.", familia: "Aromática", slug: "aromatica" },
  { nombre: "Pachulí", src: "/editorial-v1/patchouli-documentary.jpg", w: 640, h: 427, credito: "Pogostemon cablin. Foto: Seychelles News Agency, CC BY 4.0.", familia: "Chipre", slug: "chipre" },
];

export const metadata = {
  title: "Saber — Aromia",
  description: "Una puerta de entrada a la estructura, las familias, las concentraciones y la historia de la perfumería.",
};

const timeline = [
  { anio: "~4000 a.C.", titulo: "Los primeros perfumes", texto: 'Mesopotamia y Egipto queman resinas e incienso en rituales. La palabra "perfume" llegaría siglos después del latín per fumum: "a través del humo".' },
  { anio: "1190", titulo: "Grasse, la capital", texto: "La ciudad francesa comienza a perfumar guantes para suavizar el olor del cuero y termina convirtiéndose en un centro mundial de perfumería." },
  { anio: "1370", titulo: 'El "Agua de Hungría"', texto: "Una de las primeras fórmulas modernas a base de alcohol mezcla aceites esenciales con espíritu de vino." },
  { anio: "1882", titulo: "La revolución sintética", texto: "Fougère Royale introduce la cumarina sintética y demuestra que un perfume también puede crear un olor que no existe en la naturaleza." },
  { anio: "1921", titulo: "Chanel N°5", texto: "Ernest Beaux lleva los aldehídos a una nueva escala y consolida la perfumería abstracta moderna." },
  { anio: "Hoy", titulo: "Nicho y personalización", texto: "Casas independientes y grandes maisons conviven con una perfumería más diversa, experimental y personal." },
];

// El "tramo" es solo una lectura visual del tiempo que cada fase permanece
// sobre la piel, normalizada al fondo. El texto del rango lleva la misma
// información sin depender del gráfico.
const piramide = [
  { fase: "Salida", rango: "0 – 15 minutos", rol: "La primera impresión: brillante, volátil y breve.", materias: ["Cítricos", "Notas verdes", "Especias ligeras"], tramo: "16%" },
  { fase: "Corazón", rango: "15 minutos – 2 horas", rol: "Aparece cuando la salida se disipa y define buena parte del carácter de la fragancia.", materias: ["Flores", "Frutas", "Especias"], tramo: "45%" },
  { fase: "Fondo", rango: "2 horas en adelante", rol: "Permanece sobre la piel y sostiene el rastro final del perfume.", materias: ["Maderas", "Almizcles", "Resinas", "Ámbar"], tramo: "100%" },
];

const familias = [
  ["Cítrica", "Bergamota, limón y mandarina: frescura luminosa y gran presencia en la salida."],
  ["Floral", "Rosa, jazmín y ylang-ylang: desde perfiles transparentes hasta composiciones opulentas."],
  ["Amaderada", "Sándalo, cedro y vetiver: textura seca, cálida y estructural."],
  ["Amberada / oriental", "Ámbar, vainilla y resinas: calidez, densidad y sensación envolvente."],
  ["Chipre", "Bergamota, musgo de roble y labdanum: contraste entre luz cítrica y fondo terroso."],
  ["Acuática / fresca", "Acordes marinos y ozónicos que evocan aire, agua y limpieza."],
  ["Especiada", "Canela, cardamomo y pimienta rosa: calor, tensión y carácter."],
  ["Gourmand", "Vainilla, cacao y notas dulces inspiradas en sabores y postres."],
] as const;

// La barra representa el punto medio del rango real de concentrado, normalizado
// al del Parfum (~30%) — no un valor decorativo.
const concentraciones = [
  ["Parfum / Extrait", "20–40%", "100%"],
  ["Eau de Parfum", "15–20%", "58%"],
  ["Eau de Toilette", "5–15%", "33%"],
  ["Eau de Cologne", "2–4%", "10%"],
] as const;

export default function SaberPage() {
  return (
    <main className="bg-paper text-ink">
      <header className="mx-auto max-w-[1320px] px-6 pb-12 pt-14 lg:px-10 lg:pb-20 lg:pt-24">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_.72fr] lg:items-end">
          <div><p className="font-plex text-xs uppercase tracking-[.16em] text-[var(--aromia-editorial-accent)]">Saber</p><h1 className="mt-5 max-w-[11ch] font-display text-[54px] leading-[.9] tracking-[-.045em] sm:text-[68px] lg:text-[86px]">Entender cambia la manera de oler.</h1></div>
          <div className="lg:justify-self-end"><p className="max-w-[43ch] font-sans text-base leading-7 text-muted">Estructura, familias, concentración e historia. No para convertir el perfume en una clase, sino para tener mejores preguntas cuando volvamos a olerlo.</p><nav className="mt-7 flex flex-wrap gap-x-6 gap-y-2 font-plex text-xs uppercase tracking-[.12em] text-muted" aria-label="Índice de Saber"><a href="#estructura" className="nav-link">Estructura</a><a href="#familias" className="nav-link">Familias</a><a href="#concentracion" className="nav-link">Concentración</a><a href="#historia" className="nav-link">Historia</a></nav></div>
        </div>
      </header>

      <section id="estructura" className="border-y border-line"><div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-10 lg:py-24"><div className="grid gap-12 lg:grid-cols-[.6fr_1.4fr]"><div><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">01 / Estructura</p><h2 className="mt-4 max-w-[9ch] font-display text-[42px] leading-[.94] tracking-[-.035em] lg:text-[54px]">Cómo se mueve en el tiempo.</h2><p className="mt-5 max-w-[34ch] font-sans text-sm leading-6 text-muted">Una fragancia cambia sobre la piel. En vez de una pirámide, aquí se lee como tres fases sucesivas: cuándo aparece cada una, qué papel cumple y qué materias suelen ocuparla. No es una fórmula universal.</p></div><div><ol className="border-t border-line">{piramide.map((tier, index)=><li key={tier.fase} className="grid gap-x-6 gap-y-3 border-b border-line py-7 sm:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.15fr)]"><span className="font-plex text-xs text-muted">0{index+1}</span><div><p className="font-plex text-xs uppercase tracking-[.12em] text-gold-contrast">{tier.fase}</p><p className="mt-1 font-display text-lg text-ink">{tier.rango}</p><p className="mt-2 font-sans text-sm leading-6 text-muted">{tier.rol}</p></div><div className="sm:pt-1"><span aria-hidden="true" className="block h-1 w-full bg-line"><span className="block h-full bg-gold-contrast" style={{width:tier.tramo}}/></span><ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-sans text-sm text-ink">{tier.materias.map((materia)=><li key={materia}>{materia}</li>)}</ul></div></li>)}</ol><p aria-hidden="true" className="mt-4 flex justify-between font-plex text-[11px] uppercase tracking-[.1em] text-muted"><span>0</span><span>15 min</span><span>2 h</span><span>varias horas</span></p></div></div></div></section>

      <section id="familias"><div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-10 lg:py-24"><div className="mb-12 grid gap-6 lg:grid-cols-[.7fr_1.3fr] lg:items-end"><div><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">02 / Familias</p><h2 className="mt-4 font-display text-[42px] leading-none tracking-[-.035em] lg:text-[54px]">Ocho direcciones.</h2></div><p className="max-w-[48ch] font-sans text-base leading-7 text-muted lg:justify-self-end">No son cajas cerradas ni parten de una sola materia. Son abstracciones construidas sobre relaciones que se repiten entre ingredientes; sirven para reconocer parentescos entre perfumes que, a simple vista, parecen muy distintos.</p></div>
        <figure className="mb-14 border-y border-line"><figcaption className="py-4 font-plex text-xs uppercase tracking-[.12em] text-muted">Materias, no mascotas — cada familia empieza en referencias físicas como estas</figcaption><ul className="flex snap-x gap-5 overflow-x-auto pb-5 lg:gap-6">{materiaStrip.map((m)=><li key={m.nombre} className="w-[220px] shrink-0 snap-start sm:w-[248px]"><div className="relative aspect-[4/5] overflow-hidden border border-line bg-soft/40"><Image src={m.src} alt={`${m.nombre}: materia asociada a la familia ${m.familia}.`} fill sizes="248px" style={{objectFit:"cover"}} /></div><p className="mt-3 font-display text-lg text-ink">{m.nombre}</p><p className="mt-1 font-sans text-xs leading-5 text-muted">{m.credito}</p><Link href={`/descubrir/familias/${m.slug}`} className="mt-2 inline-flex min-h-9 items-center font-plex text-[11px] uppercase tracking-[.12em] text-gold-contrast">Familia {m.familia} →</Link></li>)}</ul></figure>
        <div className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">{familias.map(([nombre,texto],index)=><article key={nombre} className="border-b border-line py-7 sm:pr-7 lg:min-h-52 lg:border-r lg:px-6"><span className="font-plex text-xs text-muted">{String(index+1).padStart(2,"0")}</span><h3 className="mt-6 font-display text-2xl">{nombre}</h3><p className="mt-3 font-sans text-sm leading-6 text-muted">{texto}</p></article>)}</div></div></section>

      <section id="concentracion" className="border-y border-line bg-soft/30"><div className="mx-auto max-w-[1120px] px-6 py-16 lg:px-10 lg:py-24"><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">03 / Concentración</p><div className="mt-5 grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><h2 className="max-w-[9ch] font-display text-[42px] leading-[.94] tracking-[-.035em] lg:text-[54px]">Qué cambia cuando cambia la concentración.</h2><p className="mt-5 max-w-[35ch] font-sans text-sm leading-6 text-muted">La proporción aromática orienta, pero no predice por sí sola duración, calidad ni personalidad. La barra sigue el punto medio de cada rango; el porcentaje exacto varía por fórmula.</p></div><div className="border-t border-line">{concentraciones.map(([nombre,pct,width])=><div key={nombre} className="grid gap-3 border-b border-line py-6 sm:grid-cols-[160px_1fr_70px] sm:items-center"><span className="font-display text-xl">{nombre}</span><span className="block h-1 bg-line" role="img" aria-label={`Concentrado aproximado: ${pct}`}><span className="block h-full bg-gold-contrast" style={{width}}/></span><span className="font-plex text-xs text-muted sm:text-right">{pct}</span></div>)}</div></div></div></section>

      <section id="historia"><div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-10 lg:py-24"><div className="mb-12"><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">04 / Historia</p><h2 className="mt-4 max-w-[13ch] font-display text-[42px] leading-[.94] tracking-[-.035em] lg:text-[54px]">Seis momentos, no seis mil años resumidos.</h2></div><ol className="grid gap-y-9 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-0">{timeline.map((item)=><li key={item.anio} className="relative border-l border-line pl-6 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-6"><span aria-hidden="true" className="absolute left-[-4px] top-0 h-[7px] w-[7px] bg-gold-contrast lg:left-0 lg:top-[-4px]" /><p className="font-display text-xl text-gold-contrast">{item.anio}</p><h3 className="mt-3 font-display text-2xl leading-tight">{item.titulo}</h3><p className="mt-3 font-sans text-sm leading-6 text-muted">{item.texto}</p></li>)}</ol></div></section>

      <section className="mx-auto max-w-[1320px] px-6 pb-20 lg:px-10 lg:pb-28"><div className="grid gap-8 border-t border-line pt-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">Seguir</p><h2 className="mt-4 max-w-[16ch] font-display text-[36px] leading-[.98] tracking-[-.03em]">Ahora vuelve a las historias y mira si algo huele distinto.</h2></div><div className="flex flex-wrap gap-6"><Link href="/magazine" className="nav-link text-sm text-ink">Ir a Historias</Link><Link href="/descubrir" className="nav-link text-sm text-ink">Abrir Discovery</Link></div></div></section>
    </main>
  );
}
