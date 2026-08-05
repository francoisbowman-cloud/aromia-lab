# AROMIA — MANUAL OPERATIVO PARA CODE, COWORK Y CHATGPT

**Versión:** 1.0  
**Fecha:** 4 de agosto de 2026  
**Proyecto:** Aromia Lab  
**Repositorio oficial:** `https://github.com/francoisbowman-cloud/aromia-lab`  
**Producción:** `https://aromialab.com`  
**Responsable final:** Francois Bowman

---

# 1. PROPÓSITO DE ESTE DOCUMENTO

Este documento establece cómo debe organizarse y ejecutarse el trabajo de Aromia usando tres herramientas principales:

- **Code** como ejecutor técnico y responsable del repositorio.
- **Cowork** como apoyo para investigación, inventarios, documentación y preparación de lotes.
- **ChatGPT** como director visual, generador/editor de imágenes, auditor creativo y asesor estratégico.

El objetivo es evitar:

- ramas permanentes creadas por herramienta;
- trabajo duplicado;
- cambios realizados sobre versiones obsoletas;
- imágenes inconsistentes;
- pérdida de trazabilidad;
- despliegues desde ramas no oficiales;
- contradicciones entre agentes;
- publicaciones automáticas sin revisión humana.

Aromia es un proyecto independiente dirigido por una sola persona y asistido por inteligencia artificial. Debe proyectar profesionalidad, criterio editorial y transparencia, sin aparentar una estructura empresarial ficticia.

---

# 2. PRINCIPIO CENTRAL DEL PROYECTO

## 2.1 Fuente única de verdad

`main` debe convertirse en la única fuente de verdad del proyecto.

Reglas obligatorias:

1. Railway debe desplegar exclusivamente desde `main`.
2. Ninguna rama distinta de `main` puede considerarse producción.
3. Toda nueva rama debe nacer desde `main`.
4. Toda rama de trabajo debe ser temporal.
5. Toda rama debe eliminarse después de su integración o descarte.
6. Ninguna herramienta puede mantener una rama permanente identificada por su nombre.

No se permiten como ramas permanentes:

- `Chatgpt-aromia`
- `Claude-aromia`
- `cowork-images`
- `qwen-fixes`
- `feature/v2.0`
- `design/ui-ux`
- `autopublish/*`

Las ramas deben nombrarse por objetivo:

```text
chore/consolidate-main
feat/image-pipeline
assets/catalog-batch-01
seo/structured-data
fix/product-image-fallbacks
```

---

# 3. RESPONSABILIDADES POR HERRAMIENTA

# 3.1 CODE — RESPONSABLE TÉCNICO PRINCIPAL

Code es el centro operativo del proyecto.

Debe encargarse de:

- Git y GitHub;
- ramas, commits, tags y pull requests;
- identificación de la rama desplegada en Railway;
- consolidación de producción en `main`;
- scripts;
- arquitectura;
- pruebas;
- integración de imágenes;
- validaciones;
- rendimiento;
- SEO técnico;
- accesibilidad;
- documentación operativa;
- despliegue;
- observabilidad;
- seguridad;
- limpieza de ramas.

Code no debe delegar su responsabilidad técnica principal.

## Code puede delegar cuando:

- falten fuentes o datos de investigación;
- se necesite un inventario amplio;
- se requiera preparar un lote de perfumes;
- sea necesario crear o editar imágenes;
- se necesite evaluar visualmente una composición;
- se necesite redactar o revisar narrativa editorial;
- se requiera una decisión estratégica o de dirección artística.

---

# 3.2 COWORK — PREPARACIÓN, INVESTIGACIÓN Y ORGANIZACIÓN

Cowork debe utilizarse para tareas intensivas de información y organización que no requieren modificar directamente el repositorio.

Debe encargarse de:

- inventarios;
- clasificación de archivos;
- recopilación de fuentes;
- tablas de control;
- validación documental;
- preparación de lotes;
- documentación;
- briefs;
- reportes;
- matrices de seguimiento;
- comparación de datos;
- registro de procedencia;
- organización de referencias.

