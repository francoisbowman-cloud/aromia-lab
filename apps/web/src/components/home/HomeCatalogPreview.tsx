import Link from "next/link";
import type { Perfume } from "@/lib/types";

function price(perfume: Perfume) {
  if (perfume.precio_referencia == null || !perfume.moneda) return "Precio por verificar";
  try {
    return Number(perfume.precio_referencia).toLocaleString("es-DO", { style: "currency", currency: perfume.moneda, maximumFractionDigits: 0 });
  } catch {
    return `${Number(perfume.precio_referencia).toLocaleString("es-DO")} ${perfume.moneda}`;
  }
}

export function HomeCatalogPreview({ perfumes, familias }: { perfumes: Perfume[]; familias: string[] }) {
  const items = perfumes.slice(0, 5);
  if (items.length === 0) return null;

  return (
    <section className="bg-[#faf6ee] py-16 dark:bg-[#100d0a] lg:py-20">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-10 xl:px-14">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-5 border-b border-line pb-4">
          <div>
            <p className="font-plex text-[10px] uppercase tracking-[.2em] text-ink">Catálogo seleccionado</p>
            <p className="mt-2 max-w-[54ch] font-sans text-xs leading-5 text-muted">Una vista curada del catálogo real, con salida clara de cualquier filtro.</p>
          </div>
          <Link href="/catalogo" className="nav-link font-sans text-xs text-muted transition hover:text-gold-contrast">Ver catálogo completo →</Link>
        </div>

        <form action="/catalogo" className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr_auto]">
          <label className="sr-only" htmlFor="home-familia">Familia olfativa</label>
          <select id="home-familia" name="familia" defaultValue="" className="min-h-12 border border-line bg-[#fffdf8] px-4 font-sans text-xs text-ink outline-none transition focus:border-gold focus:ring-1 focus:ring-gold dark:bg-[#17120d]">
            <option value="">Todas las familias</option>
            {familias.slice(0, 18).map((familia) => <option key={familia} value={familia}>{familia}</option>)}
          </select>
          <select name="genero" defaultValue="" aria-label="Género" className="min-h-12 border border-line bg-[#fffdf8] px-4 font-sans text-xs text-ink outline-none transition focus:border-gold dark:bg-[#17120d]">
            <option value="">Todos los géneros</option><option value="masculino">Masculino</option><option value="femenino">Femenino</option><option value="unisex">Unisex</option>
          </select>
          <select name="categoria" defaultValue="" aria-label="Categoría de precio" className="min-h-12 border border-line bg-[#fffdf8] px-4 font-sans text-xs text-ink outline-none transition focus:border-gold dark:bg-[#17120d]">
            <option value="">Todos los precios</option><option value="económico">Económico</option><option value="medio">Medio</option><option value="premium">Premium</option><option value="lujo">Lujo</option>
          </select>
          <select name="orden" defaultValue="" aria-label="Ordenar" className="min-h-12 border border-line bg-[#fffdf8] px-4 font-sans text-xs text-ink outline-none transition focus:border-gold dark:bg-[#17120d]">
            <option value="">Orden editorial</option><option value="rating">Mejor valorados</option><option value="precio_asc">Precio menor</option><option value="precio_desc">Precio mayor</option>
          </select>
          <button type="submit" className="min-h-12 bg-gold-contrast px-6 font-plex text-[9px] uppercase tracking-[.15em] text-white transition hover:-translate-y-0.5">Aplicar filtros</button>
        </form>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {items.map((perfume) => (
            <Link key={perfume.slug} href={`/catalogo/${perfume.slug}`} className="group overflow-hidden border border-line bg-[#fffdf9] transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-lux dark:bg-[#15110d]">
              <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_50%_42%,#fff_0%,#f8f1e6_58%,#eee0cb_100%)] dark:bg-[radial-gradient(circle_at_50%_42%,#211a13_0%,#15100c_65%,#0e0c0a_100%)]">
                <span className="absolute right-3 top-3 z-[2] grid h-8 w-8 place-items-center rounded-full border border-line bg-[#fffdf9]/85 text-muted backdrop-blur dark:bg-[#15110d]/85" aria-hidden="true">♡</span>
                {perfume.imagen_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- remote catalog image
                  <img src={perfume.imagen_url} alt={`${perfume.nombre} de ${perfume.marca}`} className="h-full w-full object-contain p-7 drop-shadow-[0_18px_18px_rgba(64,40,18,.15)] transition-transform duration-500 group-hover:scale-[1.025] sm:p-9" />
                ) : <div className="grid h-full place-items-center px-4 text-center font-plex text-[9px] uppercase tracking-[.12em] text-muted">Imagen por verificar</div>}
              </div>
              <div className="p-4">
                <p className="truncate font-display text-lg leading-tight text-ink">{perfume.nombre}</p>
                <p className="mt-1 truncate font-sans text-[11px] text-muted">{perfume.marca}</p>
                <p className="mt-2 truncate font-plex text-[8px] uppercase tracking-[.1em] text-gold-contrast">{perfume.familia_olfativa ?? "Familia por verificar"}</p>
                <p className="mt-4 font-display text-lg text-ink">{price(perfume)}</p>
                <div className="mt-2 flex items-center gap-2"><span className="text-[10px] tracking-[.08em] text-gold">★★★★★</span>{perfume.rating_promedio ? <span className="font-plex text-[8px] text-muted">{perfume.rating_promedio.toFixed(1)}</span> : null}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
