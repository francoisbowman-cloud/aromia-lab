"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { TagInput } from "@/components/admin/TagInput";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface FormValues {
  nombre: string;
  marca: string;
  genero: string;
  familia_olfativa: string;
  precio_referencia: number;
  moneda: string;
  categoria_precio: string;
  descripcion_corta: string;
  estado: string;
  longevidad: number | "";
  estela: number | "";
  proyeccion: number | "";
  resena_sintetizada: string;
}

interface Retailer {
  id: number;
  nombre: string;
  detalle: string | null;
  precio: string;
  moneda: string;
  link_afiliado: string;
}

const TABS = ["General", "Ofertas", "Reseñas"] as const;

export default function AdminPerfumeEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("General");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [slug, setSlug] = useState("");
  const [imagenUrl, setImagenUrl] = useState<string>();
  const [notasSalida, setNotasSalida] = useState<string[]>([]);
  const [notasCorazon, setNotasCorazon] = useState<string[]>([]);
  const [notasFondo, setNotasFondo] = useState<string[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [newRetailer, setNewRetailer] = useState({ nombre: "", precio: "", moneda: "USD", link_afiliado: "" });

  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    fetch(`/api/admin/perfumes/${params.id}`)
      .then((r) => r.json())
      .then((p) => {
        setSlug(p.slug);
        setImagenUrl(p.imagen_url);
        setNotasSalida(p.notas_salida ?? []);
        setNotasCorazon(p.notas_corazon ?? []);
        setNotasFondo(p.notas_fondo ?? []);
        setRetailers(p.retailers ?? []);
        reset({
          nombre: p.nombre,
          marca: p.marca,
          genero: p.genero,
          familia_olfativa: p.familia_olfativa,
          precio_referencia: Number(p.precio_referencia),
          moneda: p.moneda,
          categoria_precio: p.categoria_precio,
          descripcion_corta: p.descripcion_corta ?? "",
          estado: p.estado,
          longevidad: p.longevidad ?? "",
          estela: p.estela ?? "",
          proyeccion: p.proyeccion ?? "",
          resena_sintetizada: p.resena_sintetizada ?? "",
        });
        setLoading(false);
      });
  }, [params.id, reset]);

  async function onSubmit(values: FormValues) {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/admin/perfumes/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        precio_referencia: Number(values.precio_referencia),
        longevidad: values.longevidad === "" ? null : Number(values.longevidad),
        estela: values.estela === "" ? null : Number(values.estela),
        proyeccion: values.proyeccion === "" ? null : Number(values.proyeccion),
        notas_salida: notasSalida,
        notas_corazon: notasCorazon,
        notas_fondo: notasFondo,
      }),
    });
    setSaving(false);
    setSaved(true);
  }

  async function handleImageUpload(file: File) {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`/api/admin/perfumes/${params.id}/image`, {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    if (json.imagen_url) setImagenUrl(json.imagen_url);
  }

  async function handleAddRetailer() {
    if (!newRetailer.nombre || !newRetailer.precio || !newRetailer.link_afiliado) return;
    const res = await fetch(`/api/admin/perfumes/${params.id}/retailers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newRetailer, precio: Number(newRetailer.precio) }),
    });
    const created = await res.json();
    setRetailers((prev) => [...prev, created]);
    setNewRetailer({ nombre: "", precio: "", moneda: "USD", link_afiliado: "" });
  }

  if (loading) {
    return <div className="animate-pulse font-sans text-sm text-admin-muted">Cargando…</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/catalogo")}
            className="rounded border border-admin-border px-2 py-1 text-sm"
          >
            ←
          </button>
          <h1 className="font-display text-2xl text-admin-text">Editar perfume</h1>
        </div>
        <div className="flex items-center gap-3">
          {saved ? <span className="font-sans text-xs text-admin-success-text">Guardado ✓</span> : null}
          <button
            type="button"
            onClick={() => router.push("/admin/catalogo")}
            className="rounded border border-admin-border px-4 py-2 font-sans text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-gold-contrast px-4 py-2 font-sans text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-7 border-b border-admin-border">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`border-b-2 pb-3 font-sans text-sm ${
              tab === t ? "border-gold text-admin-text" : "border-transparent text-admin-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_290px]">
        <div className="rounded-admin-card border border-admin-border bg-admin-surface p-5">
          {tab === "General" && (
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Nombre
                  </label>
                  <input
                    {...register("nombre")}
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Slug
                  </label>
                  <input
                    value={slug}
                    disabled
                    className="mt-1.5 w-full rounded border border-admin-border bg-admin-bg px-3 py-2 font-sans text-sm text-admin-muted"
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Marca
                  </label>
                  <input
                    {...register("marca")}
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Género
                  </label>
                  <select
                    {...register("genero")}
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Familia olfativa
                  </label>
                  <input
                    {...register("familia_olfativa")}
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <TagInput label="Notas de salida" value={notasSalida} onChange={setNotasSalida} />
                <TagInput label="Notas de corazón" value={notasCorazon} onChange={setNotasCorazon} />
                <TagInput label="Notas de fondo" value={notasFondo} onChange={setNotasFondo} />
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Precio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("precio_referencia")}
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Moneda
                  </label>
                  <input
                    {...register("moneda")}
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Categoría de precio
                  </label>
                  <select
                    {...register("categoria_precio")}
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  >
                    <option value="económico">Económico</option>
                    <option value="medio">Medio</option>
                    <option value="premium">Premium</option>
                    <option value="lujo">Lujo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                  Estado
                </label>
                <select
                  {...register("estado")}
                  className="mt-1.5 w-full max-w-xs rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                >
                  <option value="borrador">Borrador</option>
                  <option value="publicado">Publicado</option>
                </select>
              </div>

              <div>
                <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                  Descripción corta
                </label>
                <textarea
                  rows={4}
                  {...register("descripcion_corta")}
                  className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                />
              </div>
            </div>
          )}

          {tab === "Ofertas" && (
            <div>
              <h3 className="font-sans text-sm font-semibold text-admin-text">Retailers</h3>
              <div className="mt-3 divide-y divide-admin-border">
                {retailers.map((r) => (
                  <div key={r.id} className="flex items-center justify-between py-3 font-sans text-sm">
                    <div>
                      <p className="font-medium">{r.nombre}</p>
                      <p className="text-xs text-admin-muted">{r.link_afiliado}</p>
                    </div>
                    <p>
                      {Number(r.precio).toLocaleString("es-AR")} {r.moneda}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 rounded border border-dashed border-admin-border p-3 md:grid-cols-4">
                <input
                  placeholder="Nombre (ej. Amazon)"
                  value={newRetailer.nombre}
                  onChange={(e) => setNewRetailer((s) => ({ ...s, nombre: e.target.value }))}
                  className="rounded border border-admin-border px-2 py-1.5 font-sans text-sm"
                />
                <input
                  placeholder="Precio"
                  type="number"
                  value={newRetailer.precio}
                  onChange={(e) => setNewRetailer((s) => ({ ...s, precio: e.target.value }))}
                  className="rounded border border-admin-border px-2 py-1.5 font-sans text-sm"
                />
                <input
                  placeholder="Link de afiliado"
                  value={newRetailer.link_afiliado}
                  onChange={(e) => setNewRetailer((s) => ({ ...s, link_afiliado: e.target.value }))}
                  className="rounded border border-admin-border px-2 py-1.5 font-sans text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddRetailer}
                  className="rounded bg-gold-contrast px-3 py-1.5 font-sans text-xs font-semibold text-white"
                >
                  + Agregar
                </button>
              </div>
            </div>
          )}

          {tab === "Reseñas" && (
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Longevidad (0-10)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    {...register("longevidad")}
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Estela (0-10)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    {...register("estela")}
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Proyección (0-10)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    {...register("proyeccion")}
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div>
                <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                  Reseña sintetizada (editorial)
                </label>
                <textarea
                  rows={4}
                  {...register("resena_sintetizada")}
                  className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                />
              </div>
            </div>
          )}
        </div>

        <aside>
          <ImageUpload currentUrl={imagenUrl} onUpload={handleImageUpload} />
        </aside>
      </div>
    </form>
  );
}
