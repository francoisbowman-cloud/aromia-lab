"use client";

import { useEffect, useState, useCallback } from "react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface ArticleListItem {
  id: number;
  slug: string;
  titulo: string;
  categoria: string;
  estado: "borrador" | "publicado";
  imagen_portada_url: string | null;
  actualizado_en: string;
}

interface ArticleDetail extends ArticleListItem {
  contenido_html: string;
  autor: string | null;
  meta_title: string | null;
  meta_description: string | null;
  url_canonica: string | null;
}

const CATEGORIAS = ["resena", "guia", "analisis", "academia", "tendencias"];

export default function AdminMagazinePage() {
  const [items, setItems] = useState<ArticleListItem[] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [seoOpen, setSeoOpen] = useState(false);
  const [saving, setSaving] = useState<"idle" | "guardando" | "publicando">("idle");

  const loadList = useCallback(async () => {
    const res = await fetch("/api/admin/articles");
    const json = await res.json();
    setItems(json.items);
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    if (selectedId == null) {
      setArticle(null);
      return;
    }
    fetch(`/api/admin/articles/${selectedId}`)
      .then((r) => r.json())
      .then(setArticle);
  }, [selectedId]);

  async function handleCreate() {
    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: "Nuevo artículo", categoria: "guia", estado: "borrador" }),
    });
    const created = await res.json();
    await loadList();
    setSelectedId(created.id);
  }

  async function saveArticle(patch: Partial<ArticleDetail>, mode: "guardando" | "publicando") {
    if (!article) return;
    setSaving(mode);
    const res = await fetch(`/api/admin/articles/${article.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const updated = await res.json();
    setArticle(updated);
    await loadList();
    setSaving("idle");
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-admin-text">Artículos</h1>
          <p className="mt-1 font-sans text-sm text-admin-muted">
            Gestiona el contenido del magazine
          </p>
        </div>
        {article ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => saveArticle({ ...article, estado: "borrador" }, "guardando")}
              className="rounded border border-admin-border px-4 py-2 font-sans text-sm"
            >
              {saving === "guardando" ? "Guardando…" : "Guardar borrador"}
            </button>
            <button
              type="button"
              onClick={() => saveArticle({ ...article, estado: "publicado" }, "publicando")}
              disabled={!article.titulo || !article.contenido_html}
              className="rounded bg-gold-contrast px-4 py-2 font-sans text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving === "publicando" ? "Publicando…" : "Publicar"}
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3.5 lg:grid-cols-[250px_1fr]">
        <aside className="rounded-admin-card border border-admin-border bg-admin-surface p-3">
          <button
            type="button"
            onClick={handleCreate}
            className="w-full rounded bg-gold-contrast px-3 py-2 font-sans text-sm font-semibold text-white"
          >
            + Nuevo artículo
          </button>

          <div className="mt-3 grid gap-1">
            {items === null ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-admin-bg" />
              ))
            ) : items.length === 0 ? (
              <div className="p-4 text-center">
                <p className="font-sans text-sm text-admin-muted">Aún no hay artículos</p>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="mt-3 rounded bg-gold-contrast px-3 py-1.5 font-sans text-xs font-semibold text-white"
                >
                  Crear primer artículo
                </button>
              </div>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`rounded p-2 text-left font-sans text-xs ${
                    selectedId === item.id ? "bg-gold/15" : "hover:bg-admin-bg"
                  }`}
                >
                  <b className="block text-sm text-admin-text">{item.titulo}</b>
                  <span className="text-admin-muted">
                    {item.estado === "publicado" ? "Publicado" : "Borrador"} ·{" "}
                    {new Date(item.actualizado_en).toLocaleDateString("es-AR")}
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="rounded-admin-card border border-admin-border bg-admin-surface p-5">
          {!article ? (
            <p className="font-sans text-sm text-admin-muted">
              Seleccioná un artículo de la lista, o creá uno nuevo.
            </p>
          ) : (
            <div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div>
                  <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Título
                  </label>
                  <input
                    value={article.titulo}
                    onChange={(e) => setArticle({ ...article, titulo: e.target.value })}
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Autor
                  </label>
                  <input
                    value={article.autor ?? ""}
                    onChange={(e) => setArticle({ ...article, autor: e.target.value })}
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Categoría
                  </label>
                  <select
                    value={article.categoria}
                    onChange={(e) => setArticle({ ...article, categoria: e.target.value })}
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  >
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Estado
                  </label>
                  <select
                    value={article.estado}
                    onChange={(e) =>
                      setArticle({ ...article, estado: e.target.value as "borrador" | "publicado" })
                    }
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  >
                    <option value="borrador">Borrador</option>
                    <option value="publicado">Publicado</option>
                  </select>
                </div>
              </div>

              <div className="mt-5">
                <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                  Contenido
                </label>
                <div className="mt-1.5">
                  <RichTextEditor
                    content={article.contenido_html}
                    onChange={(html) => setArticle({ ...article, contenido_html: html })}
                  />
                </div>
              </div>

              <div className="mt-5 border-t border-admin-border pt-4">
                <button
                  type="button"
                  onClick={() => setSeoOpen((v) => !v)}
                  className="font-sans text-sm font-semibold text-admin-text"
                >
                  SEO {seoOpen ? "⌃" : "⌄"}
                </button>
                {seoOpen ? (
                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                        Meta title
                      </label>
                      <input
                        value={article.meta_title ?? ""}
                        onChange={(e) => setArticle({ ...article, meta_title: e.target.value })}
                        className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                        URL canónica
                      </label>
                      <input
                        value={article.url_canonica ?? ""}
                        onChange={(e) => setArticle({ ...article, url_canonica: e.target.value })}
                        className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                        Meta description
                      </label>
                      <textarea
                        rows={3}
                        value={article.meta_description ?? ""}
                        onChange={(e) =>
                          setArticle({ ...article, meta_description: e.target.value })
                        }
                        className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
