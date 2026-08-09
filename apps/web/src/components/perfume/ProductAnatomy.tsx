import type { Perfume } from "@/lib/types";

const EYEBROW = "font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast";

function NoteColumn({ index, title, notes }: { index: string; title: string; notes?: string[] }) {
  return (
    <div className="border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
      <div className="flex items-center justify-between gap-4">
        <span className="font-plex text-[9px] tracking-[.16em] text-gold-contrast">{index}</span>
        <span className="h-px flex-1 bg-line" />
        <span className="font-plex text-[9px] uppercase tracking-[.16em] text-muted">{title}</span>
      </div>
      <div className="mt-8 min-h-[120px]">
        {notes?.length ? (
          notes.map((note, i) => (
            <p key={`${note}-${i}`} className="border-b border-line py-3 font-display text-[25px] italic leading-none text-ink last:border-b-0 lg:text-[30px]">
              {note}
            </p>
          ))
        ) : (
          <p className="font-sans text-sm leading-6 text-muted">Información olfativa pendiente de verificación.</p>
        )}
      </div>
    </div>
  );
}

export function ProductAnatomy({ perfume }: { perfume: Perfume }) {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-20 lg:px-10 lg:py-28">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[.7fr_1.3fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className={EYEBROW}>01 / Anatomía de una fragancia</p>
          <h2 className="mt-5 max-w-[8ch] font-display text-[48px] font-medium leading-[.9] tracking-[-.035em] text-ink lg:text-[76px]">
            Tres tiempos. <em className="font-medium text-gold-contrast">Una firma.</em>
          </h2>
          <p className="mt-7 max-w-[36ch] font-sans text-[15px] leading-7 text-muted">
            La pirámide no es una lista de ingredientes: es la secuencia en la que el perfume se revela sobre la piel.
          </p>
          <div className="mt-10 border-y border-line py-5">
            <p className="font-plex text-[9px] uppercase tracking-[.16em] text-muted">Familia olfativa</p>
            <p className="mt-2 font-display text-[28px] italic text-ink">{perfume.familia_olfativa ?? "Por verificar"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-0">
          <NoteColumn index="01" title="Salida" notes={perfume.notas_salida} />
          <NoteColumn index="02" title="Corazón" notes={perfume.notas_corazon} />
          <NoteColumn index="03" title="Fondo" notes={perfume.notas_fondo} />
        </div>
      </div>
    </section>
  );
}
