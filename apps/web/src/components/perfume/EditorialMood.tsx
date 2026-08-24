export function EditorialMood({
  nombre,
  familia,
  notas,
  descripcion,
}: {
  nombre: string;
  familia?: string | null;
  notas?: string[];
  descripcion?: string | null;
}) {
  const materials = (notas ?? []).filter((note, index, all) => Boolean(note) && all.indexOf(note) === index).slice(0, 6);

  return (
    <section className="grid overflow-hidden border-y border-line lg:grid-cols-[.8fr_1.2fr]">
      <div className="aromia-material-wash relative min-h-[360px] overflow-hidden lg:min-h-[500px]">
        <div aria-hidden="true" className="absolute left-[12%] top-[14%] h-[58%] w-[58%] rounded-[50%] bg-[#d9c8b1]/55 blur-[85px] dark:bg-[#4a1f24]/22" />
        <div aria-hidden="true" className="absolute bottom-[8%] right-[8%] h-[38%] w-[38%] rounded-[50%] bg-[#5a6b54]/12 blur-[60px] dark:bg-[#5a6b54]/18" />
        <p className="absolute inset-x-[8%] top-[12%] max-w-[8ch] select-none font-display text-[clamp(4rem,9vw,8.5rem)] leading-[.76] tracking-[-.06em] text-[#20231f]/[.08] dark:text-[#f7f5f0]/[.07]">{nombre}</p>
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-5 border-t border-line pt-3 font-plex text-xs uppercase tracking-[.13em] text-muted sm:left-8 sm:right-8">
          <span>Campo material</span>
          <span>{familia ?? "Aromia"}</span>
        </div>
      </div>

      <div className="flex flex-col justify-between px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div>
          <p className="font-plex text-xs uppercase tracking-[.14em] text-[#5a6b54] dark:text-[#b8c5b3]">Materia sin ficción</p>
          <h3 className="mt-4 max-w-[11ch] font-display text-[38px] leading-[.94] tracking-[-.035em] text-ink sm:text-[48px]">Lo que sabemos se convierte en lenguaje visual.</h3>
          {descripcion ? <p className="mt-7 max-w-[46ch] font-sans text-base leading-7 text-muted">{descripcion}</p> : null}
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <p className="font-plex text-xs uppercase tracking-[.13em] text-muted">Materiales / notas verificadas</p>
          {materials.length ? (
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-4">
              {materials.map((note, index) => (
                <span key={note} className="inline-flex items-baseline gap-2 font-display text-[24px] capitalize leading-none text-ink sm:text-[28px]">
                  <span className="font-plex text-[10px] text-muted">{String(index + 1).padStart(2, "0")}</span>{note}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 max-w-[40ch] font-sans text-sm leading-6 text-muted">No se añaden ingredientes visuales cuando el catálogo no publica notas verificadas.</p>
          )}
        </div>
      </div>
    </section>
  );
}
