"use client";

import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export function OlfactiveRadarSkeleton() {
  return (
    <section
      className="flex h-[320px] items-center justify-center rounded-card border border-line bg-surface md:h-[420px]"
      aria-busy="true"
    >
      <div className="h-40 w-40 animate-pulse rounded-full bg-soft" />
    </section>
  );
}

export function OlfactiveRadar({
  longevidad,
  estela,
  proyeccion,
}: {
  longevidad?: number;
  estela?: number;
  proyeccion?: number;
}) {
  const hasData = longevidad != null && estela != null && proyeccion != null;

  const data = [
    { eje: "Longevidad", valor: hasData ? Number(longevidad) : 0 },
    { eje: "Estela", valor: hasData ? Number(estela) : 0 },
    { eje: "Proyección", valor: hasData ? Number(proyeccion) : 0 },
  ];

  return (
    <section
      className="rounded-card border border-line bg-surface p-6"
      role="img"
      aria-label={
        hasData
          ? `Retrato olfativo: longevidad ${longevidad} de 10, estela ${estela} de 10, proyección ${proyeccion} de 10`
          : "Retrato olfativo sin datos todavía"
      }
    >
      <div className="h-[320px] md:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="70%">
            <PolarGrid stroke="var(--line)" />
            <PolarAngleAxis
              dataKey="eje"
              tick={{ fill: "var(--muted)", fontSize: 11 }}
            />
            <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
            <Radar
              dataKey="valor"
              stroke="var(--gold)"
              fill="var(--gold)"
              fillOpacity={0.22}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {!hasData ? (
        <p className="mt-2 text-center font-sans text-sm text-muted">
          Aún sin datos de desempeño.
        </p>
      ) : null}
    </section>
  );
}
