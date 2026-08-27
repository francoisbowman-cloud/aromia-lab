# Estrategia SEO inicial — Aromia v2.0 (Sprint 1)

> **Actualización 2026-08-27 — pivote a revista (decisión #103).** Este documento
> es de Sprint 1 y asumía el catálogo navegable (`/perfumes/` → `/catalogo/`) como
> puerta de entrada SEO principal. **Ya no aplica ese supuesto.** Con el pivote a
> revista editorial:
> - La **puerta de entrada principal es el Magazine** (`/magazine/[slug]`): cada
>   reseña, comparativa y guía es una landing de búsqueda, con links de afiliado
>   de Amazon embebidos en el texto.
> - El **grid público `/catalogo` se retiró** (bloque 1.2): la URL redirige 308 a
>   `/magazine`. También `/perfumes` y `/comparar` → `/magazine`.
> - La **ficha individual `/catalogo/[slug]` sigue siendo indexable** a propósito
>   (sin `noindex`) como contenido long-tail: quien busca el nombre exacto de un
>   perfume es tráfico de intención alta. Se lista en `sitemap.xml` (por perfume),
>   la landing `/catalogo` ya no.
> - La estructura de URLs de la sección 2 quedó obsoleta ya en 21/07 (`/articulos/`
>   → `/magazine/`, `/perfumes/` → `/catalogo/`); se deja como registro histórico.
>
> El resto del documento (keywords, prioridad de intención, backlog de contenido)
> sigue siendo válido y de hecho más central que antes.

## 1. Keywords objetivo iniciales

Basadas en los 10 artículos producidos en este sprint. Volumen y dificultad
son estimaciones cualitativas (no se corrió una herramienta de keyword
research en este sprint — señalado como pendiente en la sección 3).

| Artículo | Keyword principal | Keywords secundarias |
|---|---|---|
| Reseña Baccarat Rouge 540 | baccarat rouge 540 opinion | baccarat rouge 540 dupe, cuanto dura baccarat rouge 540 |
| Reseña Santal 33 | santal 33 le labo resena | santal 33 opinion, santal 33 masculino o unisex |
| Reseña Tobacco Vanille | tobacco vanille tom ford resena | tobacco vanille duracion, mejores perfumes de tabaco |
| Reseña Delina | delina parfums de marly resena | delina vs delina exclusif, perfume floral rosado |
| Comparativa Sauvage vs Bleu de Chanel | sauvage vs bleu de chanel | cual es mejor sauvage o bleu de chanel |
| Comparativa Black Opium vs Good Girl | black opium vs good girl | mejor perfume gourmand femenino |
| Comparativa Aventus vs Layton | aventus vs layton comparacion | mejor nicho masculino 2026 |
| Guía verano | mejores perfumes para el verano | perfumes frescos verano, perfumes citricos hombre mujer |
| Guía invierno | mejores perfumes para el invierno | perfumes calidos invierno, perfumes orientales especiados |
| Guía primera cita | perfume para primera cita | que perfume usar en una cita |
| Guía primer nicho | primer perfume de nicho recomendaciones | como elegir perfume de nicho |

### Prioridad de intención de búsqueda

Las keywords tipo "X vs Y" y "resena" tienen intención transaccional/comparativa
alta — son las que más probablemente conviertan hacia el modelo de afiliados.
Las keywords tipo "guía" y "cómo elegir" tienen intención informativa, útiles
para awareness y para capturar tráfico de tope de embudo (quienes recién
empiezan a investigar).

## 2. Estructura de URLs propuesta para v2.0

```
/                          → home
/articulos/                → índice de artículos
/articulos/[slug]/         → artículo individual (ej: /articulos/santal-33-resena/)
/perfumes/                 → índice / catálogo de 50 perfumes
/perfumes/[slug]/          → ficha individual de perfume
/quiz/                     → quiz "qué perfume sos"
/quiz/resultado/[perfil]/  → página de resultado compartible (para OG tags)
```

Slugs en minúsculas, sin acentos, separados por guiones — consistente con la
convención ya usada en `articles/` (minúsculas) del repo.

### Nota sobre redirects (decisión #5 del ESTADO)

Si esta estructura difiere de las URLs de v1 (no confirmado en este sprint por
falta de acceso a `ESTADO-aromia.md` — ver sección 3), van a hacer falta
redirects 301 desde las URLs viejas hacia las nuevas antes de lanzar, para no
perder el posicionamiento ya ganado. Esto es responsabilidad conjunta de
Cowork (mapa de URLs viejas → nuevas) y Code (implementación de los redirects
en Next.js, típicamente vía `next.config.js`).

**Acción pendiente:** confirmar con Chat/ESTADO cuáles eran las URLs de v1
antes de cerrar el mapa de redirects definitivo.

## 3. Prioridades de contenido para la siguiente ronda

En orden sugerido, después de este sprint:

1. **Fichas de los 50 perfumes del CSV** — contenido individual por perfume
   (aunque sea corto), ya que hoy solo 8 de los 50 tienen un artículo asociado.
   Esto además da contenido único indexable en `/perfumes/[slug]/`.
2. **Investigación real de keywords** — este sprint definió keywords por
   criterio editorial/experiencia, no por volumen de búsqueda real. Antes de
   escalar contenido, correr una herramienta de keyword research (Google
   Keyword Planner, Ahrefs, Ubersuggest) para validar o ajustar prioridades.
3. **Artículos de comparativa adicionales** cubriendo los perfumes del CSV que
   todavía no aparecieron en ningún artículo (ver lista en
   `SPRINT1_COMPLETE_COWORK.md`).
4. **Contenido de quiz ampliado** — hoy el quiz tiene 6 preguntas y 7 perfiles;
   una siguiente iteración podría sofisticar el matching (por ejemplo, cruzar
   con `categoria_precio` para filtrar resultados por presupuesto real del
   usuario).
5. **Schema markup / datos estructurados** (Article, Product, FAQPage) — a
   coordinar con Code una vez el frontend esté funcional, para mejorar rich
   snippets en buscadores.

## 4. Nota de alcance

Esta estrategia se limita a los entregables de contenido de Sprint 1. No
incluye auditoría técnica SEO (velocidad, Core Web Vitals, sitemap.xml,
robots.txt) — eso corresponde a la pista de Code y debería quedar reflejado
en su propio checklist técnico.
