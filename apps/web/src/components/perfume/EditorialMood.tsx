import { getEditorialImage } from "@/lib/editorialImages";

export function EditorialMood({ slug, nombre }: { slug: string; nombre: string }) {
  const image = getEditorialImage(slug);

  if (!image) {
    return (
      <section className="relative overflow-hidden rounded-card border border-line bg-soft">
        <div className="flex aspect-[16/7] w-full items-center justify-center">
          <p className="font-display text-sm italic text-muted">
            La atmósfera editorial de {nombre} está en preparación.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-card border border-line bg-surface">
      <div className="relative aspect-[16/7] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt={image.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <p className="absolute bottom-5 left-6 font-display text-lg italic text-white/90">
          La atmósfera de {nombre}
        </p>
      </div>
    </section>
  );
}
