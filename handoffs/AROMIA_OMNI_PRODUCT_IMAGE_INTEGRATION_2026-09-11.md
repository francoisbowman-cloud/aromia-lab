# Handoff — integrar OMNI al pipeline real de imágenes de producto durante la reestructuración de Aromia

**Fecha:** 2026-09-11  
**Actor de origen:** ChatGPT / Publisher  
**Actor siguiente:** Code  
**Scope:** producto visual / catálogo / Design / OMNI  
**No toca producción directamente.**

## 1. Hallazgo verificado

Cruce realizado contra:

- `main`
- commit desplegado en Railway: `8795931acfd37e9be40b748127525232d6ff6d0e`
- servicio web de producción de `aromia-lab-v2`
- tráfico HTTP real de `aromialab.com`

Resultado:

- las imágenes de perfume que hoy ve el lector **no son assets procesados por OMNI**;
- `ProductImage.tsx` está preparado para preferir cutouts locales;
- pero `PERFUME_CUTOUTS` sigue vacío;
- por tanto el sitio cae al fallback `/api/catalog-image/<slug>`;
- ese endpoint resuelve packshot oficial cuando existe, luego `imagen_url` del catálogo, luego Amazon y por último placeholder;
- el acabado actual se consigue principalmente mediante `object-contain`, `mix-blend` y máscara radial CSS.

Esto significa que OMNI hoy gobierna y audita la política de imagen, pero **no está produciendo el asset final que se integra en la composición**.

## 2. Infraestructura existente que NO debe duplicarse

Ya existe la base correcta en el repo:

- `apps/web/src/components/perfume/ProductImage.tsx`
- `apps/web/src/lib/perfumeCutouts.ts`
- `docs/images/CUTOUT-PILOT-PLAN.md`
- regla `catalog_product_must_prefer_cutout` dentro de `scripts/omni-strict-audit.mjs`

El pipeline previsto ya está documentado:

```
source image
  -> remove_background
  -> autotrim
  -> resize
  -> WebP con alfa
  -> public/perfumes/cutouts/<slug>.webp
  -> registro en PERFUME_CUTOUTS
  -> ProductImage cutout-first
```

No crear un sistema paralelo.

## 3. Nueva instrucción para la reestructuración activa

Incorporar este frente al trabajo de Design / reestructuración visual que Code ya está ejecutando.

La meta no es simplemente “quitar fondos”.

La meta es que los perfumes funcionen como **objetos editoriales propios de Aromia**, listos para entrar en composiciones más expresivas sin depender de esconder una fotografía comercial mediante CSS.

Separación de responsabilidades:

- **Design:** decide cómo debe entrar el objeto en la composición.
- **OMNI / Image Toolkit:** procesa, normaliza, valida y deja evidencia del asset.
- **Code:** integra el asset versionado y garantiza fallback, responsive, accesibilidad y performance.

## 4. No procesar los 125 perfumes a ciegas

Primero ejecutar un piloto representativo de **8–12 perfumes**.

El piloto debe cubrir como mínimo:

1. frasco oscuro/opaco;
2. vidrio transparente;
3. vidrio translúcido de color;
4. líquido ámbar/rojo;
5. tapa cromada o reflectante;
6. geometría irregular;
7. etiqueta de papel;
8. fuente que incluya caja/packaging;
9. packshot limpio de marca;
10. fuente Amazon difícil.

Puede reutilizarse la selección de `CUTOUT-PILOT-PLAN.md`, ajustándola a los slugs actualmente publicados.

## 5. Resultado requerido por cada perfume piloto

Cada caso debe terminar clasificado como uno de estos estados:

### A — AUTO_CLEAN
El recorte automático conserva correctamente:

- geometría;
- vidrio;
- líquido;
- tapa;
- etiqueta;
- grabados;
- color;
- transparencia;
- reflejos esenciales.

Puede integrarse.

### B — AUTO_NEEDS_REMEDIATION
El producto sigue fiel, pero necesita una operación adicional determinística:

- limpieza de halo;
- autotrim;
- padding;
- corrección de borde;
- resize;
- conversión;
- tratamiento de transparencia.

No usar IA si puede resolverse sin reinterpretar el producto.

### C — SOURCE_PROBLEM
La fuente contiene problemas como:

- caja;
- composición retail;
- manos;
- props;
- fondo complejo;
- producto parcialmente oculto.

Antes de generar nada, intentar conseguir una fuente mejor oficial o verificable.

### D — MANUAL / GENERATIVE_EXCEPTION
Solo si no existe una fuente suficientemente utilizable.

