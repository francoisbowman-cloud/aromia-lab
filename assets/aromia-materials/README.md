# Aromia Material Library v1

Banco reusable y versionado de materias visuales para Aromia. **GitHub es la fuente canónica**: humanos, Claude Code y otros colaboradores pueden trabajar sobre los mismos activos, metadatos y reglas mediante ramas y pull requests, sin mantener una base de datos adicional.

## Estructura

- `materials.csv` — índice simple para humanos, Claude, Sheets y scripts: identidad del material, categoría, archivo, ruta y estado.
- `manifest.json` — fuente de integridad: hashes, dimensiones, peso, variante web, lineage y política de identidad.
- `schema.json` — contrato formal de los registros de `manifest.json`.
- `aliases.json` — compatibilidad controlada de IDs; los consumidores deben resolver aliases antes de relacionar datos.
- `priority-backlog.json` — materiales faltantes priorizados contra evidencia del catálogo.
- `files/` — ubicación canónica de los WebP/PNG cuando el bundle binario ha sido ingerido.
- `CLAUDE.md` — contrato operativo para colaboradores agentes.
- `INGEST.md` — procedimiento reproducible para incorporar/verificar binarios.

## Contrato de uso

Los activos son **atmosféricos/editoriales; no son evidencia de producto**. Nunca sustituyen packshots canónicos ni pueden modificar botella, etiqueta, tapón, logo, color o silueta de un perfume real. Un ingrediente solo puede presentarse como nota factual de un perfume cuando la provenance del catálogo lo confirma. Preferir uno o dos materiales con significado antes que abundancia decorativa.

La política de esta biblioteca prohíbe usar ingredientes como identidad canónica de producto. `manifest.json` mantiene `canonical_product_identity=false` para cada activo; el validator convierte cualquier violación en fallo.

## Flujo para colaboradores / Claude

1. Leer `README.md`, `CLAUDE.md`, `materials.csv`, `manifest.json` y `priority-backlog.json`.
2. Trabajar siempre en una rama; no editar `main` directamente.
3. Para añadir un material: crear `files/<id>.webp`, añadir una fila a `materials.csv`, registrar el activo completo en `manifest.json` y calcular SHA-256 real.
4. Mantener IDs en kebab-case, resolver `aliases.json` y preservar rutas estables.
5. Ejecutar primero el gate de metadata y, antes de integración/release, el gate estricto de binarios.
6. No inventar relaciones perfume→ingrediente. Esa relación pertenece al catálogo/provenance.
7. Abrir PR con materiales cambiados, hashes, evidencia visual, uso previsto y restricciones.

## Validación

```bash
node scripts/materials/validate-material-library.mjs
node scripts/materials/validate-material-library.mjs --require-binaries
```

El primer comando permite colaboración sobre metadata sin descargar todas las imágenes. El segundo exige que cada binario exista y que su SHA-256 y tamaño coincidan con el manifiesto.

## Lectura rápida

Para explorar o editar inventario, empezar por `assets/aromia-materials/materials.csv`. Para automatización e integridad, usar `manifest.json`. Para decidir qué producir después, usar `priority-backlog.json`.

## Gate NO-IA / autenticidad

Rechazar anatomía imposible, duplicaciones, semillas/pétalos deformes, textura plástica, halos, recortes evidentes, patrones repetitivos o artefactos generativos visibles. Para materias abstractas o asociadas históricamente a origen animal —por ejemplo almizcle— no usar una representación animal engañosa: preferir abstracción material claramente editorial o tratamiento educativo etiquetado.
