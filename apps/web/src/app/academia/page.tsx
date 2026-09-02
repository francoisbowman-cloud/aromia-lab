import Link from "next/link";

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

const piramide = [
  { etiqueta: "Salida · 0–15 minutos", titulo: "Notas de salida", texto: "Cítricos, especias ligeras y notas verdes suelen formar la primera impresión: brillante, volátil y breve." },
  { etiqueta: "Corazón · 15 min – 2 horas", titulo: "Notas de corazón", texto: "Flores, frutas y especias aparecen cuando la salida se disipa y definen buena parte del carácter de la fragancia." },
  { etiqueta: "Fondo · 2+ horas", titulo: "Notas de fondo", texto: "Maderas, almizcles, resinas y ámbar permanecen más tiempo sobre la piel y sostienen el rastro final del perfume." },
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

const concentraciones = [
  ["Parfum / Extrait", "20–40%", "100%"],
  ["Eau de Parfum", "15–20%", "65%"],
  ["Eau de Toilette", "5–15%", "35%"],
  ["Eau de Cologne", "2–4%", "15%"],
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

      <section id="estructura" className="border-y border-line"><div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-10 lg:py-24"><div className="grid gap-12 lg:grid-cols-[.6fr_1.4fr]"><div><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">01 / Estructura</p><h2 className="mt-4 max-w-[8ch] font-display text-[42px] leading-[.94] tracking-[-.035em] lg:text-[54px]">La pirámide olfativa.</h2><p className="mt-5 max-w-[34ch] font-sans text-sm leading-6 text-muted">Una fragancia cambia con el tiempo. La pirámide es una forma útil —aunque simplificada— de seguir ese movimiento.</p></div><div className="border-t border-line">{piramide.map((tier, index)=><article key={tier.titulo} className="grid gap-4 border-b border-line py-7 sm:grid-cols-[80px_1fr_1fr]"><span className="font-plex text-xs text-muted">0{index+1}</span><div><p className="font-plex text-xs uppercase tracking-[.12em] text-gold-contrast">{tier.etiqueta}</p><h3 className="mt-2 font-display text-2xl">{tier.titulo}</h3></div><p className="font-sans text-sm leading-6 text-muted">{tier.texto}</p></article>)}</div></div></div></section>

      <section id="familias"><div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-10 lg:py-24"><div className="mb-12 grid gap-6 lg:grid-cols-[.7fr_1.3fr] lg:items-end"><div><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">02 / Familias</p><h2 className="mt-4 font-display text-[42px] leading-none tracking-[-.035em] lg:text-[54px]">Ocho direcciones.</h2></div><p className="max-w-[48ch] font-sans text-base leading-7 text-muted lg:justify-self-end">No son cajas cerradas. Son una primera orientación para reconocer parentescos entre perfumes que, a simple vista, pueden parecer muy distintos.</p></div><div className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">{familias.map(([nombre,texto],index)=><article key={nombre} className="border-b border-line py-7 sm:pr-7 lg:min-h-52 lg:border-r lg:px-6"><span className="font-plex text-xs text-muted">{String(index+1).padStart(2,"0")}</span><h3 className="mt-6 font-display text-2xl">{nombre}</h3><p className="mt-3 font-sans text-sm leading-6 text-muted">{texto}</p></article>)}</div></div></section>

      <section id="concentracion" className="border-y border-line bg-soft/30"><div className="mx-auto max-w-[1120px] px-6 py-16 lg:px-10 lg:py-24"><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">03 / Concentración</p><div className="mt-5 grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><h2 className="max-w-[9ch] font-display text-[42px] leading-[.94] tracking-[-.035em] lg:text-[54px]">Qué cambia cuando cambia la concentración.</h2><p className="mt-5 max-w-[35ch] font-sans text-sm leading-6 text-muted">La proporción aromática orienta, pero no predice por sí sola duración, calidad ni personalidad.</p></div><div className="border-t border-line">{concentraciones.map(([nombre,pct,width])=><div key={nombre} className="grid gap-3 border-b border-line py-6 sm:grid-cols-[160px_1fr_70px] sm:items-center"><span className="font-display text-xl">{nombre}</span><span className="h-1 bg-line"><span className="block h-full bg-gold-contrast" style={{width}}/></span><span className="font-plex text-xs text-muted sm:text-right">{pct}</span></div>)}</div></div></div></section>

      <section id="historia"><div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-10 lg:py-24"><div className="mb-12"><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">04 / Historia</p><h2 className="mt-4 max-w-[13ch] font-display text-[42px] leading-[.94] tracking-[-.035em] lg:text-[54px]">Seis momentos, no seis mil años resumidos.</h2></div><div className="grid gap-x-12 gap-y-10 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-3">{timeline.map((item)=><article key={item.anio}><p className="font-display text-xl text-gold-contrast">{item.anio}</p><h3 className="mt-4 font-display text-2xl">{item.titulo}</h3><p className="mt-3 font-sans text-sm leading-6 text-muted">{item.texto}</p></article>)}</div></div></section>

      <section className="mx-auto max-w-[1320px] px-6 pb-20 lg:px-10 lg:pb-28"><div className="grid gap-8 border-t border-line pt-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">Seguir</p><h2 className="mt-4 max-w-[16ch] font-display text-[36px] leading-[.98] tracking-[-.03em]">Ahora vuelve a las historias y mira si algo huele distinto.</h2></div><div className="flex flex-wrap gap-6"><Link href="/magazine" className="nav-link text-sm text-ink">Ir a Historias</Link><Link href="/descubrir" className="nav-link text-sm text-ink">Abrir Discovery</Link></div></div></section>
    </main>
  );
}
