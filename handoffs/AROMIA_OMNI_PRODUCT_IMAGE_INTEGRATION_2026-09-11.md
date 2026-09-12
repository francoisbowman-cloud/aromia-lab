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


## 13. Addendum Publisher — hallazgos visuales observados en la experiencia actual

Las siguientes observaciones se añaden al handoff después de revisar la experiencia publicada en light/dark y varias superficies editoriales. Forman parte de la misma reestructuración; **no abrir un sistema paralelo**.

### 13.1 Light / dark: el asset debe sobrevivir al cambio de fondo

Hallazgo visible: algunos packshots parecen integrados en light porque el fondo blanco de la fuente se confunde con el lienzo. En dark aparece el rectángulo blanco completo y se rompe la armonía.

Esto confirma que el criterio de éxito del pipeline OMNI no puede ser solo “se eliminó el fondo”.

Añadir gate explícito:

- cada cutout aprobado debe probarse sobre blanco puro y sobre el fondo dark real de Aromia;
- no debe aparecer caja blanca, halo, matte, borde lechoso ni contaminación del fondo original;
- vidrio, transparencias y reflejos deben conservarse sin parecer recortados a mano;
- el mismo asset debe funcionar sin una corrección CSS específica para cada modo;
- si un asset solo funciona en light o solo en dark, todavía no está aprobado.

Objetivo:

> **un único objeto fiel que pertenezca a Aromia en ambos temas, no una foto comercial disimulada por el fondo.**

---

## 14. Historias — convertir el archivo en una superficie editorial con ritmo

Hallazgo: la superficie de Historias es limpia, pero actualmente muchas entradas se presentan con peso muy parecido: título + título + título. El resultado puede sentirse plano aunque la tipografía sea correcta.

Design debe revisar esta superficie como **archivo editorial**, no como listado de cards.

Objetivos:

- preservar sobriedad y facilidad de exploración;
- introducir jerarquía real entre historias;
- variar escala, densidad, aire y presencia visual;
- permitir que algunas piezas tengan imagen, otras sean tipográficas y otras funcionen como pausas;
- utilizar únicamente visuales con relación editorial real con la historia;
- evitar convertir todas las entradas en cards o miniaturas uniformes;
- crear ritmo de revista sin dificultar el escaneo.

La composición debe poder comunicar qué historia merece atención ahora, qué piezas acompañan y dónde descansa el ojo.

---

## 15. Fragancias — evolucionar de índice tipográfico a índice editorial de objetos

Hallazgo: el índice de Fragancias es elegante y limpio, pero al presentar esencialmente nombres puede sentirse demasiado próximo a una base de datos tipográfica.

No convertirlo en un catálogo ecommerce.

Design debe explorar una presencia visual **selectiva y editorial** de los frascos, apoyándose en los cutouts aprobados por OMNI.

Objetivos:

- que al encontrar “Good Girl”, “Aventus”, etc. exista suficiente señal visual para anticipar el objeto al que se va a entrar;
- conservar el protagonismo del nombre y la navegación;
- usar miniaturas, apariciones, hover/reveal, cambios de escala o composición solo donde mejoren reconocimiento y deseo de exploración;
- evitar una cuadrícula uniforme de producto;
- no introducir precio, badges de venta ni lenguaje de tienda;
- mobile debe recibir una reinterpretación propia y no depender de hover.

La regla es:

> **dar presencia al objeto sin convertir el índice en un shop grid.**

---

## 16. PDP / “Dónde encontrarlo” — comercio como servicio secundario

Mantener por ahora el módulo de afiliación sin precio fijo de Amazon.

Razones:

- la identidad principal de Aromia sigue siendo editorial;
- el precio de Amazon puede variar con rapidez;
- no mostrar un valor que Aromia no pueda verificar de forma fiable y actual;
- el CTA afiliado ya permite al lector consultar disponibilidad y precio actual.

Por tanto:

- mantener “Ver en Amazon” / equivalente como salida contextual;
- Design puede mejorar la composición y el contexto del módulo;
- no convertirlo en bloque de ecommerce dominante;
- no mostrar un precio estático guardado manualmente.

Un precio solo debería incorporarse en el futuro si existe una fuente en vivo suficientemente fiable, con moneda, timestamp/frescura y fallback claros.

---

## 17. Portada — pasar de landing estática a publicación viva

Hallazgo: la portada actual tiene identidad y calidad, pero el mismo protagonista puede permanecer siempre en el primer impacto. Para una revista viva, la portada debe poder cambiar de edición sin perder su marco visual.

Implementar una **lógica editorial controlada de portada**, no un carrusel aleatorio.

Debe permitir:

- lead story;
- supporting stories;
- visual principal;
- contexto de edición/issue cuando corresponda;
- promoción de Historias, Saber, Personas, Materia u otros territorios según criterio editorial.

Reglas:

