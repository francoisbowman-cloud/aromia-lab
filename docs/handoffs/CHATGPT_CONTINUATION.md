# Aromia — continuación en ChatGPT (2026-11-18)

Fuente operativa vigente: `AROMIA_MASTER_HANDOFF.md` (rama `handoff/aromia-final-unified-20261118`). Checkpoint técnico detallado: `docs/handoffs/AROMIA_LATEST.md`. Este archivo es el resumen para retomar sin Claude Code.

## Dónde está el trabajo
- Repo `francoisbowman-cloud/aromia-lab`, rama única de integración **`claude/aromia-integration`** (hereda #206/#208/#209/#212; no re-fusionar).
- PR draft de revisión: **#214** hacia `main`. **RELEASE HOLD.** No es permiso de merge.
- HEAD al escribir: `35c26d0`. CI de #214 en curso (6 pass, 9 pending, 0 fail al corte).

## Hecho (desarrollado y probado localmente; CI pendiente)
1. **Tiptap 3.34.0** (familia exacta: core, pm, react, starter-kit, extension-image) + 5 tests de ida y vuelta del editor (jsdom).
2. **Next.js 14.2.35 → 16.4.6**, eslint 9 flat config (`eslint.config.mjs`), params/searchParams/cookies async, `useParams()` en la página cliente admin de perfumes, `turbopack.root` fijado. Plugin Tailwind en `postcss.config.mjs` SIN ruta `config` explícita (rompe Turbopack).
3. **node-cron 4.6.0** en `apps/api` (elimina uuid transitivo).
4. Fix del smoke QA: selector de alerta acotado al `form` (el route-announcer de Next 16 también es `role=alert`).
- `npm audit --omit=dev`: web 0, api 0 (antes web 1 crítica/2 altas/26 moderadas; api 2 moderadas).
- Tests: web 128 ok / 2 fallan por EPERM de symlinks en Windows (entorno, preexistente; correr en Linux/CI). API: uploads 1/1, content 3/3, intelligence 18/18 con Postgres desechable (docker) usando `INTELLIGENCE_TEST_DATABASE_URL=postgresql://postgres:test@127.0.0.1:5544/aromia_test`.

## Pendiente / próximo
- Leer resultados de CI de #214 y corregir fallos (no desactivar gates).
- P1 Intelligence: scheduler/colas (idempotencia, reintentos, costes, permisos), agentes propuestos vs operativos.
- P1 piloto editorial (un solo piloto con fuentes/fact-check/Voice Bible, sin publicar) y auditoría de fidelidad visual de frascos (`verified` / `unverified` / `material_mismatch_blocked`), sin sustituir nada.
- Deuda técnica: React 18 deprecado en Next 16 (→19); `middleware.ts` → `proxy.ts` (con prueba de auth); script `lint` de `apps/api` roto (eslint no es dependencia); 11 warnings `react-hooks/set-state-in-effect`; validar editor Tiptap en navegador real/staging.
- Gates certificados: 1/10 (no inventar porcentajes).

## Reglas que siguen vigentes
- Sin merge a `main`, deploy, migraciones/datos en producción, gasto (APIs/GPU), ni aprobación de contenido/identidad visual/licencias sin autorización explícita del Publisher.
- Prohibido: force-push/reset --hard sobre trabajo ajeno, `npm audit fix --force`, `--legacy-peer-deps`, borrar tests para dar verde, declarar `skipped` como `passed`.
- Voz: `AROMIA_VOICE_BIBLE.md`, `AROMIA_EDITORIAL_WORKFLOW.md`. Imágenes de perfume deben coincidir con el producto real.
- Nota para ChatGPT: no tiene acceso a la máquina local; trabajar vía repo/PR, y dejar cualquier ejecución (build, docker, tests) a Claude Code o CI.

RELEASE_STATUS: HOLD
