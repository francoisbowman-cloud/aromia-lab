import type { Perfume } from "@/lib/types";
import { hueForFamily } from "@/lib/olfactiveFamilies";

type Phase = { label: "salida" | "corazón" | "fondo"; count: number; token: string };

/**
 * Sello olfativo (encargo A de Design, WS-6): tres bandas verticales —
 * salida / corazón / fondo — con alto proporcional a cuántas notas trae cada
 * fase y matiz derivado de la familia olfativa del perfume (nunca inventado
 * por perfume, ver FAMILY_HUES en olfactiveFamilies.ts). Reemplaza a la foto
 * dentro del listado: se genera con datos que los 125 perfumes ya tienen
 * desde el día uno, a diferencia de las 7 fotos recortadas.
 */
export function OlfactiveSeal({ perfume, className = "" }: { perfume: Perfume; className?: string }) {
  const phases: Phase[] = [
    { label: "salida", count: perfume.notas_salida?.length ?? 0, token: "var(--sello-l-out)" },
    { label: "corazón", count: perfume.notas_corazon?.length ?? 0, token: "var(--sello-l-mid)" },
    { label: "fondo", count: perfume.notas_fondo?.length ?? 0, token: "var(--sello-l-base)" },
  ];
  const total = phases.reduce((sum, phase) => sum + phase.count, 0);
  const hue = hueForFamily(perfume.familia_olfativa);

  if (total === 0) {
    return (
      <div className={`flex flex-col gap-[2px] ${className}`} aria-hidden="true">
        {[14, 9, 6].map((h) => (
          <span key={h} style={{ height: h }} className="rounded-[1px] bg-line" />
        ))}
      </div>
    );
  }

  const MAX_HEIGHT = 15;
  const MIN_HEIGHT = 4;

  return (
    <div className={`flex flex-col gap-[2px] ${className}`} style={{ ["--sello-h" as string]: hue }} aria-hidden="true">
      {phases.map((phase) => {
        const height = phase.count === 0 ? 0 : Math.max(MIN_HEIGHT, Math.round((phase.count / total) * MAX_HEIGHT));
        if (height === 0) return null;
        return (
          <span
            key={phase.label}
            style={{ height, background: `hsl(var(--sello-h) var(--sello-s) ${phase.token})` }}
            className="rounded-[1px]"
          />
        );
      })}
    </div>
  );
}

/** "intenso" / "medio" / "fresco" — derivado del peso relativo de fondo vs.
 * salida en la pirámide, no un dato nuevo a cargar. */
export function olfactiveIntensity(perfume: Perfume): string | null {
  const out = perfume.notas_salida?.length ?? 0;
  const base = perfume.notas_fondo?.length ?? 0;
  const total = out + (perfume.notas_corazon?.length ?? 0) + base;
  if (total === 0) return null;
  if (base / total > 0.45) return "intenso";
  if (out / total > 0.4) return "fresco";
  return "medio";
}
