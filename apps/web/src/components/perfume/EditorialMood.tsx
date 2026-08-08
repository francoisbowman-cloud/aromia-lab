import Image from "next/image";
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
          nativamente 16:10 (la mayoría de los mockups OVL), el remanente se
          rellena con --surface plano — blanco sólido en tema claro, negro
          sólido en tema oscuro (decisión #81 de ESTADO-aromia.md), sin
          necesidad de regenerar el asset. */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <p className="absolute bottom-5 left-6 font-display text-lg italic text-white/90">
          La atmósfera de {nombre}
        </p>
      </div>
    </section>
  );
}
