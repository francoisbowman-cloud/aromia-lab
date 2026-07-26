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
      {/* aspect-ratio 16:10 + object-contain: la escena OVL nunca se recorta,
          el remanente lo llena --surface (ver GUIA-VISUAL-aromia.md, regla
          de imagen). El degradé/caption quedan sobre el frame completo, no
          solo sobre la imagen, para que sigan legibles con o sin letterbox. */}
      <div className="relative aspect-[16/10] w-full bg-surface">
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
