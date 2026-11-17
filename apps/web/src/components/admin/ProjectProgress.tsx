import Link from "next/link";
import { PROJECT_GATES, PROJECT_PROGRESS_SNAPSHOT, projectGateProgress } from "@/lib/projectProgress";

const label = {
  verified: "Hito verificado",
  in_progress: "En desarrollo",
  blocked: "Bloqueado",
  planned: "Pendiente",
} as const;

export default function ProjectProgress({ compact = false }: { compact?: boolean }) {
  const progress = projectGateProgress(PROJECT_GATES);
  return (
    <section className="rounded border border-stone-300 bg-white p-5 text-stone-900" aria-labelledby="aromia-progress-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[.18em] text-stone-600">Hoja de ruta · Aromia</p>
          <h2 id="aromia-progress-title" className="mt-1 text-xl font-semibold">Progreso del proyecto</h2>
        </div>
        <strong className="text-2xl tabular-nums">{progress.percent}%</strong>
      </div>
      <div
        role="progressbar"
        aria-label="Hitos de proyecto verificados"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.percent}
        aria-valuetext={`${progress.verified} de ${progress.total} hitos verificados`}
        className="mt-4 h-3 overflow-hidden rounded-full bg-stone-200"
      >
        <div className="h-full rounded-full bg-amber-800 transition-[width] duration-300" style={{ width: `${progress.percent}%` }} />
      </div>
      <p className="mt-3 text-sm text-stone-700">
        <strong>{progress.verified} de {progress.total}</strong> hitos cerrados con evidencia · {progress.inProgress} en desarrollo · {progress.blocked} bloqueados.
      </p>
      <p className="mt-2 text-xs text-stone-600">
        Corte documental: {PROJECT_PROGRESS_SNAPSHOT}. El porcentaje cuenta hitos cerrados con igual peso, no esfuerzo restante, avance en tiempo real ni preparación para lanzar.
      </p>
      {compact ? (
        <Link className="mt-4 inline-block text-sm font-semibold underline" href="/admin/progreso">Ver hitos, dependencias y evidencias</Link>
      ) : (
        <ol className="mt-6 space-y-3">
          {PROJECT_GATES.map((gate, index) => (
            <li key={gate.id} className="rounded border border-stone-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-semibold">{index + 1}. {gate.title}</h3>
                <span className="rounded bg-stone-100 px-2 py-1 text-xs text-stone-800">{label[gate.status]}</span>
              </div>
              <p className="mt-2 text-sm text-stone-700">{gate.evidence}</p>
              <p className="mt-1 text-sm text-stone-600"><strong>Próximo control:</strong> {gate.next}</p>
              {gate.href && <a className="mt-2 inline-block break-words text-sm underline" href={gate.href} target="_blank" rel="noopener noreferrer">Consultar evidencia en GitHub</a>}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
