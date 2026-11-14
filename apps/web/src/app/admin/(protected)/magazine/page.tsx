"use client";

import { useEffect, useState, useCallback } from "react";
import { adminRequest } from "@/lib/adminRequest";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface ArticleListItem {
  id: number;
  slug: string;
  titulo: string;
  categoria: string;
  estado: "borrador" | "publicado";
  imagen_portada_url: string | null;
  actualizado_en: string;
  nivel: "n1" | "n2" | "n3" | "n4" | null;
}

interface ArticleDetail extends ArticleListItem {
  contenido_html: string;
  imagen_og_url: string | null;
  autor: string | null;
  meta_title: string | null;
  meta_description: string | null;
  url_canonica: string | null;
}

const CATEGORIAS = ["resena", "guia", "analisis", "academia", "tendencias"];

const NIVELES: { value: ArticleDetail["nivel"]; label: string; hint: string }[] = [
  { value: null, label: "Sin asignar", hint: "corre como N3 (fila corriente)" },
  { value: "n1", label: "N1 · Portada", hint: "1 por tanda, con foto propia de la escena" },
  { value: "n2", label: "N2 · Destacada", hint: "2-3 por tanda, con imagen que ilustra de verdad" },
  { value: "n3", label: "N3 · Corriente", hint: "el resto — miniatura solo si ilustra el tema" },
  { value: "n4", label: "N4 · Nota breve", hint: "respiro sin foto, 1 cada 6-8 piezas" },
];

