# Checklist de Coherencia de Diseño — Aromia

Paso de verificación final para cualquier tarea de diseño/frontend en
Aromia (Next.js + Express + Postgres, producción en Railway —
aromialab.com). No reemplaza el trabajo de estabilización en sí; es el
checklist que confirma que ese trabajo quedó bien cerrado. Entregado por
Brey el 23/07.

Este checklist no define identidad visual, tono ni principios de marca
de Aromia — eso vive en `ESTADO-aromia.md` y en las decisiones ya
tomadas (paleta, tipografía, filosofía editorial de Magazine).

## 1. Cobertura completa (no auditar de memoria)

Antes de revisar nada, generar la lista completa y real de
páginas/componentes de Aromia (desde el código/rutas, no de memoria):

- Home
- Catálogo (38 perfumes — ruta actual `/perfumes`, pendiente de pasar a
  `/catalogo` con redirect permanente)
- Página de Producto (individual, por perfume)
- Magazine (hub editorial + vista de lectura con hojeo/PDF) — incluye
  `/articulos` → `/magazine`
- Academia (pendiente de restaurar como página propia, separada de
  Magazine)
- Sobre Aromia / Nosotros
- Contacto

Auditar contra esta lista, no contra "las pantallas que se recuerdan".

## 2. Checklist de diseño

- [ ] Tokens: cero colores/tipografías/espaciados hardcodeados — todo
      referencia `tailwind.config.js` o las variables CSS de tokens
      (`--gold-500`, `--gold-300`, `--warm-white`, `--stone`,
      `--charcoal`, `--graphite`), nunca un hex nuevo escrito a mano. Si
      aparece un color que no está en la lista de tokens, se agrega
      como token nuevo, no como valor suelto.
- [ ] shadcn/ui como base: todo componente nuevo (tarjeta, botón,
      badge) se construye o migra sobre shadcn/ui, no sobre un sistema
      propio paralelo.
- [x] **Miniaturas de producto (actualizado 23/07):** recorte real vía
      detección de bounding-box en canvas (comparando el contenido
      contra el color de fondo de la foto), no un simple ajuste de
      `object-fit: contain`. Implementado de raíz en el componente
      compartido `PerfumeCard.tsx`, cubre Home/Catálogo/resultado del
      Quiz a la vez. Verificar que ninguna miniatura quede cortada ni
      escalada con el margen blanco que trae cada proveedor
      (Amazon/Notino/Douglas) en ninguna de las 38 fichas.
- [ ] Contraste texto-sobre-imagen: toda sección con foto de fondo
      (hero, Magazine, Academia) usa tratamiento para texto claro o
      scrim suficiente — nunca texto por defecto sin verificar.
- [ ] Estados cubiertos: hover, disabled, sin-stock/vacío, error — al
      menos los que apliquen a cada componente (ej. tarjeta de producto
      sin imagen real, resultado de búsqueda vacío en Catálogo).
- [ ] Consistencia entre pantallas: la misma tarjeta de producto no
      debería verse distinta entre Home, Catálogo y Magazine sin una
      razón explícita.

## 3. Assets/imágenes (Aromia depende de fuentes externas: Amazon, Notino, Douglas)

Pipeline fijo antes de dar por buena cualquier imagen de producto:

1. Tratamiento de fondo unificado (Amazon vs. Notino/Douglas traen
   fondos distintos — homogeneizar, no mezclar crudo)
2. Misma relación de aspecto en las 38 fichas del catálogo, sin
   excepción
3. Mismo criterio de recorte/composición entre las imágenes de Amazon y
   las de Notino/Douglas
4. Uso correcto y separado de las imágenes `OVL_Prompt_50` (mockups de
   botella sin logo) y del set sin fondo de Image Toolkit: solo para
   narrativa (Producto/Magazine/Academia), nunca en la tarjeta de
   producto del Catálogo

Por qué: fotos crudas de dos proveedores distintos rompen la coherencia
visual aunque el código de la tarjeta esté perfecto — es un problema de
datos, no de CSS.

## 4. Verificación de links de afiliado (específico de Aromia)

- [ ] Los 38 links de afiliado (tag `aromialab-20`) resuelven a
      producto real — no a 404 ni a resultado de búsqueda vacío
- [ ] El tag de afiliado está presente en los 38, sin excepción

## 5. Cierre: publicar y verificar en vivo, siempre

Ninguna tarea se marca como terminada sin:

1. Deploy confirmado en Railway (no solo build local o preview)
2. Abrir aromialab.com (o www.aromialab.com) real, en incógnito
3. Confirmar visualmente que el cambio se ve — en desktop y en mobile
   real
4. Recién ahí, cerrar la tarea y reportar: qué se corrigió, archivos
   modificados, cómo se verificó

Por qué: un cambio correcto en una rama sin deployar es, para quien
visita el sitio, indistinguible de que no se hizo nada.
