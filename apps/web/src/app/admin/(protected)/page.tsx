"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardData {
  totalPerfumes: number;
  articulosPublicados: number;
  visitasCloudflare: number | null;
  clicksAfiliados: number | null;
  actividadReciente: { descripcion: string; actor: string; creado_en: string }[];
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-admin-card border border-admin-border bg-admin-surface p-4 shadow-admin">
      <p className="font-display text-3xl text-admin-text">{value}</p>
      <p className="mt-1 font-sans text-xs text-admin-muted">{label}</p>
    </div>
  );
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "Hace unos minutos";
  if (hours < 24) return `Hace ${hours}h`;
  return `Hace ${Math.floor(hours / 24)}d`;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => {
        if (!r.ok) throw new Error("dashboard fetch failed");
        return r.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-admin-text">Dashboard</h1>
      <p className="mt-1 font-sans text-sm text-admin-muted">Resumen general de Aromia 2.0</p>

      {error ? (
        <div className="mt-6 rounded-admin-card border border-admin-border bg-admin-surface p-6 text-center font-sans text-sm text-admin-muted">
          No se pudo cargar el dashboard. Recargá la página para reintentar.
        </div>
      ) : !data ? (
        <div className="mt-6 grid grid-cols-2 gap-3.5 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-admin-card bg-admin-surface" />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3.5 md:grid-cols-4">
            <KpiCard label="Perfumes total" value={String(data.totalPerfumes)} />
            <KpiCard label="Artículos publicados" value={String(data.articulosPublicados)} />
            <KpiCard
              label="Visitas (Cloudflare)"
              value={data.visitasCloudflare == null ? "—" : String(data.visitasCloudflare)}
            />
            <KpiCard
              label="Clics afiliados"
              value={data.clicksAfiliados == null ? "—" : String(data.clicksAfiliados)}
            />
          </div>

          {data.visitasCloudflare == null ? (
            <div className="mt-4 rounded-admin-card border border-admin-border bg-admin-surface p-6 text-center font-sans text-sm text-admin-muted">
              Todavía no hay datos de tráfico en este periodo — la integración con Cloudflare
              Analytics queda pendiente.
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-1 gap-3.5 md:grid-cols-2">
            <div className="rounded-admin-card border border-admin-border bg-admin-surface p-4 shadow-admin">
              <h3 className="font-sans text-sm font-semibold text-admin-text">Accesos rápidos</h3>
              <div className="mt-2 grid">
                <Link
                  href="/admin/perfumes/nuevo"
                  className="flex justify-between border-b border-admin-border py-3 font-sans text-sm text-admin-text"
                >
                  Agregar perfume <span>›</span>
                </Link>
                <Link
                  href="/admin/magazine"
                  className="flex justify-between py-3 font-sans text-sm text-admin-text"
                >
                  Nuevo artículo <span>›</span>
                </Link>
              </div>
            </div>

            <div className="rounded-admin-card border border-admin-border bg-admin-surface p-4 shadow-admin">
              <h3 className="font-sans text-sm font-semibold text-admin-text">Actividad reciente</h3>
              {data.actividadReciente.length === 0 ? (
                <p className="mt-3 font-sans text-sm text-admin-muted">No hay actividad reciente.</p>
              ) : (
                <div className="mt-2 grid">
                  {data.actividadReciente.map((a, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_auto_auto] gap-3 border-t border-admin-border py-3 font-sans text-sm first:border-0"
                    >
                      <span className="text-admin-text">{a.descripcion}</span>
                      <span className="text-admin-muted">Por {a.actor}</span>
                      <span className="text-admin-muted">{timeAgo(a.creado_en)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
