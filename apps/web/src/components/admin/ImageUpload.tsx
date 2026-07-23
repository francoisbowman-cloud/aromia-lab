"use client";

import { useEffect, useRef, useState } from "react";

export function ImageUpload({
  currentUrl,
  onUpload,
}: {
  currentUrl?: string;
  onUpload: (file: File) => Promise<void>;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const url = URL.createObjectURL(file);
    previewRef.current = url;
    setPreview(url);
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
    }
  }

  const displayUrl = preview ?? currentUrl;

  return (
    <div className="rounded-admin-card border border-admin-border bg-admin-surface p-4">
      <h3 className="font-sans text-sm font-semibold text-admin-text">Imagen de portada</h3>
      <div className="mt-3 flex h-[220px] items-center justify-center overflow-hidden rounded bg-admin-bg">
        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="font-sans text-xs text-admin-muted">Sin imagen</span>
        )}
      </div>
      <label className="mt-3 block">
        <span className="inline-block cursor-pointer rounded border border-admin-border px-4 py-2 font-sans text-xs">
          {uploading ? "Subiendo…" : "Reemplazar imagen"}
        </span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />
      </label>
      <p className="mt-2 font-sans text-[11px] text-admin-muted">PNG, JPG o WEBP. Máx. 5MB.</p>
    </div>
  );
}