Cowork no debe:

- controlar la rama de producción;
- fusionar ramas;
- modificar Railway;
- decidir arquitectura;
- aprobar imágenes;
- publicar directamente en `main`;
- trabajar sobre una copia del repositorio sin confirmar su vigencia.

## Formato esperado de entrega de Cowork

```text
batch-01/
├── batch-manifest.csv
├── source-references/
├── visual-briefs/
├── product-data/
├── licensing-notes/
├── prompts/
└── acceptance-checklist.md
```

---

# 3.3 CHATGPT — DIRECCIÓN VISUAL Y AUDITORÍA CREATIVA

ChatGPT debe utilizarse como:

- director de arte;
- generador de imágenes editoriales;
- editor visual;
- auditor de coherencia;
- revisor de calidad;
- creador de prompts;
- asesor de posicionamiento;
- revisor de textos estratégicos.

ChatGPT debe encargarse de:

- evaluar imágenes;
- clasificar calidad visual;
- crear conceptos editoriales;
- generar imágenes;
- editar fondos;
- extender lienzos;
- armonizar composiciones;
- detectar señales visuales de IA;
- comprobar coherencia con Aromia;
- crear variantes visuales;
- recomendar aprobación o rechazo.

ChatGPT no debe:

- asumir que una imagen generada representa fielmente un perfume real;
- aprobar automáticamente un frasco alterado;
- modificar el repositorio sin control de Code;
- decidir la fuente de verdad Git;
- publicar directamente;
- sustituir revisión humana.

---

# 4. MATRIZ DE DELEGACIÓN

| Tipo de tarea | Responsable principal | Delegar a |
|---|---|---|
| Ramas, Git, merge, tags | Code | Nadie |
| Railway y deploy | Code | Nadie |
| Scripts de imágenes | Code | ChatGPT para criterios |
| Inventario de imágenes | Cowork | Code para integración |
| Investigación de perfumes | Cowork | ChatGPT para síntesis |
| Dirección de arte | ChatGPT | Cowork para fuentes |
| Generación de imágenes | ChatGPT | Code para publicación |
| Validación visual | ChatGPT + Francois | Code para controles técnicos |
| SEO técnico | Code | ChatGPT para estrategia |
| SEO editorial | ChatGPT | Cowork para investigación |
| Modelo de datos | Code | Cowork para limpieza |
| Auditoría de fuentes | Cowork | ChatGPT para interpretación |
| Textos institucionales | ChatGPT | Francois para aprobación |
| QA final | Code + Francois | ChatGPT para revisión visual |
| Documentación de procesos | Code | Cowork para consolidación |

---

# 5. FASE 0 — CONSOLIDACIÓN DE GIT Y RAILWAY

Esta fase es bloqueante. Ningún trabajo masivo de imágenes debe empezar antes de completarla.

## Objetivo

- identificar la rama y commit exactos desplegados en Railway;
- convertir `main` en la única fuente de verdad;
- eliminar ramas obsoletas;
- proteger `main`;
- documentar el flujo.

## Instrucciones para Code

### 5.1 Verificar Railway

Confirmar:

- repositorio conectado;
- rama configurada;
- commit desplegado;
- root directory;
- comando de build;
- comando de inicio;
- variables;
- servicios asociados;
- dominio;
- historial de despliegues.

Registrar todo en:

```text
docs/DEPLOYMENT.md
```

### 5.2 Crear respaldo

Antes de fusionar:

```bash
git tag -a production-before-main-consolidation-2026-08-04 <SHA_PRODUCCION> \
  -m "Producción de Aromia antes de consolidar main"

git push origin production-before-main-consolidation-2026-08-04
```

Crear también una rama temporal:

```bash
git branch backup/production-2026-08-04 <SHA_PRODUCCION>
git push origin backup/production-2026-08-04
```

### 5.3 Comparar producción contra `main`

