import Link from "next/link";
import type { Perfume } from "@/lib/types";

function formatPrice(perfume: Perfume) {
  if (perfume.precio_referencia == null || !perfume.moneda) return "Precio por verificar";
  try {
    return Number(perfume.precio_referencia).toLocaleString("es-DO", { style: "currency", currency: perfume.moneda, maximumFractionDigits: 0 });
  } catch {
    return `${Number(perfume.precio_referencia).toLocaleString("es-DO")} ${perfume.moneda}`;
  }
}

export function EditorialSelection({ perfumes }: { perfumes: Perfume[] }) {
  const feature = perfumes[0];
  if (!feature) return null;

  const notes = [...(feature.notas_salida ?? []), ...(feature.notas_corazon ?? []), ...(feature.notas_fondo ?? [])]
    .filter((note, index, all) => Boolean(note) && all.indexOf(note) === index)
    .slice(0, 4);
  const intensity = Math.max(1, Math.min(5, Math.round(feature.proyeccion ?? feature.estela ?? feature.longevidad ?? 4)));

  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 lg:px-10 xl:px-14">
      <div className="mb-8 flex items-center gap-4 border-b border-line pb-4">
        <p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Editorial destacado</p>
        <span className="h-px flex-1 bg-line" />
        <span className="font-plex text-[9px] uppercase tracking-[.14em] text-muted">Objeto 01</span>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-[.72fr_1.08fr_.72fr] lg:gap-0">
        <div className="flex flex-col justify-center py-4 lg:pr-12">
          <p className="font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Selección Aromia</p>
          <h2 className="mt-5 max-w-[12ch] font-display text-[38px] font-medium leading-[1.02] tracking-[-.02em] text-ink lg:text-[50px]">{feature.nombre}</h2>
          <p className="mt-2 font-display text-[22px] text-muted">{feature.marca}</p>
          <p className="mt-6 max-w-[38ch] font-sans text-sm leading-6 text-muted">
            {feature.descripcion_corta ?? feature.resena_sintetizada ?? "Una selección editorial para comparar carácter, materia y presencia con el resto del catálogo Aromia."}
          </p>
          <Link href={`/catalogo/${feature.slug}`} className="mt-8 inline-flex w-fit min-h-11 items-center gap-7 border border-line bg-[#fffdf8] px-5 font-plex text-[9px] uppercase tracking-[.16em] text-ink transition hover:border-gold hover:text-gold-contrast dark:bg-[#15110d]">
            Descubrir <span aria-hidden="true">→</span>
          </Link>
        </div>

        <Link href={`/catalogo/${feature.slug}`} className="group relative min-h-[440px] overflow-hidden border-line bg-[radial-gradient(circle_at_50%_45%,#fff_0%,#fbf6ed_52%,#efe2cf_100%)] lg:border-x dark:bg-[radial-gradient(circle_at_50%_45%,#201911_0%,#15100c_60%,#0e0c0a_100%)]">
          <span aria-hidden="true" className="absolute inset-x-[18%] bottom-[8%] h-[11%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(100,65,30,.16),transparent_70%)] blur-xl dark:bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.5),transparent_70%)]" />
          {feature.imagen_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote catalog asset
            <img src={feature.imagen_url} alt={`${feature.nombre} de ${feature.marca}`} className="absolute inset-0 h-full w-full object-contain p-12 drop-shadow-[0_26px_26px_rgba(70,43,20,.18)] transition-transform duration-700 group-hover:scale-[1.018] sm:p-16 lg:p-20 dark:drop-shadow-[0_30px_30px_rgba(0,0,0,.5)]" />
          ) : (
            <div className="absolute inset-0 grid place-items-center font-plex text-[9px] uppercase tracking-[.16em] text-muted">Imagen pendiente</div>
          )}
        </Link>

        <div className="flex flex-col justify-center py-4 lg:pl-12">
          <div className="grid grid-cols-2 gap-x-8 gap-y-7 border-b border-line pb-7">
            <div>
              <p className="font-plex text-[9px] uppercase tracking-[.12em] text-muted">Familia olfativa</p>
              <p className="mt-2 font-display text-lg text-ink">{feature.familia_olfativa ?? "Por verificar"}</p>
            </div>
            <div>
              <p className="font-plex text-[9px] uppercase tracking-[.12em] text-muted">Concentración</p>
              <p className="mt-2 font-display text-lg text-ink">{feature.concentracion ?? "—"}</p>
            </div>
          </div>

          <div className="border-b border-line py-7">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="font-plex text-[9px] uppercase tracking-[.12em] text-muted">Intensidad</p>
                <div className="mt-3 flex gap-2" aria-label={`Intensidad ${intensity} de 5`}>
                  {[1, 2, 3, 4, 5].map((n) => <span key={n} className={`h-2.5 w-2.5 rounded-full border ${n <= intensity ? "border-gold bg-gold" : "border-line"}`} />)}
                </div>
              </div>
              {feature.rating_promedio ? (
                <div className="text-right"><p className="font-display text-3xl text-gold-contrast">{feature.rating_promedio.toFixed(1)}</p><p className="mt-1 font-plex text-[9px] uppercase tracking-[.12em] text-muted">Valoración</p></div>
              ) : null}
            </div>
          </div>

          <div className="border-b border-line py-7">
            <p className="font-plex text-[9px] uppercase tracking-[.12em] text-muted">Notas principales</p>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
              {notes.length > 0 ? notes.map((note, i) => (
                <div key={note} className="flex items-center gap-3"><span className={`h-7 w-7 rounded-full border border-line ${i % 2 === 0 ? "bg-[#e9c46f]" : "bg-[#c6b497]"}`} aria-hidden="true"/><span className="font-sans text-xs text-ink">{note}</span></div>
              )) : <span className="col-span-2 font-sans text-xs text-muted">Notas en verificación editorial.</span>}
            </div>
          </div>

          <div className="flex items-end justify-between gap-5 pt-7">
            <div><p className="font-plex text-[9px] uppercase tracking-[.12em] text-muted">Precio de referencia</p><p className="mt-2 font-display text-[28px] text-ink">{formatPrice(feature)}</p></div>
            <Link href={`/catalogo/${feature.slug}`} aria-label={`Ver ${feature.nombre}`} className="grid h-11 w-11 place-items-center rounded-full border border-line text-gold-contrast transition hover:border-gold hover:bg-soft">→</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
