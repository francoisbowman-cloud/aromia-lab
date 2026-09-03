import Image from "next/image";
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
  { etiqueta: "0–15 min", titulo: "Salida", rol: "Primera impresión", texto: "Cítricos, especias ligeras y notas verdes suelen aparecer primero: brillantes, volátiles y breves." },
  { etiqueta: "15 min–2 h", titulo: "Corazón", rol: "Carácter", texto: "Flores, frutas y especias emergen cuando la salida se disipa y sostienen buena parte del carácter de la fragancia." },
  { etiqueta: "2+ h", titulo: "Fondo", rol: "Rastro y duración", texto: "Maderas, almizcles, resinas y ámbar permanecen más tiempo y sostienen el rastro final." },
];

const familias = [
  { nombre: "Cítrica", texto: "Bergamota, limón y mandarina: frescura luminosa y gran presencia en la salida.", href: "/descubrir/familias/citrica" },
  { nombre: "Floral", texto: "Rosa, jazmín y ylang-ylang: desde perfiles transparentes hasta composiciones opulentas.", href: "/descubrir/familias/floral" },
  { nombre: "Amaderada", texto: "Sándalo, cedro y vetiver: textura seca, cálida y estructural.", href: "/descubrir/familias/amaderada" },
  { nombre: "Amberada / oriental", texto: "Ámbar, vainilla y resinas: calidez, densidad y sensación envolvente.", href: "/descubrir/familias/ambar-oriental" },
  { nombre: "Chipre", texto: "Bergamota, musgo de roble y labdanum: contraste entre luz cítrica y fondo terroso.", href: "/descubrir/familias/chipre" },
  { nombre: "Acuática / fresca", texto: "Acordes marinos y ozónicos que evocan aire, agua y limpieza.", href: "/descubrir/familias/acuatica" },
  { nombre: "Especiada", texto: "Canela, cardamomo y pimienta rosa: calor, tensión y carácter.", href: null },
  { nombre: "Gourmand", texto: "Vainilla, cacao y notas dulces inspiradas en sabores y postres.", href: "/descubrir/familias/gourmand" },
] as const;