```bash
git diff main...<rama-produccion>
git log --left-right --graph --oneline main...<rama-produccion>
```

Revisar:

- archivos exclusivos;
- configuración;
- scripts;
- variables referenciadas;
- contenido;
- rutas;
- documentación;
- migraciones;
- secretos;
- código obsoleto.

### 5.4 Preparar consolidación

Preferencia:

```bash
git checkout <rama-produccion>
git checkout -b chore/consolidate-production-into-main
git push -u origin chore/consolidate-production-into-main
```

Abrir PR hacia `main`.

No hacer una fusión ciega.

### 5.5 Validar antes de cambiar producción

Comprobar:

- home;
- catálogo;
- 50 perfumes;
- fichas;
- Magazine;
- Academia;
- Quiz;
- formularios;
- sitemap;
- robots;
- enlaces afiliados;
- imágenes;
- rutas;
- 404;
- logs.

### 5.6 Cambiar Railway

Railway debe desplegar exclusivamente desde `main`.

### 5.7 Proteger `main`

Activar:

- pull request obligatorio;
- checks obligatorios;
- bloqueo de force push;
- bloqueo de eliminación;
- resolución de conversaciones;
- eliminación automática de ramas después del merge.

### 5.8 Limpiar ramas

Para cada rama:

```bash
git log main..<rama> --oneline
git diff --stat main...<rama>
```

Si no contiene trabajo útil exclusivo:

```bash
git push origin --delete <rama>
```

Conservar tags de versiones.

### Criterio de salida

Cualquier persona o agente debe poder responder:

- qué commit está en producción;
- desde qué rama;
- cómo se despliega;
- cómo se revierte;
- cuál es la fuente de verdad.

---

# 6. IDENTIDAD EDITORIAL DE AROMIA

Aromia no debe fingir ser una gran redacción.

Debe presentarse como:

> Una publicación independiente de perfumería, dirigida por Francois Bowman y desarrollada con apoyo de herramientas de inteligencia artificial.

## Posicionamiento recomendado

> Perfumería explicada con criterio.

> Una guía independiente para descubrir, comprender y comparar perfumes.

## Evitar

- “La plataforma más respetada del mundo hispanohablante”.
- “La autoridad definitiva”.
- “La mejor guía del mundo”.
- cualquier afirmación no demostrable.

## Páginas necesarias

- Sobre Aromia;
- Metodología;
- Política editorial;
- Uso de inteligencia artificial;
- Política de correcciones;
- Contacto;
- Disclosure de afiliados;
- Términos;
- Privacidad.

## Transparencia sobre IA

Texto base:

> Aromia utiliza herramientas de inteligencia artificial como apoyo para investigación, estructuración, edición y procesos técnicos. La selección de temas, las conclusiones editoriales, la verificación de datos y la publicación final permanecen bajo responsabilidad humana.

---

# 7. SISTEMA DE IMÁGENES DE AROMIA

# 7.1 Objetivo

Transformar las imágenes actuales en una biblioteca:

- coherente;
- optimizada;
- documentada;
- legalmente trazable;
- lista para producción;
- reconocible como Aromia.

# 7.2 Dos familias visuales

## Imagen de catálogo

Uso:

- tarjetas;
- comparador;
- recomendaciones;
- búsqueda;
- favoritos.

Reglas:

- frasco completo;
- fondo uniforme;
- proporción constante;
- iluminación suave;
- sombra controlada;
- sin ingredientes;
- sin logos de retailers;
- sin decoraciones;
- sin recortes agresivos.

## Imagen editorial

Uso:

- hero;
- Magazine;
- home;
- redes;
- perfumes destacados.

Reglas:

- narrativa visual;
- iluminación cinematográfica;
- composición de lujo;
- notas representadas;
- espacio negativo;
- producto fiel;
- sin reinterpretar el envase.

---

# 8. INVENTARIO DE IMÁGENES

Cowork debe preparar:

```text
data/image-inventory.csv
```

