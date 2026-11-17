"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { adminRequest } from "@/lib/adminRequest";
import Image from "next/image";
import { compareVisualClaims } from "@/lib/visualReviewComparison";
import VisualProvenanceDraft from "@/components/admin/VisualProvenanceDraft";

type Observation = {
  id: number;
  review_id: string;
  product_slug: string;
  product_fingerprint: string;
  image_sha256: string;
  operator_note: string;
  evidence: { identity?: string; rights?: string; visual?: string };
  status: string;
  actor: string;
  recorded_at: string;
};
type JournalResponse = {
  reviews: Observation[];
  publication: "blocked";
  rightsVerified: false;
  identityVerified: false;
};
type VisualEvidence = {
  url: string; bytesSha256: string; bytes: number; width: number; height: number;
  format: string; publication: "blocked"; identityVerified: false;
  rightsVerified: false; visualQualityVerified: false;
};
const validLocalAsset = (value: string) =>
  /^\/[a-zA-Z0-9_./-]+\.(png|jpe?g|webp|avif|gif)$/i.test(value) &&
  !value.includes("//") && !value.split("/").some(part => part === "." || part === "..");
const validSlug = (value: string) => /^[a-z0-9][a-z0-9._-]{0,159}$/.test(value);

export default function VisualReviewJournalPage() {
  const [slug, setSlug] = useState("");
  const [searched, setSearched] = useState("");
  const [records, setRecords] = useState<Observation[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const [assetPath, setAssetPath] = useState("");
  const [assetEvidence, setAssetEvidence] = useState<VisualEvidence | null>(null);
  const [assetError, setAssetError] = useState("");
  const [assetBusy, setAssetBusy] = useState(false);
  const assetRequestRef = useRef<AbortController | null>(null);

  const lookup = useCallback(async (target: string) => {
    if (!validSlug(target)) {
      setError("Introduce un slug válido (minúsculas, números, guiones o puntos).");
      return;
    }
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setBusy(true);
    setError("");
    setLoaded(false);
    setRecords([]);
    setAssetEvidence(null); // Prevent a different perfume query from reusing an old image comparison.
    setSearched(target);
    try {
      const result = await adminRequest<JournalResponse>(
        `/api/admin/intelligence/visual-reviews?slug=${encodeURIComponent(target)}`,
        { signal: controller.signal }
      );
      if (controller.signal.aborted) return;
      if (result.publication !== "blocked" || result.identityVerified !== false || result.rightsVerified !== false)
        throw new Error("Unexpected review response");
      setRecords(result.reviews);
      setLoaded(true);
    } catch {
      if (!controller.signal.aborted)
        setError("No se pudo consultar el historial. Comprueba la sesión y que el registro esté habilitado.");
    } finally {
      if (requestRef.current === controller) setBusy(false);
    }
  }, []);
  useEffect(() => () => {
    requestRef.current?.abort();
    assetRequestRef.current?.abort();
  }, []);

  async function inspectAsset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = assetPath.trim();
    if (!validLocalAsset(target)) {
      setAssetEvidence(null);
      setAssetError("Utiliza una ruta local de imagen, por ejemplo /editorial-v1/bergamot-editorial-v2.webp.");
      return;
    }
    assetRequestRef.current?.abort();
    const controller = new AbortController();
    assetRequestRef.current = controller;
    setAssetBusy(true);
    setAssetEvidence(null);
    setAssetError("");
    try {
      const result = await adminRequest<VisualEvidence>(
        `/api/admin/intelligence/visual-evidence?asset=${encodeURIComponent(target)}`,
        { signal: controller.signal }
      );
      if (controller.signal.aborted) return;
      if (result.publication !== "blocked" || result.identityVerified !== false ||
          result.rightsVerified !== false || result.visualQualityVerified !== false ||
          result.url !== target || !/^[a-f0-9]{64}$/.test(result.bytesSha256)) {
        throw new Error("Unexpected asset evidence");
      }
      setAssetEvidence(result);
    } catch {
      if (!controller.signal.aborted)
        setAssetError("No se pudo inspeccionar la imagen local. Comprueba su ruta y que el módulo de evidencia esté habilitado.");
    } finally {
      if (assetRequestRef.current === controller) setAssetBusy(false);
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void lookup(slug.trim());
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 text-stone-900">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[.2em] text-stone-600">Aromia Intelligence / control editorial</p>
        <h1 className="text-3xl font-semibold">Revisión visual</h1>
        <p>Consulta privada de observaciones sobre imágenes de perfumes. Ningún registro certifica derechos, identidad del frasco ni autoriza publicación.</p>
      </header>

      <section className="rounded border border-stone-300 bg-white p-5" aria-labelledby="search-title">
        <h2 id="search-title" className="mb-3 text-xl font-semibold">Buscar historial por perfume</h2>
        <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={submit}>
          <label className="flex-1 text-sm font-medium">
            Slug del perfume
            <input
              value={slug} onChange={event => setSlug(event.target.value)}
              maxLength={160} autoComplete="off" placeholder="chance-eau-tendre"
              className="mt-2 block w-full rounded border border-stone-400 bg-white p-3 text-stone-950"
              required aria-describedby="search-help"
            />
          </label>
          <button type="submit" disabled={busy} className="rounded bg-stone-900 px-5 py-3 text-white disabled:opacity-60">
            {busy ? "Consultando…" : "Consultar"}
          </button>
        </form>
        <p id="search-help" className="mt-3 text-sm text-stone-600">Solo consulta registros existentes. No modifica imágenes ni fichas.</p>
      </section>

      <section className="rounded border border-stone-300 bg-white p-5" aria-labelledby="visual-asset-title">
        <h2 id="visual-asset-title" className="mb-2 text-xl font-semibold">Inspección de una imagen local</h2>
        <p className="mb-4 text-sm text-stone-600">
          Introduce la ruta pública exacta de una imagen ya existente en Aromia. No se descargan imágenes de Amazon ni se genera contenido.
        </p>
        <form onSubmit={inspectAsset} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm font-medium">
            Ruta pública del archivo
            <input value={assetPath} maxLength={512} onChange={event => {
              setAssetPath(event.target.value); setAssetEvidence(null); setAssetError("");
            }} placeholder="/editorial-v1/bergamot-editorial-v2.webp"
              className="mt-2 block w-full rounded border border-stone-400 bg-white p-3 text-stone-950" required />
          </label>
          <button type="submit" disabled={assetBusy}
            className="rounded bg-stone-900 px-5 py-3 text-white disabled:opacity-60">
            {assetBusy ? "Inspeccionando…" : "Inspeccionar archivo"}
          </button>
        </form>
        {assetError && <p role="alert" className="mt-3 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-950">{assetError}</p>}
        {assetEvidence && <div className="mt-5 grid gap-4 border-t pt-4 md:grid-cols-[minmax(0,240px)_1fr]">
          <div className="overflow-hidden rounded bg-stone-100">
            <Image unoptimized src={assetEvidence.url} alt="Vista previa del archivo para revisión; identidad del perfume sin verificar"
              width={assetEvidence.width} height={assetEvidence.height}
              className="h-auto max-h-72 w-full object-contain" />
          </div>
          <div className="min-w-0 space-y-2 text-sm">
            <p><strong>Formato:</strong> {assetEvidence.format.toUpperCase()} · {assetEvidence.width} × {assetEvidence.height} px</p>
            <p><strong>Tamaño:</strong> {assetEvidence.bytes.toLocaleString("es")} bytes</p>
            <p className="break-all"><strong>SHA-256 real:</strong> {assetEvidence.bytesSha256}</p>
            <p className="font-medium text-amber-900">Archivo inspeccionado, no certificado. Identidad, derechos y calidad siguen pendientes.</p>
            {loaded && searched && <div className="space-y-1 rounded border border-stone-300 p-3 text-stone-800" role="status">
              <p className="font-semibold">Comparación técnica · {searched}</p>
              {(() => {
                const comparison = compareVisualClaims(searched, assetEvidence.bytesSha256, records);
                return <>
                  <p>{comparison.state === "no_history"
                    ? "No hay huellas registradas para este perfume."
                    : comparison.state === "match_claimed_digest"
                      ? "La imagen coincide con una huella previamente declarada para este perfume."
                      : "La imagen no coincide con ninguna huella registrada para este perfume."}</p>
                  <p>{comparison.comparedClaims} registros comparados · {comparison.matchingReviewIds.length} coincidencias · {comparison.mismatchingReviewIds.length} divergencias.</p>
                  <p className="text-amber-950">Las coincidencias son técnicas; no certifican concentración, frasco, licencia ni calidad visual. Publicación bloqueada.</p>
                </>;
              })()}
            </div>}
          </div>
        </div>}
      </section>

      {assetEvidence && loaded && searched && <VisualProvenanceDraft
        key={`${searched}:${assetEvidence.url}:${assetEvidence.bytesSha256}`}
        slug={searched} imageUrl={assetEvidence.url} sha256={assetEvidence.bytesSha256}
      />}

      {error && <p role="alert" className="rounded border border-red-300 bg-red-50 p-4 text-red-950">{error}</p>}
      {loaded && (
        <section aria-labelledby="results-title" className="space-y-4 rounded border border-stone-300 bg-white p-5">
          <h2 id="results-title" className="text-xl font-semibold">Historial: {searched}</h2>
          <p role="status" className="text-sm text-stone-600">{records.length} observaciones registradas · identidad y derechos sin verificar</p>
          {records.length === 0 && <p>No existen observaciones para este perfume. Esto no significa que su imagen esté aprobada.</p>}
          <ol className="space-y-4">
            {records.map(record => (
              <li key={record.id} className="min-w-0 space-y-2 rounded border border-stone-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">Observación #{record.id}</h3>
                  <span className="rounded bg-amber-50 px-2 py-1 text-xs text-amber-950">Pendiente de verificación independiente</span>
                </div>
                <p className="text-sm text-stone-600">{new Date(record.recorded_at).toLocaleString("es")} · Registro {record.review_id}</p>
                <p className="whitespace-pre-wrap break-words">{record.operator_note}</p>
                <dl className="grid gap-3 text-sm sm:grid-cols-3">
                  <div><dt className="font-semibold">Identidad declarada</dt><dd className="whitespace-pre-wrap break-words">{record.evidence?.identity ?? "Sin evidencia"}</dd></div>
                  <div><dt className="font-semibold">Derechos declarados</dt><dd className="whitespace-pre-wrap break-words">{record.evidence?.rights ?? "Sin evidencia"}</dd></div>
                  <div><dt className="font-semibold">Evaluación visual</dt><dd className="whitespace-pre-wrap break-words">{record.evidence?.visual ?? "Sin evidencia"}</dd></div>
                </dl>
                <details className="text-xs text-stone-600">
                  <summary className="cursor-pointer underline">Ver huellas de trazabilidad</summary>
                  <p className="mt-2 break-all">Producto: {record.product_fingerprint}</p>
                  <p className="break-all">Imagen declarada: {record.image_sha256}</p>
                </details>
              </li>
            ))}
          </ol>
        </section>
      )}
      <aside className="rounded border border-stone-300 bg-stone-100 p-4 text-sm">
        <strong>Publicación bloqueada.</strong> Las nuevas observaciones requieren el proceso independiente de credencial editorial. Este panel es de solo lectura; todavía no verifica directamente los bytes de las imágenes ni recupera fotografías externas.
      </aside>
    </div>
  );
}
