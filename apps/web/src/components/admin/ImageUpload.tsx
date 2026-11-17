"use client";

import { useEffect, useRef, useState } from "react";

export function ImageUpload({
  currentUrl,
  onUpload,
  onUrlSave,
  label = "Imagen de portada",
}: {
  currentUrl?: string;
  label?: string;
  onUpload: (file: File) => Promise<void>;
  onUrlSave: (url: string) => Promise<void>;
}) {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState(currentUrl ?? "");
  const [savingUrl, setSavingUrl] = useState(false);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    setUrlDraft(currentUrl ?? "");
  }, [currentUrl]);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    if (file.size > 5 * 1024 * 1024 || !["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Usá una imagen PNG, JPG o WEBP de hasta 5MB.");
      e.target.value = "";
      return;
    }
    const input = e.target;

    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const url = URL.createObjectURL(file);
    previewRef.current = url;
    setPreview(url);
    setUploading(true);
    try {
      await onUpload(file);
    } catch {
      setError("No se pudo subir la imagen. La anterior se conserva; reintentá.");
    } finally {
      URL.revokeObjectURL(url);
      previewRef.current = null;
      setPreview(null);
      input.value = "";
      setUploading(false);
    }
  }

  const displayUrl = preview ?? currentUrl;

  return (
    <div className="rounded-admin-card border border-admin-border bg-admin-surface p-4">
      <h3 className="font-sans text-sm font-semibold text-admin-text">{label}</h3>
      <div className="mt-3 flex h-[220px] items-center justify-center overflow-hidden rounded bg-admin-bg">
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="font-sans text-xs text-admin-muted">Sin imagen</span>
        )}
      </div>
      <label className="mt-3 block rounded focus-within:ring-2 focus-within:ring-ring">
        <span className="inline-block cursor-pointer rounded border border-admin-border px-4 py-2 font-sans text-xs">
          {uploading ? "Subiendo…" : "Reemplazar imagen"}
        </span>
        <input
          type="file"
          aria-label={`Subir ${label.toLowerCase()}`}
          accept="image/png,image/jpeg,image/webp"
          onChange={handleChange}
          className="sr-only"
          disabled={uploading}
        />
      </label>
      {error ? <p role="alert" className="mt-2 text-sm text-destructive">{error}</p> : null}
      <p className="mt-2 font-sans text-[11px] text-admin-muted">PNG, JPG o WEBP. Máx. 5MB.</p>

      <div className="mt-4 border-t border-admin-border pt-3">
        <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
          o pegar URL externa
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            type="url"
            placeholder="https://…"
            aria-label={`URL de ${label.toLowerCase()}`}
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            className="min-w-0 flex-1 rounded border border-admin-border px-2 py-1.5 font-sans text-xs outline-none focus:border-gold focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <button
            type="button"
            disabled={savingUrl || !urlDraft || urlDraft === currentUrl}
            onClick={async () => {
              setError(null);
              try {
                const url = new URL(urlDraft);
                if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid protocol");
              } catch { setError("Usá una URL HTTP o HTTPS completa."); return; }
              setSavingUrl(true);
              try {
                await onUrlSave(urlDraft);
              } catch {
                setError("No se pudo guardar la URL. Reintentá.");
              } finally {
                setSavingUrl(false);
              }
            }}
            className="shrink-0 rounded border border-admin-border px-3 py-1.5 font-sans text-xs disabled:opacity-50"
          >
            {savingUrl ? "…" : "Usar"}
          </button>
        </div>
      </div>
    </div>
  );
}
