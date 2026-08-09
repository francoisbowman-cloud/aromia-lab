import Image from "next/image";
import { getEditorialImage } from "@/lib/editorialImages";

export function EditorialMood({ slug, nombre }: { slug: string; nombre: string }) {
  const image = getEditorialImage(slug);

  if (!image) {
    return (
      <section className="relative flex min-h-[420px] items-end overflow-hidden border-y border-line bg-[radial-gradient(circle_at_70%_25%,rgba(200,168,107,.18),transparent_32%),linear-gradient(145deg,#f4ecdf,#e7d9c5)] p-7 dark:bg-[radial-gradient(circle_at_70%_25%,rgba(200,168,107,.09),transparent_32%),linear-gradient(145deg,#17120d,#0e0b08)] lg:p-10">
        <div>
          <p className="font-plex text-[8px] uppercase tracking-[.18em] text-muted">Editorial scene / pending</p>
          <p className="mt-3 max-w-[18ch] font-display text-[38px] italic leading-[.95] text-ink">La atmósfera de {nombre} está en preparación.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[520px] overflow-hidden border-y border-line bg-[#100d0a] lg:min-h-[680px]">
      <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 1160px, 100vw" className="object-contain" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-7 text-white lg:p-10">
        <div className="flex items-center gap-4 border-t border-white/25 pt-4 font-plex text-[8px] uppercase tracking-[.18em] text-white/65"><span>Atmosphere study</span><span className="h-px flex-1 bg-white/25"/><span>Aromia editorial</span></div>
        <p className="mt-6 max-w-[12ch] font-display text-[42px] italic leading-[.92] lg:text-[64px]">La atmósfera de {nombre}</p>
      </div>
    </section>
  );
}
