"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { AdminPerfumeList } from "@/lib/adminTypes";
import { AdminTableSkeleton } from "@/components/admin/AdminTable";

export default function AdminCatalogoPage() {
  const [data, setData] = useState<AdminPerfumeList | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [estado, setEstado] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (estado) params.set("estado", estado);
    params.set("page", String(page));
    params.set("pageSize", "20");

    const res = await fetch(`/api/admin/perfumes?${params.toString()}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, [q, estado, page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-admin-text">Catálogo</h1>
          <p className="mt-1 font-sans text-sm text-admin-muted">
            Gestiona todos los perfumes del catálogo
          </p>
        </div>
        <Link
          href="/admin/perfumes/nuevo"
          className="rounded-lg bg-gold-contrast px-4 py-2.5 font-sans text-sm font-semibold text-white"
        >
          + Agregar perfume
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 rounded-admin-card border border-admin-border bg-admin-surface p-4 shadow-admin md:grid-cols-[2fr_1fr_auto]">
        <div>
          <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
            Buscar
          </label>
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="Buscar por nombre, marca o slug…"
            className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
            Estado
          </label>
          <select
            value={estado}
            onChange={(e) => {
              setPage(1);
              setEstado(e.target.value);
            }}
            className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
          >
            <option value="">Todos</option>
            <option value="publicado">Publicado</option>
            <option value="borrador">Borrador</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <AdminTableSkeleton />
        ) : !data || data.items.length === 0 ? (
          <div className="rounded-admin-card border border-admin-border bg-admin-surface p-10 text-center">
            <p className="font-display text-xl text-admin-text">No se encontraron perfumes</p>
            <p className="mt-2 font-sans text-sm text-admin-muted">
              Prueba con otro término o limpia los filtros.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-admin-card border border-admin-border bg-admin-surface shadow-admin">
            <table className="w-full min-w-[820px] text-left font-sans text-sm">
              <thead>
                <tr className="border-b border-admin-border bg-admin-bg text-[11px] uppercase text-admin-muted">
                  <th className="px-4 py-3">Imagen</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Marca</th>
                  <th className="px-4 py-3">Familia</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((p) => (
                  <tr key={p.id} className="border-b border-admin-border last:border-0">
                    <td className="px-4 py-3">
                      <div className="h-9 w-9 rounded bg-admin-bg" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-admin-text">{p.nombre}</p>
                      <p className="text-xs text-admin-muted">{p.slug}</p>
                    </td>
                    <td className="px-4 py-3">{p.marca}</td>
                    <td className="px-4 py-3">{p.familia_olfativa}</td>
                    <td className="px-4 py-3 capitalize">{p.categoria_precio}</td>
                    <td className="px-4 py-3">
                      {Number(p.precio_referencia).toLocaleString("es-AR")} {p.moneda}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-bold ${
                          p.estado === "publicado"
                            ? "bg-admin-success-bg text-admin-success-text"
                            : "bg-admin-warning-bg text-admin-warning-text"
                        }`}
                      >
                        {p.estado === "publicado" ? "Publicado" : "Borrador"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/perfumes/${p.id}`}
                        className="rounded border border-admin-border px-2 py-1 text-xs"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-4 py-3 font-sans text-xs text-admin-muted">
              <span>
                Mostrando {(data.page - 1) * data.pageSize + 1}–
                {Math.min(data.page * data.pageSize, data.total)} de {data.total} resultados
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded border border-admin-border px-2 py-1 disabled:opacity-40"
                >
                  ‹
                </button>
                <button
                  type="button"
                  disabled={data.page * data.pageSize >= data.total}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded border border-admin-border px-2 py-1 disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
