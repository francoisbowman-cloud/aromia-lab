"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { EditorialIndexItem } from "@/lib/editorialIndex";
import styles from "./EditorialArchive.module.css";

const FILTERS = ["Todas", "Historias", "Materia", "Personas", "Reflexión", "Análisis"] as const;
type Filter = (typeof FILTERS)[number];
function currentFilter(): Filter {
  const value = new URLSearchParams(window.location.search).get("territorio");
  return FILTERS.find(filter => filter === value) ?? "Todas";
}
function CoverVisual({ item }: { item: EditorialIndexItem }) {
  if (!item.imageUrl) return null;
  return <figure className={styles.visual}>
    <div className={styles.image}><Image src={item.imageUrl} alt={item.imageAlt ?? item.title} fill sizes="(max-width: 700px) 100vw, 65vw" unoptimized={/^https?:/.test(item.imageUrl)} style={{ objectFit: "cover" }} /></div>
    {item.imageCredit && <figcaption>{item.imageCredit}</figcaption>}
  </figure>;
}
export function EditorialArchive({ items }: { items: EditorialIndexItem[] }) {
  const [active, setActive] = useState<Filter>("Todas");
  useEffect(() => {
    const restore = () => setActive(currentFilter());
    restore(); window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  function select(filter: Filter) {
    const url = new URL(window.location.href);
    if (filter === "Todas") url.searchParams.delete("territorio"); else url.searchParams.set("territorio", filter);
    window.history.pushState(null, "", url); setActive(filter);
  }
  const filtered = useMemo(() => items.filter(item => item.territory !== "Guías" && (active === "Todas" || item.territory === active)), [active, items]);
  const hero = filtered.find(item => item.nivel === "n1" && item.imageUrl);
  const featured = filtered.filter(item => item.nivel === "n2" && item.href !== hero?.href).slice(0, 3);
  const featuredHrefs = new Set(featured.map(item => item.href));
  const stream = filtered.filter(item => item.href !== hero?.href && !featuredHrefs.has(item.href));
  return <div className={styles.archive}>
    <header className={styles.header}><h1>Historias</h1><p>Perfumes, materias y las personas que los conectan.</p></header>
    <div className={styles.filterRow}>
      <div className={styles.filters} aria-label="Filtrar historias por territorio">{FILTERS.map(filter => <button key={filter} type="button" onClick={() => select(filter)} aria-pressed={active === filter} aria-controls="archive-results">{filter}</button>)}</div>
      <p role="status">{filtered.length} lecturas</p>
    </div>
    <section id="archive-results" aria-label="Historias disponibles">
      {filtered.length === 0 && <div className={styles.empty}><p>Todavía no hay historias en este territorio.</p><button onClick={() => select("Todas")}>Ver todas las historias</button></div>}
      {hero && <Link href={hero.href} className={styles.hero}>
        <div className={styles.heroCopy}><h2>{hero.title}</h2><p>{hero.summary}</p><span className={styles.read}>Leer historia <ArrowUpRight aria-hidden="true" size={22} /></span></div>
        <CoverVisual item={hero} />
      </Link>}
      {featured.map(item => <Link key={item.href} href={item.href} className={styles.feature}>
        <CoverVisual item={item} /><div><p className={styles.territory}>{item.territory}</p><h2>{item.title}</h2><p>{item.summary}</p><span className={styles.read}>Leer historia <ArrowUpRight aria-hidden="true" size={22} /></span></div>
      </Link>)}
      {stream.length > 0 && <div className={styles.stream}><h2>Más historias</h2>{stream.map(item => <Link key={item.href} href={item.href} className={item.nivel === "n4" ? styles.note : styles.row}>
        {item.nivel !== "n4" && item.imageUrl && <CoverVisual item={item} />}
        <div><p className={styles.territory}>{item.territory}</p><h3>{item.title}</h3></div><ArrowUpRight aria-hidden="true" size={24} />
      </Link>)}</div>}
    </section>
  </div>;
}
