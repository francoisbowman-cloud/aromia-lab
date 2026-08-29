# Recortes sin fondo — plan de piloto (decisión #105)

**Contexto.** Con el pivote a revista editorial (decisión #103) el perfume deja
de mostrarse como foto hotlinkeada con máscara CSS y pasa a un **recorte con
canal alfa** (PNG/WebP sin fondo) que se puede componer libremente. Brey
autorizó además **sustituir por imagen generada por IA de alto detalle** los
frascos que el recorte automático no resuelve, con la regla dura de **no
inventar ningún rasgo del frasco** (forma, color, tapa, grabados, etiqueta,
proporción, material). Catálogo real: **125 perfumes**.

## Pipeline técnico (verificado a mano el 2026-08-29)

Herramientas OMNI (MCP `image-toolkit`, infra propia en Railway, sin costo por
operación reportado para el recorte):

```
remove_background(input_path = <imagen_url>, post_process = true)
  → autotrim_image(padding = 12)            # recorta al contenido, opcional
  → resize_image(width = 620, mode = "fit")
  → convert_image(format = "webp", quality = 82)
  → get_result_base64(...)                  # ~14 KB, cabe en el límite del harness
```

Salida → `apps/web/public/perfumes/cutouts/<slug>.webp`
Registro → agregar el `<slug>` a `PERFUME_CUTOUTS` en
`apps/web/src/lib/perfumeCutouts.ts`.
`ProductImage.tsx` ya es **cutout-first**: si el slug está en el registro usa el
WebP con `drop-shadow()`, sin máscara ni `mix-blend`; si no, cae al tratamiento
Opción A actual. Con el registro vacío el comportamiento del sitio es idéntico
al de hoy.

## Casos observados en las 2 pruebas manuales

| Perfume | Resultado del recorte automático |
|---|---|
| `bleu-de-chanel-edp` | ✅ limpio, frasco solo, sin caja — apto directo |
| `1-million` | ⚠️ la foto de Amazon trae **frasco + caja** → el recorte deja las dos flotando |

## Piloto propuesto — ~10 perfumes, cubriendo los tipos difíciles

1. Frasco opaco con logo grabado — `bleu-de-chanel-edp` (ya probado, ok)
2. Frasco dorado sólido — `1-million` (**tiene caja** → probar recorte solo-frasco / IA)
3. Vidrio azul translúcido — `acqua-di-gio-edt`
4. Vidrio transparente + líquido claro — a elegir (ej. un cítrico)
5. Líquido de color intenso (rojo/ámbar) — `baccarat-rouge-540`
6. Tapa cromada / espejada — a elegir
7. Frasco negro mate — `oud-wood` o `black-opium`
8. Frasco con forma irregular / no rectangular — a elegir
9. Foto sobre fondo no-blanco (lifestyle) — revisar inventario
10. Frasco de nicho con etiqueta de papel — a elegir

Para cada uno: correr el pipeline, guardar el WebP, registrar el slug, y
**deploy a una preview de Railway** para que Brey valide en vivo (Home + Ficha,
claro y oscuro). Recién ahí se decide procesar los 125.

## Gates pendientes (antes de escalar)

- [ ] **Cajas** — criterio de Code: la caja es lenguaje de retail, no de revista
      → los perfumes cuya foto trae caja entran al bucket "difícil" (recorte
      solo-frasco o IA). Confirmar con Brey en el piloto.
- [ ] **Generación IA** — `remove_background` es gratis; la **imagen IA de alto
      detalle** para los frascos difíciles usa un modelo generativo pago →
      requiere que Brey apruebe **monto y modelo** (gate de la decisión #18).
      No se corre ninguna generación IA hasta eso.
- [ ] **Peso** — 125 WebP con alfa @ ~620px ≈ 1.5–2 MB en total; encaja en el
      presupuesto de `IMAGE-ARCHITECTURE.md`. Confirmar al cerrar el piloto.
- [ ] **`next/image`** — evaluar si los cutouts (assets locales, dimensiones
      conocidas) permiten por fin migrar `ProductImage` a `next/image` (hoy
      bloqueado por el hotlink; ver hallazgo de PR #6).

## Qué NO cambia

- `/api/catalog-image` y `/api/catalog-buy` siguen igual (fallback + botón de compra).
- La `imagen_url` en Postgres no se toca — el recorte es determinístico a partir
  de ella y vive como asset versionado, sin migración de DB (decisión #93).
- El guard anti-extracción-en-runtime del `omni-strict-audit` sigue vigente: el
  recorte es 100% offline.
