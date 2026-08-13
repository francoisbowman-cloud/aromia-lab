import Link from "next/link";
import { getArticulos, getPerfumes } from "@/lib/api";
import { HomeHero } from "@/components/home/HomeHero";
import { MaterialStatement } from "@/components/home/MaterialStatement";
import { EditorialSelection } from "@/components/home/EditorialSelection";
import { OlfactiveIndex } from "@/components/home/OlfactiveIndex";
import { SensoryInterlude } from "@/components/home/SensoryInterlude";
import { HomeCatalogPreview } from "@/components/home/HomeCatalogPreview";
import { HomeJournalStrip } from "@/components/home/HomeJournalStrip";
import { CATEGORIAS_PRINCIPALES } from "@/lib/olfactiveCategories";

export const dynamic = "force-dynamic";

const benefits = [
  { icon: "✦", title: "Curaduría experta", copy: "Selección editorial para comparar con contexto, no por impulso." },
  { icon: "◇", title: "Comparación clara", copy: "Familias, rendimiento y precio de referencia en un mismo lenguaje." },
  { icon: "↗", title: "Discovery personal", copy: "Rutas por sensación y un quiz para acercarte a tu firma olfativa." },
  { icon: "◎", title: "Contexto editorial", copy: "Historias, cultura y guías para entender qué hace especial a cada objeto." },
];

export default async function Home() {
  const [perfumes, articulos] = await Promise.all([getPerfumes(), getArticulos()]);

  const visuales = perfumes.filter((p) => Boolean(p.imagen_url));
  const conRating = visuales.filter((p) => p.rating_promedio);
  const destacados = (conRating.length >= 5 ? conRating : visuales.length >= 5 ? visuales : perfumes).slice(0, 8);
  const heroPerfume = destacados[0] ?? perfumes[0];

  const familias = Array.from(new Set(perfumes.map((p) => p.familia_olfativa).filter((f): f is string => Boolean(f)))).sort((a, b) => a.localeCompare(b, "es"));
  const familiasPresentes = new Set(familias);
  const categoriasConResultados = CATEGORIAS_PRINCIPALES.filter((c) => c.familias.some((f) => familiasPresentes.has(f)));
  const articulosOrdenados = [...articulos].sort((a, b) => (a.publicado_en < b.publicado_en ? 1 : -1));

  return (
    <main className="overflow-hidden bg-bg text-ink">
      <HomeHero perfume={heroPerfume} />

      <MaterialStatement />

      {destacados.length > 0 ? (
        <section className="bg-[#fffdfa] py-16 dark:bg-[#0f0c09] lg:py-20">
          <EditorialSelection perfumes={destacados} />
        </section>
      ) : null}

      {categoriasConResultados.length > 0 ? <OlfactiveIndex categorias={categoriasConResultados} /> : null}

      <SensoryInterlude />

      <HomeCatalogPreview perfumes={destacados.length >= 5 ? destacados : perfumes} familias={familias} />

      <HomeJournalStrip articulos={articulosOrdenados} />

      <section className="border-y border-line bg-[#fffdf9] dark:bg-[#14100c]">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-10 xl:px-14">
          {benefits.map((benefit, index) => (
            <div key={benefit.title} className={`grid grid-cols-[40px_1fr] gap-4 py-8 ${index > 0 ? "border-t border-line sm:border-t-0 lg:border-l lg:pl-8" : ""} ${index % 2 === 1 ? "sm:border-l sm:pl-8" : ""}`}>
              <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/60 font-display text-lg text-gold-contrast" aria-hidden="true">{benefit.icon}</span>
              <div><h2 className="font-display text-lg text-ink">{benefit.title}</h2><p className="mt-1 max-w-[27ch] font-sans text-[11px] leading-5 text-muted">{benefit.copy}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f8f1e6] dark:bg-[#0e0c0a]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between gap-6 px-6 py-10 sm:flex-row sm:items-center lg:px-10 xl:px-14">
          <div><p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Club Aromia</p><p className="mt-2 font-display text-2xl text-ink">La conversación continúa después del perfume.</p></div>
          <div className="flex items-center gap-6"><Link href="/club" className="nav-link font-sans text-sm text-ink">Entrar al círculo →</Link><Link href="/quiz" className="nav-link font-sans text-sm text-muted">Hacer el quiz</Link></div>
        </div>
      </section>
    </main>
  );
}