Campos:

```text
perfume_slug
perfume_name
brand
image_role
source_url
source_domain
local_file
license_status
original_width
original_height
aspect_ratio
background_type
product_crop
visual_quality
needs_processing
processing_status
final_file
reviewed_by
review_date
notes
```

## Roles

- `catalog-primary`
- `catalog-secondary`
- `editorial-hero`
- `article-inline`
- `social`
- `ingredient`
- `brand`
- `placeholder`

## Licencia

- `official-brand`
- `affiliate-approved`
- `licensed`
- `generated`
- `unknown`
- `replace-required`

Toda imagen `unknown` debe considerarse temporal.

---

# 9. CUÁNDO CODE DEBE DELEGAR A COWORK

Code debe delegar a Cowork cuando:

1. falte un inventario completo;
2. haya que revisar decenas de archivos;
3. sea necesario recopilar fuentes;
4. haya que organizar datos de perfumes;
5. se necesite validar procedencia;
6. haya que preparar un lote;
7. se necesite consolidar documentación;
8. exista una tarea repetitiva de clasificación;
9. se requiera comparar información entre fuentes;
10. se necesite preparar un brief estructurado.

## Prompt base para Cowork

```text
Prepara el lote [NOMBRE DEL LOTE] para Aromia.

Objetivo:
[OBJETIVO]

Entrega:
- manifest.csv
- fuentes
- estado de licencia
- datos del perfume
- referencias visuales
- brief por perfume
- problemas detectados
- checklist de aceptación

No modifiques el repositorio.
No publiques.
No inventes datos.
Registra la fuente y fecha de cada dato.
```

---

# 10. CUÁNDO CODE DEBE DELEGAR A CHATGPT

Code debe delegar a ChatGPT cuando:

1. una imagen necesite evaluación visual;
2. haya que crear una imagen editorial;
3. se necesite limpiar o extender una imagen;
4. sea necesario definir dirección artística;
5. se necesite comparar coherencia entre imágenes;
6. haya que detectar defectos de IA;
7. se necesite crear prompts;
8. se requiera revisar la narrativa de una ficha;
9. se necesite evaluar el tono de marca;
10. haya que decidir si una imagen debe aprobarse o rechazarse.

## Prompt base para ChatGPT

```text
Actúa como director de arte y auditor visual de Aromia.

Analiza esta imagen según:
- fidelidad del frasco;
- recorte;
- fondo;
- iluminación;
- coherencia con Aromia;
- artefactos;
- texto alterado;
- utilidad para catálogo o editorial;
- riesgo de parecer generada por IA.

Clasifica:
A — publicable
B — corregible
C — referencia
D — sustituir
E — editorial

No apruebes una imagen si el frasco, tapa, etiqueta, logotipo, color o proporciones no coinciden con la referencia real.
```

---

# 11. PROCESAMIENTO DE IMÁGENES DE CATÁLOGO

## Reglas

- partir de una imagen real;
- no generar el frasco desde cero;
- conservar forma, tapa, etiqueta, logotipo, color y proporciones;
- fondo marfil o transparente;
- formato 4:5;
- lienzo maestro 1600 × 2000;
- producto ocupando 68–76 % de la altura;
- sombra suave;
- sin logos de comercios.

## Exportaciones

```text
320 × 400
480 × 600
640 × 800
960 × 1200
1280 × 1600
```

Formatos:

- AVIF;
- WebP;
- PNG solo cuando sea necesario.

## Nombre

```text
{slug}--catalog--v01--640x800.webp
```

---

# 12. PROCESAMIENTO DE IMÁGENES EDITORIALES

Cada perfume debe tener un brief:

```text
Perfume:
Marca:
Familia:
Notas:
Emoción:
Escenario:
Hora:
Iluminación:
Materiales:
Paleta:
Composición:
Espacio negativo:
Permitido:
Prohibido:
Formato:
```

## Flujo

