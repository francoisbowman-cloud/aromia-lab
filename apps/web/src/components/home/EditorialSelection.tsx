import Link from "next/link";
import type { Perfume } from "@/lib/types";

const EYEBROW =
  "font-sans text-[11px] uppercase tracking-[.24em] text-gold-contrast font-semibold";

// La API devuelve precio_referencia como string numérico ("435.00") pese al
// tipo `number` declarado en lib/types.ts — mismo patrón defensivo que ya
// usan PerfumeCard/HeroEditorPick (Number(...) antes de formatear).
function formatPrice(perfume: Perfume) {
  return Number(perfume.precio_referencia).toLocaleString("es-AR", {
    style: "currency",
    currency: perfume.moneda,
  });
}

/**
 * "Reseñas destacadas" como selección editorial — un feature grande +
 * lista de filas, no un grid de cards. Recibe los mismos `destacados` que
 * antes alimentaban FeaturedCarousel; solo cambia la presentación.
 */
export function EditorialSelection({ perfumes }: { perfumes: Perfume[] }) {
  const [feature, ...rest] = perfumes;
  if (!feature) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 lg:px-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_.9fr]">
        <Link
          href={`/catalogo/${feature.slug}`}
          className="group relative block min-h-[360px] overflow-hidden rounded-card bg-soft"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- mismo criterio que PerfumeCard/HeroEditorPick: fondo hotlinked, sin recorte de canvas acá porque es un solo feature, no un grid */}
          <img
            src={feature.imagen_url}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute inset-x-6 bottom-5 text-white">
            <p className="font-plex text-[10px] uppercase tracking-[.16em] text-gold-dark">
              Elección del editor
            </p>
            <p className="mt-2 font-display text-2xl font-semibold lg:text-[32px]">
              {feature.nombre}
            </p>
            <p className="mt-1.5 font-plex text-[13px] opacity-85">
              {feature.marca} · {formatPrice(feature)}
            </p>
          </div>
        </Link>

        <div className="flex flex-col">
          <p className={EYEBROW}>Reseñas destacadas</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink lg:text-3xl">
            Lo que está mirando la comunidad
          </h2>
          <p className="mt-3 max-w-[38ch] font-sans text-sm text-muted">
            Una selección con criterio editorial, no un listado más del catálogo.
          </p>

          <div className="mt-6 flex flex-1 flex-col">
            {rest.slice(0, 3).map((perfume, index) => (
              <Link
                key={perfume.slug}
                href={`/catalogo/${perfume.slug}`}
                className="flex items-baseline gap-3.5 border-t border-line py-3.5 last:border-b last:border-line hover:text-gold-contrast"
              >
                <span className="font-plex text-[10px] tracking-[.08em] text-gold-contrast">
                  N°{String(index + 2).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="block font-sans text-sm font-semibold text-ink">
                    {perfume.nombre}
                  </span>
                  <span className="block font-sans text-xs text-muted">{perfume.marca}</span>
                </span>
                <span className="font-plex text-xs text-ink">{formatPrice(perfume)}</span>
              </Link>
            ))}
          </div>

          <Link
            href="/catalogo"
            className="nav-link mt-5 self-start font-sans text-sm text-ink transition hover:text-gold-contrast"
          >
            Ver todo el catálogo →
          </Link>
        </div>
      </div>
    </section>
  );
}
