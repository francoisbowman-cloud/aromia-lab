# Scripts del sistema de imágenes — Aromia

Paquete propio (`@aromia/image-scripts`), separado de `apps/web` y `apps/api`
a propósito — es tooling de mantenimiento, no código de producción, y no debe
inflar el `node_modules` que se buildea en el Dockerfile de esas dos apps.

## Instalación

```bash
cd scripts/images
npm install
```

## Scripts de validación (solo lectura, nunca escriben nada)

```bash
npm run validate-metadata      # valida metadata.json contra metadata.schema.json
npm run validate-names         # valida convención de nombre de archivo
npm run validate-aspect-ratio  # valida 4:5 real (lee dimensiones con sharp) en catálogo
npm run check-missing          # cruza data/image-inventory.csv contra archivos en disco
npm run find-duplicates        # hash SHA-256, detecta derivados byte-idénticos
npm run validate-weight        # compara peso real contra los presupuestos de docs/images/IMAGE-ARCHITECTURE.md
npm run find-external-urls     # lista dominios externos de hotlink usados hoy
npm run report                 # corre todos los anteriores y da un resumen único
```

Todos terminan con código de salida `0` si no hay problemas y `!= 0` si los
hay — pensados para poder engancharse a CI en una fase futura, aunque en la
Fase 1 no están conectados a ningún workflow todavía.

## Script de generación (`optimize.mjs`)

El único script que escribe archivos. Reglas de seguridad, aplicadas en
código, no solo documentadas:

- **Nunca toca el original** (`--source` se abre solo en modo lectura).
- **Nunca tiene una carpeta de salida por defecto** — `--out` es obligatorio,
  para que sea imposible ejecutarlo "por las dudas" y que pise algo en
  `apps/web/public` sin que la persona lo haya tipeado explícitamente.
- **Nunca sobrescribe un derivado existente** salvo `--force` explícito.
- **Soporta `--dry-run`** — imprime qué generaría, sin escribir nada.
- **No hace commit, push, ni merge** — genera archivos locales, el resto del
  flujo (revisión, `git add`, PR) es manual.

Ejemplo:

```bash
node optimize.mjs \
  --slug aventus \
  --role catalog \
  --source ./work/aventus-original.jpg \
  --out ../../apps/web/public/images/perfumes/aventus/catalog \
  --dry-run
```

Sacar `--dry-run` recién cuando el resultado impreso se ve correcto.

## Qué NO hace ningún script de esta carpeta

- No publican nada a producción.
- No hacen fusión (`merge`) a `main` ni a ninguna rama.
- No aceptan errores en silencio — cualquier falla real termina el proceso
  con código de salida distinto de cero y un mensaje `✖` explícito.
- No inventan datos: si algo no se puede determinar (falta un archivo, una
  URL no resuelve), lo reportan como tal, no lo omiten del reporte.