1. Cowork prepara fuentes y referencias.
2. ChatGPT propone conceptos.
3. Francois selecciona.
4. ChatGPT genera o edita.
5. ChatGPT audita.
6. Francois aprueba.
7. Code optimiza.
8. Code integra.
9. Code prueba.
10. Merge a `main`.

---

# 13. CONTROL DE CALIDAD VISUAL

Puntuación:

| Dimensión | Peso |
|---|---:|
| Fidelidad | 30 |
| Calidad técnica | 20 |
| Coherencia | 20 |
| Composición | 15 |
| Adecuación editorial | 10 |
| Procedencia | 5 |

Resultados:

- 90–100: aprobada;
- 80–89: correcciones menores;
- 70–79: reprocesar;
- menos de 70: rechazada.

Error grave de envase = rechazo automático.

---

# 14. AUTOMATIZACIÓN TÉCNICA

Code debe automatizar:

- cambio de tamaño;
- conversión AVIF/WebP;
- compresión;
- nombres;
- `srcset`;
- dimensiones;
- hashes;
- manifest;
- control de peso;
- archivos faltantes;
- duplicados;
- relación de aspecto.

Code no debe automatizar completamente:

- aprobación visual;
- fidelidad;
- licencia;
- sustitución del producto;
- publicación final;
- dirección artística.

---

# 15. ESTRUCTURA DE ARCHIVOS

```text
public/
└── images/
    └── perfumes/
        └── aventus-creed/
            ├── source/
            ├── working/
            ├── catalog/
            ├── editorial/
            └── metadata.json
```

Nota:

- `source/` puede quedar fuera del repositorio;
- producción debe usar activos locales o CDN controlado;
- evitar hotlinking directo permanente desde Amazon, Notino o Douglas.

---

# 16. PILOTO DE IMÁGENES

Procesar primero:

1. Aventus
2. Baccarat Rouge 540
3. Sauvage
4. Black Opium
5. Erba Pura

Cada uno debe incluir:

- imagen de catálogo;
- hero editorial;
- versión móvil;
- versión desktop;
- compresión;
- metadatos;
- control de calidad;
- integración;
- prueba en producción.

Solo después del piloto se congela el estándar.

---

# 17. PRODUCCIÓN POR LOTES

Después del piloto:

- lotes de 5 perfumes;
- máximo 10 si solo hay normalización;
- un perfume por lote si la pieza editorial es compleja.

Flujo Git:

```text
main
└── assets/catalog-batch-01
```

Proceso:

1. añadir activos;
2. actualizar inventario;
3. actualizar metadatos;
4. ejecutar scripts;
5. validar;
6. abrir PR;
7. revisar;
8. fusionar;
9. eliminar rama.

---

# 18. SEO, CONFIANZA Y DATOS

Code debe implementar:

- metadata única;
- canonical;
- Open Graph;
- Twitter Cards;
- JSON-LD;
- sitemap;
- redirects;
- breadcrumbs;
- 404;
- Search Console;
- Bing;
- structured data;
- autores;
- fechas;
- metodología;
- páginas institucionales.

Cowork debe preparar:

- fuentes;
- datos de perfumes;
- fechas;
- marcas;
- notas;
- variantes;
- tamaños;
- retailers;
- precios;
- procedencia.

ChatGPT debe revisar:

- tono;
- claridad;
- claims;
- narrativa;
- diferenciación entre hechos y opinión;
- lenguaje no grandilocuente;
- transparencia de IA.

---

# 19. MODELO DE DATOS RECOMENDADO

Separar:

- perfume;
- variante;
- oferta;
- imagen;
- fuente;
- autor;
- artículo;
- evaluación.

Campos mínimos de oferta:

```text
retailer
price
currency
size
concentration
availability
last_checked
affiliate_url
product_identifier
```

No mostrar precios sin:

- tamaño;
- concentración;
- retailer;
- fecha de revisión;
- mercado.

---

# 20. CHECKLIST DE CODE ANTES DE CADA MERGE

## Repositorio