export default function AdminMagazinePage() {
  const [items, setItems] = useState<ArticleListItem[] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [seoOpen, setSeoOpen] = useState(false);
  const [saving, setSaving] = useState<"idle" | "guardando" | "publicando">("idle");
  const [saveError, setSaveError] = useState(false);

  const [listError, setListError] = useState(false);
  const [detailError, setDetailError] = useState(false);
  const [creating, setCreating] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(false);
  const [reload, setReload] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setListError(false);
    try {
      const json = await adminRequest<{ items: ArticleListItem[] }>("/api/admin/articles");
      if (!Array.isArray(json.items)) throw new Error("Invalid article list");
      setItems(json.items);
    } catch { setListError(true); }
  }, []);

  useEffect(() => { void loadList(); }, [loadList]);

  useEffect(() => {
    setArticle(null);
    setDetailError(false);
    setNotice(null);
    if (selectedId == null) { setLoadingArticle(false); return; }
    const controller = new AbortController();
    setLoadingArticle(true);
    adminRequest<ArticleDetail>(`/api/admin/articles/${selectedId}`, { signal: controller.signal })
      .then((result) => { if (!controller.signal.aborted) setArticle(result); })
      .catch(() => { if (!controller.signal.aborted) setDetailError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoadingArticle(false); });
    return () => controller.abort();
  }, [selectedId, reload]);

  function updateArticle(patch: Partial<ArticleDetail>) {
    setArticle((current) => current ? { ...current, ...patch } : current);
  }

  async function handleCreate() {
    if (creating) return;
    setCreating(true);
    setSaveError(false);
    try {
      const created = await adminRequest<ArticleDetail>("/api/admin/articles", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: "Nuevo artículo", categoria: "guia", estado: "borrador" }),
      });
      await loadList();
      setArticle(null);
      setLoadingArticle(true);
      setSelectedId(created.id);
    } catch { setSaveError(true); }
    finally { setCreating(false); }
  }

  async function saveArticle(patch: Partial<ArticleDetail>, mode: "guardando" | "publicando") {
    if (!article || saving !== "idle") return;
    const snapshot = article;
    setSaving(mode);
    setSaveError(false);
    setNotice(null);
    try {
      const updated = await adminRequest<ArticleDetail>(`/api/admin/articles/${article.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch),
      });
      // Keep any edits made while the save request was in flight.
      setArticle((current) => current === snapshot ? updated : current);
      setNotice(mode === "publicando" ? "Artículo publicado." : "Cambios guardados.");
      await loadList();
    } catch { setSaveError(true); }
    finally { setSaving("idle"); }
  }

  async function saveImage(file: File, field: "imagen_portada_url" | "imagen_og_url") {
    if (!article) return;
    const id = article.id;
    const body = new FormData();
    body.append("image", file);
    if (field === "imagen_og_url") body.append("field", "og");
    const updated = await adminRequest<Partial<ArticleDetail>>(`/api/admin/articles/${id}/image`, { method: "POST", body });
    setArticle((current) => current?.id === id ? { ...current, ...updated } : current);
    await loadList();
  }

  async function saveImageUrl(url: string, field: "imagen_portada_url" | "imagen_og_url") {
    if (!article) return;
    if (!/^https?:\/\//i.test(url)) throw new Error("Invalid image URL");
    const id = article.id;
    const updated = await adminRequest<ArticleDetail>(`/api/admin/articles/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [field]: url }),
    });
    setArticle((current) => current?.id === id ? { ...current, [field]: updated[field] } : current);
    await loadList();
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
              onClick={() => saveArticle(article, "guardando")}
              disabled={saving !== "idle"}
              className="rounded border border-admin-border px-4 py-2 font-sans text-sm"
            >
              {saving === "guardando" ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => saveArticle({ ...article, estado: "publicado" }, "publicando")}
              disabled={saving !== "idle" || !article.titulo || !article.contenido_html}
              title={
                !article.titulo || !article.contenido_html
                  ? "Completá título y contenido para poder publicar"
                  : undefined
              }
              className="rounded bg-gold-contrast px-4 py-2 font-sans text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving === "publicando" ? "Publicando…" : "Publicar"}
            </button>
          </div>
        ) : null}
      </div>

      {saveError ? (
        <p role="alert" className="mt-3 font-sans text-sm text-destructive">
          No se pudo completar la operación. Tus cambios siguen en el editor; reintentá.
        </p>
      ) : null}

      {notice ? <p role="status" className="mt-3 text-sm">{notice}</p> : null}
      {listError ? <div role="alert" className="mt-3 text-sm"><p>No se pudo cargar la lista de artículos.</p><button type="button" onClick={loadList} className="min-h-11 underline">Reintentar lista</button></div> : null}
      <div className="mt-6 grid grid-cols-1 gap-3.5 lg:grid-cols-[250px_1fr]">
        <aside className="rounded-admin-card border border-admin-border bg-admin-surface p-3">
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating}
            className="w-full rounded bg-gold-contrast px-3 py-2 font-sans text-sm font-semibold text-white"
          >
            + Nuevo artículo
          </button>

          <div role="region" aria-label="Lista de artículos" tabIndex={0} className="mt-3 grid max-h-64 gap-1 overflow-y-auto lg:max-h-[calc(100dvh-220px)]">
            {items === null && !listError ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-admin-bg" />
              ))
            ) : items === null ? null : items.length === 0 ? (
              <div className="p-4 text-center">
                <p className="font-sans text-sm text-admin-muted">Aún no hay artículos</p>
                <button
                  type="button"
                  onClick={handleCreate}
            disabled={creating}
                  className="mt-3 rounded bg-gold-contrast px-3 py-1.5 font-sans text-xs font-semibold text-white"
                >
                  Crear primer artículo
                </button>
              </div>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  aria-pressed={selectedId === item.id}
                  type="button"
                  onClick={() => { if (item.id !== selectedId) { setArticle(null); setLoadingArticle(true); setSelectedId(item.id); } }}
                  className={`rounded p-2 text-left font-sans text-xs ${
                    selectedId === item.id ? "bg-[color:color-mix(in_srgb,var(--gold)_15%,transparent)]" : "hover:bg-admin-bg"
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
          {loadingArticle ? <p role="status">Cargando artículo…</p> : detailError ? <div role="alert"><p>No se pudo cargar el artículo.</p><button type="button" onClick={() => setReload((value) => value + 1)} className="min-h-11 underline">Reintentar artículo</button></div> : !article ? (
            <p className="font-sans text-sm text-admin-muted">
              Seleccioná un artículo de la lista, o creá uno nuevo.
            </p>
          ) : (
            <div data-article-id={article.id}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                <div>
                  <label htmlFor="article-titulo" className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Título
                  </label>
                  <input id="article-titulo"
                    value={article.titulo}
                    onChange={(e) => updateArticle({ titulo: e.target.value })}
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label htmlFor="article-autor" className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Autor
                  </label>
                  <input id="article-autor"
                    value={article.autor ?? ""}
                    onChange={(e) => updateArticle({ autor: e.target.value })}
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label htmlFor="article-categoria" className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Categoría
                  </label>
                  <select id="article-categoria"
                    value={article.categoria}
                    onChange={(e) => updateArticle({ categoria: e.target.value })}
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
                  <label htmlFor="article-estado" className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Estado
                  </label>
                  <select id="article-estado"
                    value={article.estado}
                    onChange={(e) =>
                      updateArticle({ estado: e.target.value as "borrador" | "publicado" })
                    }
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  >
                    <option value="borrador">Borrador</option>
                    <option value="publicado">Publicado</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="article-nivel" className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                    Nivel editorial
                  </label>
                  <select id="article-nivel"
                    value={article.nivel ?? ""}
                    onChange={(e) =>
                      updateArticle({ nivel: (e.target.value || null) as ArticleDetail["nivel"] })
                    }
                    title={NIVELES.find((n) => (n.value ?? "") === (article.nivel ?? ""))?.hint}
                    className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                  >
                    {NIVELES.map((n) => (
                      <option key={n.label} value={n.value ?? ""}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5">
                <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                  Contenido
                </label>
                <div className="mt-1.5">
                  <RichTextEditor
                    key={article.id}
                    content={article.contenido_html}
                    onChange={(html) => updateArticle({ contenido_html: html })}
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <ImageUpload key={`${article.id}-cover`} label="Imagen de portada" currentUrl={article.imagen_portada_url ?? undefined} onUpload={(file) => saveImage(file, "imagen_portada_url")} onUrlSave={(url) => saveImageUrl(url, "imagen_portada_url")} />
                <ImageUpload key={`${article.id}-og`} label="Imagen para compartir" currentUrl={article.imagen_og_url ?? undefined} onUpload={(file) => saveImage(file, "imagen_og_url")} onUrlSave={(url) => saveImageUrl(url, "imagen_og_url")} />
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
                      <label htmlFor="article-meta_title" className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                        Meta title
                      </label>
                      <input id="article-meta_title"
                        value={article.meta_title ?? ""}
                        onChange={(e) => updateArticle({ meta_title: e.target.value })}
                        className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label htmlFor="article-url_canonica" className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                        URL canónica
                      </label>
                      <input id="article-url_canonica"
                        value={article.url_canonica ?? ""}
                        onChange={(e) => updateArticle({ url_canonica: e.target.value })}
                        className="mt-1.5 w-full rounded border border-admin-border px-3 py-2 font-sans text-sm outline-none focus:border-gold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="article-meta_description" className="font-sans text-[11px] font-bold uppercase text-admin-muted">
                        Meta description
                      </label>
                      <textarea id="article-meta_description"
                        rows={3}
                        value={article.meta_description ?? ""}
                        onChange={(e) =>
                          updateArticle({ meta_description: e.target.value })
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
