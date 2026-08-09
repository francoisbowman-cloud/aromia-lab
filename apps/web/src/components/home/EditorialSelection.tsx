import Link from "next/link";
import type { Perfume } from "@/lib/types";

const EYEBROW =
  "font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast font-semibold";

function formatPrice(perfume: Perfume) {
  return Number(perfume.precio_referencia).toLocaleString("es-AR", {
    style: "currency",
    currency: perfume.moneda,
  });
}

/**
 * Selección editorial: un protagonista tratado como objeto de revista +
 * tres referencias de apoyo. Evita recortar agresivamente la foto de
 * catálogo mientras aún no existen assets editoriales finales.
 */
export function EditorialSelection({ perfumes }: { perfumes: Perfume[] }) {
  const [feature, ...rest] = perfumes;
  if (!feature) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 lg:px-10">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-5 border-b border-line pb-5">
        <div>
          <p className={EYEBROW}>Reseñas destacadas</p>
          <h2 className="mt-2 font-display text-3xl font-medium leading-tight text-ink lg:text-[42px]">
            Lo que está mirando la comunidad
          </h2>
        </div>
        <p className="max-w-[34ch] font-sans text-xs leading-5 text-muted lg:text-right">
          Selección editorial sobre el catálogo real: menos escaparate, más contexto para elegir.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.28fr_.72fr] lg:gap-10">
        <Link href={`/catalogo/${feature.slug}`} className="group block">
          <div className="relative min-h-[430px] overflow-hidden bg-[#f2eadc] dark:bg-[#17120d] lg:min-h-[560px]">
            <div className="absolute left-5 top-5 z-[1] flex items-center gap-3 font-plex text-[9px] uppercase tracking-[.16em] text-[rgba(33,29,23,.55)] dark:text-[rgba(242,235,221,.58)]">
              <span>N°01</span>
              <span className="h-px w-8 bg-current opacity-40" />
              <span>Elección del editor</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element -- asset remoto del catálogo actual; se sustituirá por asset editorial propio */}
            <img
              src={feature.imagen_url}
              alt={`${feature.nombre} de ${feature.marca}`}
              className="absolute inset-0 h-full w-full object-contain p-14 transition-transform duration-700 group-hover:scale-[1.025] sm:p-20 lg:p-24"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#f2eadc] via-[#f2eadc]/65 to-transparent dark:from-[#17120d] dark:via-[#17120d]/65" />
            <div className="absolute inset-x-5 bottom-5 z-[1] flex items-end justify-between gap-4">
              <div>
                <p className="font-display text-2xl font-semibold leading-none text-ink lg:text-[34px]">
                  {feature.nombre}
                </p>
                <p className="mt-2 font-plex text-[11px] uppercase tracking-[.1em] text-muted">
                  {feature.marca}
                </p>
              </div>
              <span className="font-plex text-xs text-ink">{formatPrice(feature)}</span>
            </div>
          </div>
        </Link>

        <div className="flex flex-col justify-between">
          <div className="flex flex-col border-t border-line">
            {rest.slice(0, 3).map((perfume, index) => (
              <Link
                key={perfume.slug}
                href={`/catalogo/${perfume.slug}`}
                className="group grid grid-cols-[38px_1fr_auto] items-baseline gap-3 border-b border-line py-5 transition-[padding] hover:pl-2"
              >
                <span className="font-plex text-[10px] tracking-[.08em] text-gold-contrast">
                  N°{String(index + 2).padStart(2, "0")}
                </span>
                <span>
                  <span className="block font-display text-xl text-ink transition-colors group-hover:text-gold-contrast">
                    {perfume.nombre}
                  </span>
                  <span className="mt-1 block font-sans text-xs text-muted">{perfume.marca}</span>
                </span>
                <span className="font-plex text-[11px] text-ink">{formatPrice(perfume)}</span>
              </Link>
            ))}
          </div>

          <Link
            href="/catalogo"
            className="nav-link mt-8 self-start font-sans text-sm text-ink transition hover:text-gold-contrast"
          >
            Ver todo el catálogo →
          </Link>
        </div>
      </div>
    </section>
  );
}
