# Aromia Material Library v1

Banco reusable y versionado de materias visuales para Aromia. GitHub es la fuente canónica porque permite que humanos, Claude Code y otros colaboradores trabajen sobre los mismos activos, metadatos y reglas mediante ramas y pull requests, sin mantener una base de datos adicional.

## Estructura

- `files/` — binarios WebP/PNG listos para composición.
- `materials.csv` — índice principal, fácil de leer y editar por humanos, Claude, hojas de cálculo y scripts.
- `manifest.json` — manifiesto estructurado original con hashes y reglas globales.
- `schema.json` — contrato de datos de cada material.
- `priority-backlog.json` — huecos que OMNI debe cubrir según recurrencia y utilidad en el catálogo.

## Contrato de uso

Los activos son atmosféricos/editoriales; no son evidencia de producto. Nunca sustituyen packshots canónicos ni pueden modificar botella, etiqueta, tapón, logo, color o silueta de un perfume real. Un ingrediente solo puede presentarse como nota factual de un perfume cuando la provenance del catálogo lo confirma. Preferir uno o dos materiales con significado antes que abundancia decorativa.

`approved_for_editorial=true` permite usar el activo como materia visual. `approved_for_product_identity=false` significa que jamás debe utilizarse para probar o representar la identidad canónica de un perfume. `canonical_product_identity` debe seguir en `false` para todos los ingredientes.

## Flujo para colaboradores / Claude

1. Leer `materials.csv`, `schema.json` y `priority-backlog.json` antes de modificar la biblioteca.
2. Trabajar siempre en una rama; no editar `main` directamente.
3. Para añadir un material: crear el binario en `files/<id>.webp`, añadir exactamente una fila a `materials.csv`, registrar el mismo activo en `manifest.json` y calcular SHA-256 real.
4. Mantener `id` en kebab-case y rutas relativas estables.
5. No marcar un activo como `approved` si presenta anatomía imposible, duplicaciones, textura plástica, halos, bordes recortados evidentes, patrones repetitivos o señales generativas que reduzcan la confianza.
6. No inventar relaciones perfume→ingrediente. Esa relación pertenece al catálogo/provenance, no a esta biblioteca.
7. Abrir PR con: materiales añadidos/cambiados, hashes, evidencia visual, uso previsto y cualquier restricción.

## Lectura rápida desde herramientas

Para obtener toda la base sin inspeccionar imágenes primero, usar `assets/aromia-materials/materials.csv`. Para aplicaciones que prefieran JSON, usar `manifest.json`. Para priorizar producción nueva, usar `priority-backlog.json`. Los binarios se encuentran por la columna `relative_path`.

## Gate NO-IA / autenticidad

Rechazar cualquier activo con anatomía imposible, duplicaciones, semillas/pétalos deformes, textura plástica, halos, bordes recortados evidentes, patrones repetitivos o artefactos generativos visibles. Para materias abstractas o asociadas históricamente a origen animal —por ejemplo almizcle— no usar una representación animal engañosa: preferir una abstracción material claramente editorial o tratamiento educativo etiquetado.
