"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

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
}

function slugify(nombre: string, marca: string) {
  const base = `${nombre} ${marca}`
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base;
}

export default function AdminPerfumeNuevoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { moneda: "USD", estado: "borrador" },
  });

  async function onSubmit(values: FormValues) {
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/perfumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        slug: slugify(values.nombre, values.marca),
        precio_referencia: Number(values.precio_referencia),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setError("No se pudo crear el perfume. Revisá los datos e intentá de nuevo.");
      return;
    }
    const created = await res.json();
    router.push(`/admin/perfumes/${created.id}`);
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
          <h1 className="font-display text-2xl text-admin-text">Nuevo perfume</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/catalogo")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Creando…" : "Crear perfume"}
          </Button>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded border border-destructive/30 bg-destructive/10 px-4 py-3 font-sans text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="mt-5 rounded-admin-card border border-admin-border bg-admin-surface p-5">
        <p className="font-sans text-xs text-admin-muted">
          Carga los datos básicos ahora — notas, imagen y retailers se agregan después de crear el
          perfume, en la misma pantalla de edición del catálogo.
        </p>
        <div className="mt-4 grid gap-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">Nombre</label>
              <Input {...register("nombre", { required: true })} className="mt-1.5" />
            </div>
            <div>
              <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">Marca</label>
              <Input {...register("marca", { required: true })} className="mt-1.5" />
            </div>
            <div>
              <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">Género</label>
              <Select {...register("genero", { required: true })} className="mt-1.5" defaultValue="">
                <option value="" disabled>
                  Elegir…
                </option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="unisex">Unisex</option>
              </Select>
            </div>
            <div>
              <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                Familia olfativa
              </label>
              <Input {...register("familia_olfativa", { required: true })} className="mt-1.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">Precio</label>
              <Input
                type="number"
                step="0.01"
                {...register("precio_referencia", { required: true })}
                className="mt-1.5"
              />
            </div>
            <div>
              <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">Moneda</label>
              <Input {...register("moneda", { required: true })} className="mt-1.5" />
            </div>
            <div>
              <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                Categoría de precio
              </label>
              <Select {...register("categoria_precio", { required: true })} className="mt-1.5" defaultValue="">
                <option value="" disabled>
                  Elegir…
                </option>
                <option value="económico">Económico</option>
                <option value="medio">Medio</option>
                <option value="premium">Premium</option>
                <option value="lujo">Lujo</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">Estado</label>
            <Select {...register("estado")} className="mt-1.5 max-w-xs">
              <option value="borrador">Borrador</option>
              <option value="publicado">Publicado</option>
            </Select>
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
      </div>
    </form>
  );
}
