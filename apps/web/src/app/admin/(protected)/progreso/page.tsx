import ProjectProgress from "@/components/admin/ProjectProgress";

export default function ProjectProgressPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header>
        <h1 className="text-3xl font-semibold text-stone-900">Estado de Aromia</h1>
        <p className="mt-2 text-sm text-stone-700">Hitos, evidencias y próximas compuertas del plan maestro. Sin aprobaciones automáticas.</p>
      </header>
      <ProjectProgress />
    </div>
  );
}