const materialStrip = [
  {
    name: "Bergamota",
    family: "Cítrica",
    href: "/descubrir/familias/citrica",
    src: "https://upload.wikimedia.org/wikipedia/commons/7/77/Bergamotfruit.jpg",
    alt: "Fruto de bergamota de Calabria.",
    credit: "Xenocryst / Antares Scorpii · CC BY-SA 2.0",
  },
  {
    name: "Rosa",
    family: "Floral",
    href: "/descubrir/familias/floral",
    src: "https://upload.wikimedia.org/wikipedia/commons/2/26/Pretty_Pink_Rose_Closeup.jpg",
    alt: "Primer plano documental de una rosa rosada.",
    credit: "Jon Sullivan · CC0 1.0",
  },
  {
    name: "Sándalo",
    family: "Amaderada",
    href: "/descubrir/familias/amaderada",
    src: "https://upload.wikimedia.org/wikipedia/commons/c/c2/Santalum_album.jpg",
    alt: "Santalum album, árbol de sándalo.",
    credit: "Shyamal · CC BY-SA 4.0",
  },
  {
    name: "Incienso",
    family: "Ámbar / Oriental",
    href: "/descubrir/familias/ambar-oriental",
    src: "/editorial-v1/frankincense-documentary.jpg",
    alt: "Boswellia sacra, árbol del incienso, en Dhofar, Omán.",
    credit: "Krzysztof Ziarnek (Kenraiz) · CC BY-SA 4.0",
  },
  {
    name: "Salvia romana",
    family: "Aromática",
    href: "/descubrir/familias/aromatica",
    src: "/editorial-v1/clary-sage-documentary.jpg",
    alt: "Salvia sclarea, salvia romana.",
    credit: "Llez · CC BY-SA 3.0",
  },
  {
    name: "Pachulí",
    family: "Amaderada",
    href: "/descubrir/familias/amaderada",
    src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Patchouli.jpg",
    alt: "Pogostemon cablin, planta de pachulí.",
    credit: "Joe Laurence / Seychelles News Agency · CC BY 4.0",
  },
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

      <section id="estructura" className="border-y border-line">
        <div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[.58fr_1.42fr]">
            <div>
              <p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">01 / Estructura</p>
              <h2 className="mt-4 max-w-[8ch] font-display text-[42px] leading-[.94] tracking-[-.035em] lg:text-[54px]">La pirámide olfativa.</h2>
              <p className="mt-5 max-w-[34ch] font-sans text-sm leading-6 text-muted">Una fragancia cambia con el tiempo. La pirámide es una forma útil —aunque simplificada— de seguir ese movimiento.</p>
            </div>
            <div>
              <div className="mb-5 flex items-center gap-4 font-plex text-[10px] uppercase tracking-[.14em] text-muted" aria-hidden="true">
                <span>Aplicación</span><span className="h-px flex-1 bg-line" /><span>Horas después</span>
              </div>
              <ol className="border-y border-line">
                {piramide.map((tier,index)=>(
                  <li key={tier.titulo} className="relative grid gap-4 border-b border-line py-7 last:border-b-0 sm:grid-cols-[84px_1fr_1fr] sm:items-start">
                    <span className="font-plex text-xs uppercase tracking-[.12em] text-muted">{tier.etiqueta}</span>
                    <div><p className="font-plex text-[10px] uppercase tracking-[.14em] text-gold-contrast">0{index+1} · {tier.rol}</p><h3 className="mt-2 font-display text-[30px] leading-none">{tier.titulo}</h3></div>
                    <p className="font-sans text-sm leading-6 text-muted">{tier.texto}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section id="familias">
        <div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-10 lg:py-24">
          <div className="mb-10 grid gap-6 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
            <div><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">02 / Familias</p><h2 className="mt-4 font-display text-[42px] leading-none tracking-[-.035em] lg:text-[54px]">Ocho direcciones.</h2></div>
            <div className="lg:justify-self-end"><p className="max-w-[48ch] font-sans text-base leading-7 text-muted">No son cajas cerradas. Son una primera orientación para reconocer parentescos entre perfumes que, a simple vista, pueden parecer muy distintos.</p><Link href="/descubrir/familias" className="mt-4 inline-flex min-h-11 items-center border-b border-ink font-plex text-xs uppercase tracking-[.12em] text-ink">Explorar las diez familias en Discovery →</Link></div>
          </div>

          <div className="grid grid-cols-2 border-y border-line sm:grid-cols-3 lg:grid-cols-6">
            {materialStrip.map((material,index)=> {
              const external = /^https?:\/\//.test(material.src);
              return <Link key={material.name} href={material.href} className={`group min-w-0 border-line py-4 ${index % 2 === 0 ? "pr-2" : "pl-2"} sm:px-2 lg:border-r lg:px-3 lg:last:border-r-0`}>
                <figure>
                  <div className="relative aspect-[4/5] overflow-hidden bg-soft">
                    <Image src={material.src} alt={material.alt} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw" unoptimized={external} style={{objectFit:"cover"}} />
                  </div>
                  <figcaption className="pt-3">
                    <span className="block font-display text-lg leading-none text-ink transition group-hover:opacity-70">{material.name}</span>
                    <span className="mt-1 block font-plex text-[9px] uppercase tracking-[.12em] text-muted">{material.family}</span>
                    <span className="mt-2 block font-sans text-[9px] leading-4 text-muted">{material.credit}</span>
                  </figcaption>
                </figure>
              </Link>;
            })}
          </div>

          <div className="mt-10 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {familias.map((family,index)=>{
              const body = <><span className="font-plex text-xs text-muted">{String(index+1).padStart(2,"0")}</span><h3 className="mt-6 font-display text-2xl">{family.nombre}</h3><p className="mt-3 font-sans text-sm leading-6 text-muted">{family.texto}</p>{family.href ? <span className="mt-5 inline-flex font-plex text-[10px] uppercase tracking-[.12em] text-[var(--aromia-editorial-accent)]">Abrir familia →</span> : null}</>;
              return family.href ? <Link key={family.nombre} href={family.href} className="group border-b border-line py-7 sm:pr-7 lg:min-h-56 lg:border-r lg:px-6">{body}</Link> : <article key={family.nombre} className="border-b border-line py-7 sm:pr-7 lg:min-h-56 lg:border-r lg:px-6">{body}</article>;
            })}
          </div>
        </div>
      </section>

      <section id="concentracion" className="border-y border-line bg-soft/30"><div className="mx-auto max-w-[1120px] px-6 py-16 lg:px-10 lg:py-24"><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">03 / Concentración</p><div className="mt-5 grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><h2 className="max-w-[9ch] font-display text-[42px] leading-[.94] tracking-[-.035em] lg:text-[54px]">Qué cambia cuando cambia la concentración.</h2><p className="mt-5 max-w-[35ch] font-sans text-sm leading-6 text-muted">La proporción aromática orienta, pero no predice por sí sola duración, calidad ni personalidad. La barra sigue el punto medio de cada rango; el porcentaje exacto varía por fórmula.</p></div><div className="border-t border-line">{concentraciones.map(([nombre,pct,width])=><div key={nombre} className="grid gap-3 border-b border-line py-6 sm:grid-cols-[160px_1fr_70px] sm:items-center"><span className="font-display text-xl">{nombre}</span><span className="block h-1 bg-line" role="img" aria-label={`Concentrado aproximado: ${pct}`}><span className="block h-full bg-gold-contrast" style={{width}}/></span><span className="font-plex text-xs text-muted sm:text-right">{pct}</span></div>)}</div></div></div></section>

      <section id="historia">
        <div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-10 lg:py-24">
          <div className="mb-12"><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">04 / Historia</p><h2 className="mt-4 max-w-[13ch] font-display text-[42px] leading-[.94] tracking-[-.035em] lg:text-[54px]">Seis momentos, no seis mil años resumidos.</h2></div>
          <ol className="grid border-l border-line pl-6 sm:grid-cols-2 sm:border-l-0 sm:border-t sm:pl-0 lg:grid-cols-6">
            {timeline.map((item,index)=><li key={item.anio} className="relative border-b border-line py-8 sm:border-b-0 sm:border-r sm:px-5 sm:last:border-r-0">
              <span className="absolute -left-[29px] top-9 h-2 w-2 rounded-full bg-ink sm:-top-[5px] sm:left-5" aria-hidden="true" />
              <p className="font-display text-xl text-gold-contrast">{item.anio}</p>
              <p className="mt-2 font-plex text-[9px] uppercase tracking-[.13em] text-muted">0{index+1}</p>
              <h3 className="mt-5 font-display text-2xl">{item.titulo}</h3>
              <p className="mt-3 font-sans text-sm leading-6 text-muted">{item.texto}</p>
            </li>)}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-6 pb-20 lg:px-10 lg:pb-28"><div className="grid gap-8 border-t border-line pt-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="font-plex text-xs uppercase tracking-[.14em] text-[var(--aromia-editorial-accent)]">Seguir</p><h2 className="mt-4 max-w-[16ch] font-display text-[36px] leading-[.98] tracking-[-.03em]">Ahora vuelve a las historias y mira si algo huele distinto.</h2></div><div className="flex flex-wrap gap-6"><Link href="/magazine" className="nav-link text-sm text-ink">Ir a Historias</Link><Link href="/descubrir" className="nav-link text-sm text-ink">Abrir Discovery</Link></div></div></section>
    </main>
  );
}