Cualquier generación o reconstrucción debe requerir gate explícito y mantener la regla dura:

> **no inventar ningún rasgo real del frasco.**

No alterar logo, forma, material, proporción, tapa, etiqueta, grabados o color real.

## 6. QA visual obligatorio

El piloto debe verse en una preview de Railway antes de escalar.

Verificar:

- Home cuando use producto;
- PDP / `/catalogo/[slug]`;
- Discovery;
- cualquier nueva composición de Design que incluya packshots;
- desktop;
- tablet;
- mobile;
- claro;
- oscuro.

Evaluar especialmente:

- halo;
- bordes de vidrio;
- pérdida de transparencia;
- color incorrecto del líquido;
- cromados;
- sombras;
- sensación de pegatina;
- escala óptica;
- relación con fondo;
- consistencia entre marcas.

No aceptar un recorte simplemente porque “el fondo desapareció”.

## 7. Regla de integración

Mientras el piloto no esté aprobado:

- mantener `/api/catalog-image` intacto;
- mantener fallback actual;
- no migrar los 125;
- no eliminar la máscara CSS global prematuramente.

Después de aprobación:

- registrar únicamente los cutouts aprobados;
- `ProductImage` los usará automáticamente;
- el fallback seguirá existiendo para el resto;
- escalar por lotes auditables;
- retirar compensaciones CSS solo cuando la cobertura y QA lo justifiquen.

## 8. Trazabilidad mínima por asset

Cada asset aprobado debería poder responder:

- slug;
- fuente original;
- origen de la fuente;
- operación aplicada;
- dimensiones originales;
- dimensiones finales;
- formato;
- hash SHA-256;
- estado de QA;
- fecha;
- si hubo intervención generativa o no.

No hace falta inventar una plataforma nueva si esta evidencia puede vivir de forma simple y versionable.

## 9. Relación con Design

Este workstream debe acompañar la nueva dirección editorial, no condicionarla.

Design puede proponer:

- producto sobre blanco;
- producto sobre negro;
- producto superpuesto a tipografía;
- escalas monumentales;
- composiciones asimétricas;
- objeto aislado con mucho aire;
- pares o secuencias de frascos.

Code debe poder responder con assets limpios y fiables, en vez de pedir que Design adapte su composición al fondo de Amazon.

La regla objetivo es:

> **Design compone el objeto; OMNI prepara y gobierna el objeto; Code lo entrega.**

## 10. Definition of Done del piloto

El frente puede escalar a catálogo completo solo cuando:

- [ ] 8–12 casos representativos procesados;
- [ ] cada uno clasificado A/B/C/D;
- [ ] assets aprobados versionados;
- [ ] hashes y procedencia registrados;
- [ ] `PERFUME_CUTOUTS` contiene únicamente aprobados;
- [ ] preview de Railway verificada;
- [ ] claro/oscuro + mobile/desktop aprobados;
- [ ] cero alteraciones de identidad de producto;
- [ ] `omni-strict-audit` PASS;
- [ ] fallback intacto;
- [ ] no regresión de performance significativa;
- [ ] Publisher sign-off para escalar.

## 11. Escalado posterior

Una vez aprobado el piloto:

1. inventariar los perfumes publicados;
2. agruparlos por dificultad;
3. procesar por lotes;
4. QA automático + muestra visual humana;
5. registrar aprobados;
6. desplegar por lotes;
7. verificar producción;
8. solo entonces reducir progresivamente el tratamiento CSS de fallback.

No hacer un “big bang” de los 125.

## 12. Encaje con el trabajo activo de Code

Este handoff debe incorporarse al workstream actual de reestructuración / Design.

No bloquea el cierre documental de D-7 ni el PR de estado actualmente abierto.

Code debe absorberlo como siguiente frente ejecutable del sistema visual, reutilizando el trabajo de PR #117 en vez de reconstruirlo.

**Prioridad:** después de estabilizar el trabajo visual actualmente en curso, pero antes de considerar cerrada la reestructuración de producto visual de Aromia.

---

## Criterio final

Aromia no debería terminar la reestructuración mostrando “fotos comerciales bien disimuladas con CSS” como solución permanente.

Debe poder trabajar con un activo de producto propio, fiel y gobernado:

```
fuente auténtica
    -> OMNI / Image Toolkit
    -> asset aprobado
    -> renderer de Aromia
    -> composición de Design
```

Sin perder autenticidad del producto y sin convertir el sistema en una máquina de reprocesamiento innecesaria.
