# Aromia — procedencia de las imágenes del catálogo (18 nov 2026)

**Estado:** `PROVENANCE_INVENTORY` · señales de riesgo para revisión humana · **no** determina licencias ni verifica identidad de producto · PUBLICATION/REPLACEMENT: BLOCKED.
**Herramienta:** `scripts/catalog-image-provenance.mjs` (solo lectura, sin red, 3 pruebas en CI). **Datos:** catálogo público de producción leído por GET el 18-11-2026 (125 perfumes, todos `estado=publicado`). **Evidencia:** `docs/intelligence/visual/evidence/catalog-image-provenance-2026-11-18.csv`.

## Hallazgos

| Categoría de host (señal) | Perfumes | Observación |
|---|---:|---|
| `amazon` (`m.media-amazon.com`) | 38 | Imágenes del propio canal de afiliación; su uso depende de las condiciones del programa de Amazon, a verificar por el Publisher |
| `fragrantica_cdn` (`fimgs.net`) | **44** | CDN de un sitio editorial de terceros. Mayor volumen y mayor incertidumbre de permisos |
| `other_third_party` | 37 | ~35 hosts distintos: sitios de marcas y minoristas (Notino, Douglas, Sephora, Diptyque, Xerjoff…) y tiendas pequeñas o regionales |
| `generic_cdn_or_storage` | 5 | Almacenamiento/CDN genérico (S3, CloudFront, Shopify, Scayle, ATG): **no se puede saber de quién es la imagen** por el host |
| `ugc_marketplace` | 1 | `chance-eau-tendre`: foto alojada en un marketplace de anuncios de usuarios (`mercdn.net`) |
| **Total** | **125** | 125/125 son imágenes remotas; **0 activos locales**; 0 URL `http` inseguras; 0 faltantes; 0 URL inválidas |

Cruce con el monitor de calidad existente (`scripts/image-quality-monitor.mjs`, ejecutado sobre el catálogo vivo): sin imágenes compartidas entre perfumes distintos, sin conflicto entre nombre y concentración declarada, **1 señal** (`chance-eau-tendre`, concentración por verificar). Es la **misma ficha** que usa la foto del marketplace de usuarios: dos señales independientes sobre una sola referencia.

## Cómo se usan realmente

`apps/web/src/app/api/catalog-image/[slug]/route.ts` **descarga la imagen en el servidor y la sirve desde el dominio de Aromia** (orden: packshot de página oficial de la marca → `imagen_url` del catálogo → Amazon → marcador de posición), con caché pública de 7 días (`s-maxage=604800`) y 30 de revalidación. No es un simple enlace en el navegador del lector: Aromia reproduce y redistribuye los bytes. Eso es relevante para cualquier revisión de derechos y no depende de quién sea el titular.

## Qué NO dice este inventario

- No prueba que cada imagen muestre el producto, variante, concentración o edición correctos (política de `PRODUCT-IDENTITY-FIDELITY.md`: 8 observaciones + verificación independiente). **0 de 125 tienen identidad, derechos o calidad verificadas** (monitor: `identityVerified/rightsVerified/visuallyApproved = 0`).
- No conclusión legal: un host «de riesgo» no implica infracción, ni uno «de marca» implica permiso.
- No se descargaron los bytes: disponibilidad y contenido actuales de cada URL siguen sin verificar.
- No cambia nada del catálogo, del código de servicio de imágenes ni de ninguna imagen. **Nada se sustituyó ni se aprobó.**

## Decisiones que son del Publisher

1. **Política de procedencia:** qué categorías son aceptables para servirse desde Aromia (p. ej. packshot de fabricante licenciado, foto propia, Amazon dentro de las condiciones del programa) y cuáles no (p. ej. CDN de terceros editoriales, marketplaces de usuarios, almacenamiento genérico).
2. **Orden de revisión sugerido por riesgo:** 1 `ugc_marketplace` → 5 `generic_cdn_or_storage` → 44 `fragrantica_cdn` → 37 `other_third_party` → 38 `amazon`.
3. **Qué hacer con lo rechazado:** sustituir por fuente aprobada (propia, de fabricante con licencia, o marcador explícito de «imagen no disponible» ya soportado por la ruta). Cualquier sustitución exige el procedimiento supervisado (`REPLACEMENT-DRY-RUN.md`) y respaldo reversible.
4. La ruta de servicio tiene un tratamiento especial para `fimgs.net` (tarjeta social); si la política lo excluye, es un cambio de código que requiere tu aprobación explícita antes de tocarlo.

## Reproducir

```powershell
node scripts/catalog-image-provenance.mjs catalogo.json          # resumen JSON
node scripts/catalog-image-provenance.mjs catalogo.json --csv    # una fila por perfume
```
`catalogo.json` es la respuesta de `GET /api/perfumes?limit=1000` (guardada fuera del repo).
