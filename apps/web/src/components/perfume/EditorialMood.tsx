import { getEditorialImage } from "@/lib/editorialImages";

export function EditorialMood({ slug, nombre }: { slug: string; nombre: string }) {
  const image = getEditorialImage(slug);

  if (!image) {
    return (
      <section className="relative overflow-hidden rounded-card border border-line bg-soft">
        <div className="flex aspect-[16/10] w-full items-center justify-center">
          <p className="font-display text-sm italic text-muted">
            La atmósfera editorial de {nombre} está en preparación.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-card border border-line bg-surface">
      {/* aspect-ratio 16:10 + object-contain: la escena OVL nunca se recorta
          (ver GUIA-VISUAL-aromia.md, regla de imagen). Cuando la imagen no es
          nativamente 16:10 (la mayoría de los mockups OVL), en vez de dejar
          barras sólidas de --surface, el remanente lo llena una copia
          desenfocada y agrandada de la MISMA imagen a modo de fondo — esa
          copia sí puede recortarse (`object-cover`), es puramente decorativa;
          la imagen nítida de encima nunca se toca. Mismo patrón que Spotify/
          Apple Music para portadas que no calzan en el marco. */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-70 blur-2xl"
        />
        <div className="absolute inset-0 bg-surface/35" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt={image.alt}
          className="absolute inset-0 h-full w-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <p className="absolute bottom-5 left-6 font-display text-lg italic text-white/90">
          La atmósfera de {nombre}
        </p>
      </div>
    </section>
  );
}
