const EYEBROW = "font-sans text-[10px] uppercase tracking-[.3em] font-semibold text-gold-contrast";

export function MaterialStatement() {
  return (
    <section className="bg-bg py-20 lg:py-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <p className={EYEBROW}>De la materia al objeto</p>
        <h2 className="mt-6 font-display text-[44px] font-medium leading-[.96] tracking-[-.03em] text-ink sm:text-[64px] lg:text-[88px]">
          Materia. Memoria. <em className="font-medium text-gold-contrast not-italic">Objeto.</em>
        </h2>
        <p className="mt-6 max-w-[46ch] font-sans text-sm leading-6 text-muted">
          Cada fragancia empieza como sensación antes de convertirse en frasco. Aromia recorre ese camino con criterio, no con campaña.
        </p>
      </div>
    </section>
  );
}
