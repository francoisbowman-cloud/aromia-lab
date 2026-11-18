# Aromia — continuación para Claude Code

El Publisher solicita guardar el trabajo y continuar en Claude Code, sin publicar.

## Inicio

```sh
git status --short --branch
git fetch origin codex/aromia-next-security-20261118
git switch -c claude/aromia-security-continuation FETCH_HEAD
```

Si existe trabajo sin guardar, usar otro worktree; no reset ni force. El checkout original /workspace/aromia-lab permanece intacto. Los checkouts Codex son /workspace/aromia-security (Tiptap) y /workspace/aromia-next (Next).

Leer íntegros AGENTS.md y el checkpoint más reciente de CODEX_HANDOFF.md; después el encabezado de AROMIA_CURRENT_STATE.md. Allí están cambios, evidencia, pendientes y límites. Reconciliar GitHub PR206/208/209/210 y la nueva draft de Next, sin asumir resultados CI por informes históricos.

## Verificación inmediata

```sh
npm ci --prefix apps/web
npm --prefix apps/web test
npm --prefix apps/web run lint
npm --prefix apps/web run typecheck
npm --prefix apps/web run build
npm audit --prefix apps/web --omit=dev --json
npm ls --prefix apps/web @tiptap/core @tiptap/pm postcss
```

Utilizar Node22 para el gate de compatibilidad. Browser: después del build, ejecutar scripts/qa/admin-browser-smoke.cjs con PLAYWRIGHT_PACKAGE_PATH apuntando al paquete instalado; PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH es opcional para Chromium del sistema. Usa API fixture aislada, no producción. No correr dos smokes a la vez: usan puertos3107/4407.

Ejecutar también .github/workflows/aromia-integrated-qa.yml y auditoría estricta. No silenciar checks para aprobar la migración. Completar cobertura de guardar/editar/rehidratar CMS con API fixture; las pruebas DOM del editor no sustituyen persistencia completa.

Continuar automáticamente con los bloques C y D elegibles del handoff tras resolver B; documentar y pasar a trabajo seguro si aparece un bloqueo real. No exigir «Siguiente». Mantener la revista editorial, criterios de identidad visual y1/10 hitos verificados.

Prohibido: merge a main, deploy, publicar contenido, modificar producción/OMNI, reemplazar imágenes o aprobar derechos/identidad, gastar en proveedores sin autorización explícita. PRs solo en borrador. Actualizar handoff después de cada bloque.