- rama creada desde `main`;
- cambios limitados al objetivo;
- sin secretos;
- sin archivos temporales;
- documentación actualizada.

## Código

- build correcto;
- lint;
- pruebas;
- rutas;
- formularios;
- errores;
- logs.

## Imágenes

- nombre correcto;
- peso correcto;
- variantes;
- fidelidad aprobada;
- licencia registrada;
- alt;
- dimensiones;
- fallback.

## SEO

- title;
- description;
- canonical;
- OG;
- JSON-LD;
- sitemap;
- enlaces internos.

## Producción

- preview validada;
- sin regresiones visuales;
- responsive;
- accesibilidad;
- rendimiento.

---

# 21. REGLAS PARA AGENTES DE IA

Todo agente debe recibir:

```text
1. main es la única fuente de verdad.
2. No trabajes directamente sobre main.
3. Crea una rama temporal desde main.
4. No uses otra rama como base.
5. No sobrescribas cambios no relacionados.
6. Ejecuta pruebas.
7. Abre un PR.
8. No cambies Railway sin autorización.
9. No elimines ramas o tags sin revisión.
10. Elimina la rama después del merge.
11. No publiques imágenes sin aprobación humana.
12. No inventes datos.
13. Registra fuentes.
14. No alteres frascos de perfumes.
15. Documenta decisiones.
```

---

# 22. ORDEN GENERAL DE EJECUCIÓN

1. Identificar rama y commit de Railway.
2. Crear respaldo.
3. Consolidar producción en `main`.
4. Configurar Railway para `main`.
5. Proteger `main`.
6. Eliminar ramas obsoletas.
7. Crear `AGENTS.md`.
8. Crear documentación de despliegue.
9. Crear inventario de imágenes.
10. Ejecutar piloto de 5 perfumes.
11. Congelar estándar visual.
12. Normalizar 50 imágenes.
13. Crear 10 imágenes editoriales insignia.
14. Normalizar datos.
15. Implementar SEO técnico.
16. Crear páginas de confianza.
17. Mejorar accesibilidad.
18. Implementar observabilidad.
19. Medir resultados.
20. Escalar catálogo solo después.

---

# 23. DEFINICIÓN DE TERMINADO

Una fase se considera terminada solo cuando:

- está en `main`;
- Railway la despliega;
- existe evidencia de pruebas;
- la documentación está actualizada;
- no quedan ramas temporales;
- los datos tienen fuente;
- las imágenes tienen procedencia;
- Francois aprobó el resultado;
- no hay regresiones críticas;
- el cambio puede revertirse.

---

# 24. RESUMEN EJECUTIVO PARA CODE

Code es el ejecutor principal.

Debe:

- proteger el repositorio;
- consolidar producción;
- integrar resultados;
- automatizar tareas repetitivas;
- validar;
- probar;
- desplegar;
- documentar.

Debe delegar a Cowork cuando el problema sea de volumen, investigación, clasificación u organización.

Debe delegar a ChatGPT cuando el problema sea visual, creativo, editorial o requiera evaluación humana asistida.

Fórmula operativa:

> Cowork prepara → ChatGPT crea y evalúa → Code implementa y valida → Francois aprueba → `main` publica.

---

# 25. PRIMERA INSTRUCCIÓN PARA CODE

```text
Lee este documento completo antes de modificar Aromia.

Tu primera misión es:

1. Auditar el repositorio y Railway.
2. Identificar la rama y el commit exactos de producción.
3. Crear un tag y una rama de respaldo.
4. Comparar producción contra main.
5. Proponer la consolidación más segura.
6. No fusionar ni eliminar ramas hasta presentar evidencia.
7. Generar un reporte con:
   - rama desplegada;
   - commit;
   - diferencias con main;
   - ramas con trabajo exclusivo;
   - riesgos;
   - estrategia de merge;
   - plan de rollback;
   - checklist de validación.

No inicies el pipeline de imágenes hasta que main sea la única fuente de verdad.
```
