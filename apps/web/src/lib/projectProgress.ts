// Evidence-backed planning checkpoints. This is NOT a live estimate of elapsed work,
// launch readiness, or percent of technical effort; only verified closed gates count.
export type ProjectGateStatus = "verified" | "in_progress" | "blocked" | "planned";
export type ProjectGate = {
  id: string;
  title: string;
  status: ProjectGateStatus;
  evidence: string;
  href?: string;
  next: string;
};

export const PROJECT_PROGRESS_SNAPSHOT = "2026-11-18";
export const PROJECT_GATES: readonly ProjectGate[] = [
  {
    id: "repository-baseline",
    title: "Base editorial integrada",
    status: "verified",
    evidence: "PR #186 fusionada en main; este hito solo cubre la base del repositorio, no producción.",
    href: "https://github.com/francoisbowman-cloud/aromia-lab/pull/186",
    next: "Verificar despliegue y condiciones de publicación por separado."
  },
  {
    id: "intelligence-runtime",
    title: "Intelligence operativo y persistente",
    status: "in_progress",
    evidence: "PR #214 (draft): PostgreSQL aislado, leases, retries, auditoría y navegador probados; batch finito opt-in, registro de ejecuciones (029), diagnóstico de salud con exit code, retención y ensayo local de scheduler/rollback (62 pruebas). Runtime autorizado y scheduler persistente no certificados.",
    href: "https://github.com/francoisbowman-cloud/aromia-lab/pull/214",
    next: "Probar el batch de CI nuevo, demostrar scheduler, permisos, alertas, recuperación y continuidad en runtime autorizado; certificar solo con evidencia y autorización."
  },
  {
    id: "editorial-pilot",
    title: "Piloto editorial de extremo a extremo",
    status: "blocked",
    evidence: "Existe un expediente piloto y fuentes capturadas; sin artículo autónomo verificado, proveedor ni presupuesto aprobados.",
    next: "Cerrar investigación, fact-checking, arte, derechos, QA y aprobación humana."
  },
  {
    id: "visual-integrity",
    title: "Integridad de imágenes y dirección artística",
    status: "in_progress",
    evidence: "PR #188–#194: detector, cola de revisión, huellas y panel. Inventario de procedencia del catálogo vivo (18-11): 125/125 imágenes remotas servidas por proxy desde el dominio de Aromia; 44 del CDN de Fragrantica, 1 de un marketplace de usuarios; 0 con identidad, derechos o calidad verificados.",
    href: "https://github.com/francoisbowman-cloud/aromia-lab/pull/194",
    next: "El Publisher define la política de procedencia y el orden de revisión; auditar frascos reales y resolver la bergamota con recurso aprobado."
  },
  {
    id: "living-edition",
    title: "Living Edition y composición editorial dinámica",
    status: "planned",
    evidence: "Auditoría renderizada local con tema oscuro real y artículos de prueba: corregidos CLS del pie, enlaces ilegibles en oscuro, pie de foto y semántica del lector paginado. Hoy ningún artículo se sirve desde producción (API 500). Composición dinámica y revisión de diseño humana no verificadas.",
    next: "Revisión de dirección de arte con assets reales aprobados y piloto Living Edition acotado."
  },
  {
    id: "creative-studio",
    title: "Creative Studio audiovisual",
    status: "planned",
    evidence: "Sin pipeline audiovisual autónomo operativo ni derechos/costes validados.",
    next: "Construir piloto original reproducible con QA y presupuesto supervisado."
  },
  {
    id: "marketing-revenue",
    title: "Distribución y modelo comercial verificables",
    status: "planned",
    evidence: "Afiliación contextual existente; los enlaces de Amazon dentro de artículos ahora salen con rel sponsored nofollow (antes se sobrescribía). Atribución, newsletter y operación de campañas sin cierre.",
    next: "Verificar enlaces en producción, divulgaciones, analítica y resultados reales."
  },
  {
    id: "discovery",
    title: "Discovery personal y PWA",
    status: "planned",
    evidence: "Discovery y familias sin hallazgos de accesibilidad en la auditoría renderizada local (tema oscuro real, CLS corregido). No hay manifest, iconos ni service worker: criterios PWA sin cumplir.",
    next: "Definir iconos de marca (decisión del Publisher), manifest y política offline; validar privacidad y rendimiento."
  },
  {
    id: "omni",
    title: "Integración OMNI segura",
    status: "blocked",
    evidence: "Adaptador desacoplado en Aromia (contrato aromia-omni/1, desactivado por defecto) con 6 pruebas contra un doble local; handshake y endpoint remoto de OMNI no verificados.",
    next: "Verificar el contrato real con el Publisher/OMNI sin modificar el repo de OMNI; habilitar solo con aprobación."
  },
  {
    id: "release",
    title: "QA integral y lanzamiento autorizado",
    status: "blocked",
    evidence: "Faltan verificaciones de producción, derechos, seguridad, rendimiento y aprobación de lanzamiento.",
    next: "Ejecutar compuertas técnicas y editoriales antes de publicar."
  }
];

export function projectGateProgress(gates: readonly ProjectGate[]) {
  if (!gates.length || new Set(gates.map(g => g.id)).size !== gates.length) throw new Error("invalid_project_gates");
  const verified = gates.filter(g => g.status === "verified").length;
  return {
    verified,
    total: gates.length,
    percent: Math.round(100 * verified / gates.length),
    inProgress: gates.filter(g => g.status === "in_progress").length,
    blocked: gates.filter(g => g.status === "blocked").length,
    planned: gates.filter(g => g.status === "planned").length
  };
}