- no cambiar aleatoriamente en cada refresh;
- evitar comportamiento de banner publicitario;
- la rotación debe venir de selección editorial, estado/fecha o una configuración explícita;
- el lector puede volver horas o días después y encontrar una edición distinta cuando realmente haya cambiado la selección;
- la identidad visual, navegación y orientación deben permanecer estables;
- SEO/SSR no debe depender de aleatoriedad client-side.

Objetivo:

> **que Aromia tenga una portada que edita, no una landing que permanece congelada.**

---

## 18. Saber — dirección visual de materiales con estándar editorial alto

Hallazgo: algunas imágenes actuales de la sección Saber cumplen una función nominal, pero no alcanzan todavía el nivel de presentación de la publicación. Casos señalados por Publisher: bergamota, limón/cítricos, incienso, salvia sclarea y pachulí.

La imagen de Saber debe enseñar además de decorar.

### Criterio de selección

Prioridad:

1. fotografía documental o botánica real, de calidad editorial y licencia válida;
2. fuente institucional/archivo fiable cuando sea pertinente;
3. generación asistida por IA **solo cuando no exista una fuente adecuada o la pieza requiera una interpretación controlada**.

Si se usa IA:

- debe conservar morfología real del material;
- no inventar flores, hojas, resinas, frutos o formas botánicas;
- evitar perfección plástica, brillo artificial, simetría excesiva y “AI look”;
- preferir iluminación, textura, imperfecciones y contexto plausibles;
- la imagen debe ser reconocible por sí misma, no depender del rótulo para que el lector entienda qué está viendo;
- debe pasar revisión visual antes de publicación.

Especialmente en materiales como incienso, la representación debe dejar claro **qué se está enseñando**: resina, materia prima, humo/ritual o árbol, según el contenido de la pieza. No usar una imagen ambigua solo porque resulte atmosférica.

Objetivo:

> **la mejor presentación creíble del material, no la versión más bonita ni la más artificial.**

---

## 19. Guías deben pertenecer a Saber

Decisión editorial de Publisher:

> **Guías pasa a formar parte del territorio Saber.**

Racional:

- **Historias** = relatos, cultura, acontecimientos, personajes, observaciones y piezas narrativas;
- **Saber** = aprendizaje, técnica, materiales, criterio olfativo y enseñanza;
- las **Guías** son contenido pedagógico y por tanto pertenecen naturalmente a Saber.

Code + Design deben revisar:

- navegación principal;
- landing de Saber;
- taxonomía/categorías;
- enlaces internos;
- breadcrumbs;
- sitemap;
- SEO/canonical;
- analytics;
- filtros y búsqueda;
- links existentes desde artículos y Home.

No romper URLs existentes de forma innecesaria. Si la arquitectura requiere mover rutas, establecer redirects/canonicals seguros y verificar enlaces antes de retirar cualquier ruta anterior.

Design debe hacer visible dentro de Saber que existen distintas formas de aprender —por ejemplo materiales, técnica, guías y piezas explicativas— sin convertirlo en un dashboard de cards.

Objetivo de producto:

> **Saber debe sentirse como el lugar donde Aromia enseña a oler.**

---

## 20. Principio transversal para Design + Code

Estas observaciones no piden rehacer Aromia desde cero.

La experiencia actual ya tiene identidad, humanidad y una dirección editorial reconocible. La reestructuración debe **elevar lo que ya funciona** y corregir los puntos donde la implementación todavía revela su origen técnico/comercial.

Orden sugerido:

1. estabilizar workstream visual actualmente abierto;
2. activar piloto real OMNI de producto;
3. convertir light/dark en gate del asset;
4. resolver dirección de Historias / Fragancias / Saber / Portada en Design;
5. ajustar la arquitectura de Guías dentro de Saber;
6. validar PDP commerce treatment;
7. QA conjunto en preview;
8. extraer solo los patrones que hayan demostrado ser recurrentes.

No institucionalizar docenas de componentes o variantes antes de que Design demuestre qué necesita la experiencia.

### Definition of Done adicional

Antes de considerar cerrada esta parte de la reestructuración:

- [ ] un perfume aprobado no revela fondo heredado al cambiar light/dark;
- [ ] Historias tiene ritmo y jerarquía, no una lista visualmente plana;
- [ ] Fragancias ofrece reconocimiento visual selectivo sin convertirse en ecommerce;
- [ ] “Dónde encontrarlo” sigue siendo secundario y no muestra precio no verificable;
- [ ] la portada admite edición/rotación editorial controlada;
- [ ] Saber usa imágenes de materiales claras, creíbles y con calidad de publicación;
- [ ] Guías está integrada editorialmente en Saber;
- [ ] navegación, SEO, analytics y enlaces siguen coherentes tras esa integración;
- [ ] todo lo anterior pasa responsive + a11y + dark/light + performance QA.

---

## Cierre actualizado

La dirección común queda así:

> **Aromia ya tiene identidad. La siguiente evolución no consiste en añadir más decoración, sino en hacer que cada superficie se comporte como parte de una publicación viva: objetos bien producidos, archivos con ritmo, aprendizaje visualmente riguroso, comercio subordinado y una portada que realmente edita.**
