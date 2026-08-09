import Link from "next/link";
import type { Perfume } from "@/lib/types";

const EYEBROW = "font-sans text-[10px] uppercase tracking-[.28em] text-gold-contrast font-semibold";

function formatPrice(perfume: Perfume) {
  if (perfume.precio_referencia == null || !perfume.moneda) return "Precio por verificar";
  return Number(perfume.precio_referencia).toLocaleString("es-AR", { style: "currency", currency: perfume.moneda });
}

export function EditorialSelection({ perfumes }: { perfumes: Perfume[] }) {
  const [feature, ...rest] = perfumes;
  if (!feature) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 lg:px-10">
      <div className="mb-10 grid grid-cols-1 gap-6 border-b border-line pb-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className={EYEBROW}>Selección Aromia · Edit 01</p>
          <h2 className="mt-3 max-w-[11ch] font-display text-[40px] font-medium leading-[.94] tracking-[-.025em] text-ink lg:text-[58px]">Cuatro perfumes. Cuatro formas de ocupar una habitación.</h2>
        </div>
        <p className="max-w-[34ch] font-sans text-xs leading-5 text-muted lg:pb-1 lg:text-right">Una edición breve del catálogo real: escogida para comparar carácter, no popularidad.</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr_.65fr] lg:gap-14">
        <Link href={`/catalogo/${feature.slug}`} className="group block">
          <div className="relative min-h-[480px] overflow-hidden bg-[radial-gradient(circle_at_54%_42%,#fffdf7_0%,#f1e7d7_54%,#e4d6c2_100%)] dark:bg-[radial-gradient(circle_at_54%_42%,#211a13_0%,#15100c_62%,#0e0b08_100%)] lg:min-h-[610px]">
            <div className="absolute inset-x-5 top-5 z-[2] flex items-center gap-3 font-plex text-[9px] uppercase tracking-[.18em] text-muted"><span>01</span><span className="h-px w-10 bg-current opacity-40" /><span>Editor&apos;s object</span></div>
            <span aria-hidden="true" className="absolute -right-4 top-8 font-display text-[130px] leading-none text-[rgba(182,138,68,.08)] lg:text-[220px] dark:text-[rgba(200,168,107,.06)]">01</span>
            {feature.imagen_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote catalog asset
              <img src={feature.imagen_url} alt={`${feature.nombre} de ${feature.marca}`} className="absolute inset-0 h-full w-full object-contain p-16 drop-shadow-[0_30px_28px_rgba(82,56,27,.14)] transition-transform duration-700 group-hover:scale-[1.025] sm:p-20 lg:p-24" />
            ) : (
              <div className="absolute inset-0 grid place-items-center font-plex text-[9px] uppercase tracking-[.16em] text-muted">Imagen editorial pendiente</div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(0deg,#efe4d3_0%,rgba(239,228,211,.8)_42%,transparent_100%)] dark:bg-[linear-gradient(0deg,#14100c_0%,rgba(20,16,12,.82)_42%,transparent_100%)]" />
            <div className="absolute inset-x-6 bottom-6 z-[2] flex items-end justify-between gap-5">
              <div><p className="font-display text-[30px] font-semibold leading-none text-ink lg:text-[42px]">{feature.nombre}</p><p className="mt-2 font-plex text-[10px] uppercase tracking-[.14em] text-muted">{feature.marca}</p></div>
              <div className="text-right"><p className="font-plex text-[9px] uppercase tracking-[.12em] text-muted">Referencia</p><span className="mt-1 block font-plex text-xs text-ink">{formatPrice(feature)}</span></div>
            </div>
          </div>
        </Link>

        <div className="flex flex-col justify-between">
          <div>
            <p className="mb-5 font-display text-xl italic text-muted">The supporting cast</p>
            <div className="flex flex-col border-t border-line">
              {rest.slice(0, 3).map((perfume, index) => (
                <Link key={perfume.slug} href={`/catalogo/${perfume.slug}`} className="group grid grid-cols-[32px_1fr] gap-x-4 border-b border-line py-6 sm:grid-cols-[32px_1fr_auto]">
                  <span className="font-plex text-[9px] tracking-[.12em] text-gold-contrast">0{index + 2}</span>
                  <span><span className="block font-display text-[24px] leading-none text-ink transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-gold-contrast">{perfume.nombre}</span><span className="mt-2 block font-plex text-[9px] uppercase tracking-[.12em] text-muted">{perfume.marca}</span></span>
                  <span className="col-start-2 mt-3 font-plex text-[10px] text-muted sm:col-start-auto sm:mt-1">{formatPrice(perfume)}</span>
                </Link>
              ))}
            </div>
          </div>
          <Link href="/catalogo" className="nav-link mt-10 self-start font-sans text-sm text-ink transition hover:text-gold-contrast">Abrir la edición completa →</Link>
        </div>
      </div>
    </section>
  );
}
