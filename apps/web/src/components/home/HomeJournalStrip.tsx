import Link from "next/link";
import type { Article } from "@/lib/types";

export function HomeJournalStrip({ articulos }: { articulos: Article[] }) {
  const items = articulos.filter((a) => a.categoria !== "academia").slice(0, 3);
  if (items.length === 0) return null;

  return (
    <section className="border-t border-line bg-[#fbf8f3] py-16 dark:bg-[#0f0c09] lg:py-20">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10 xl:px-14">
        <div className="mb-7 flex items-center justify-between gap-5 border-b border-line pb-4">
          <p className="font-plex text-[10px] uppercase tracking-[.2em] text-ink">Journal — historias que inspiran</p>
          <Link href="/magazine" className="nav-link font-sans text-xs text-muted transition hover:text-gold-contrast">Ver todas las historias →</Link>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {items.map((article, index) => (
            <Link key={article.slug} href={`/magazine/${article.slug}`} className="group grid min-h-[260px] overflow-hidden border border-line bg-[#fffdf9] transition hover:border-gold hover:shadow-lux dark:bg-[#15110d] sm:grid-cols-[.9fr_1.1fr] lg:grid-cols-1 xl:grid-cols-[.92fr_1.08fr]">
              <div className="flex flex-col justify-between p-6">
                <div>
                  <p className="font-plex text-[8px] uppercase tracking-[.16em] text-gold-contrast">{article.categoria} / 0{index + 1}</p>
                  <h3 className="mt-4 font-display text-[28px] font-medium leading-[1.02] text-ink">{article.titulo}</h3>
                  {article.meta_description ? <p className="mt-4 line-clamp-3 font-sans text-xs leading-5 text-muted">{article.meta_description}</p> : null}
                </div>
                <p className="mt-7 font-plex text-[9px] uppercase tracking-[.14em] text-ink">Leer artículo <span className="ml-3 transition-transform group-hover:translate-x-1">→</span></p>
              </div>
              <div className="relative min-h-[190px] overflow-hidden bg-[linear-gradient(145deg,#efe3d1,#f9f4eb)] dark:bg-[linear-gradient(145deg,#1b140f,#100d0a)]">
                {article.imagen_portada_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- remote article asset
                  <img src={article.imagen_portada_url} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
                ) : <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(200,168,107,.36),transparent_30%),linear-gradient(145deg,#f3e7d5,#faf6ee)] dark:bg-[radial-gradient(circle_at_70%_35%,rgba(200,168,107,.14),transparent_30%),linear-gradient(145deg,#1b140f,#100d0a)]" />}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
