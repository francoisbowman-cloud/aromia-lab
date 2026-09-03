# Brief de apertura — Cowork, producción editorial de Aromia

Esta sesión está conectada a la carpeta local del repo `aromia-lab`. Antes de hacer
nada, leé `ESTADO-aromia.md` y `CLAUDE.md` directo del repo (no asumas contenido de
sesiones anteriores tuyas ni de otras).

**Regla dura:** NO hagas `git commit` ni `git push`, aunque tengas permiso técnico —
eso queda exclusivo de Code. Dejá los archivos listos en el working tree y avisale a
Brey para que Code los suba.

**Regla dura:** cualquier cosa que vayas a reportar como "pendiente" o "faltante",
verificala con un comando real (`git status`, `git log`, o leyendo el archivo) — no la
infieras de memoria de sesión.

**Regla dura:** si proponés una decisión nueva para el `ESTADO`, no le asignes vos el
número — describila en prosa y dejá que Code le asigne el número al commitear.

---

## Contexto del pivote (24-25/08/2026, ver `decision-aromia-revista-sin-catalogo.md`
## en la raíz del repo si ya fue subido — si no está, pedile a Brey que lo suba)

Aromia dejó de ser comparador/catálogo navegable. Es ahora una **revista de
perfumería** con links de afiliado de Amazon embebidos dentro de los artículos. El
grid público de catálogo (`/catalogo`) desaparece de la navegación; la ficha
individual (`/catalogo/[slug]`) sobrevive solo como destino del Quiz y como contenido
indexable long-tail (no lleva `noindex` — se decidió a propósito mantenerlo
posicionable en buscadores).

El scraper de precios (Awin/Douglas/Primor) está **desactivado por el momento**
(variables vaciadas en Railway, 25/08) — no esperes precios en tiempo real actualizados
en la ficha mientras tanto.

## Tu mandato en esta sesión

Producción editorial: artículos nuevos en `apps/api/data/articles/*.md`, siguiendo el
formato de los 14 ya existentes (reseñas individuales, comparativas cabeza a cabeza,
guías por ocasión/temporada, piezas de academia sobre perfumería en general).

Usá las skills ya configuradas en este entorno para esto — no reinventes tono ni
estructura:
- `editorial-storytelling` — convierte info de perfume en historia editorial con voz
  de marca consistente.
- `magazine-layout-designer` — composición editorial premium (si el artículo necesita
  estructura visual, no solo texto).
- `maquetacion-editorial` — asimetría, jerarquía tipográfica, drop caps, pull quotes.
- `perfume-art-director` — dirección de arte para cualquier imagen nueva que el
  artículo necesite (composición, luz, materiales, cámara).

## Cosas a tener en cuenta mientras escribís

- Cada artículo que mencione un perfume específico necesita el link de afiliado de
  Amazon embebido en el texto (es la monetización real ahora, no un comparador).
- Si un artículo amerita que el perfume tenga su propia ficha profunda (`/catalogo/slug`),
  esa ficha ya existe técnicamente — no hace falta crearla, solo enlazarla si aplica.
- Los artículos con investigación de mercado, tendencias, o comparativas de marcas se
  benefician de que verifiques datos reales (notas olfativas, año de lanzamiento,
  perfumista) antes de publicar — no inventar datos de perfumería (regla ya
  establecida en el manual operativo del proyecto, sección 21, punto 12).

## Al cerrar esta sesión

Decime en 2-3 líneas qué tocaste y qué le falta a Code para subirlo — no hace falta que
resumas todo el detalle, ya está en los archivos mismos.
