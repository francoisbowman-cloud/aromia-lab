# Aromia — Visual Grammar Sheet
### Evidencia producida por el prototipo `El Coleccionista` · 2026-08-30

Solo se registran relaciones que el prototipo demuestra. Nada aquí es una guía de marca especulativa.
Cada entrada lleva su clasificación: `AROMIA_FOUNDATION` · `REUSABLE_PRIMITIVE` · `STORY_SPECIFIC` · `EXPERIMENT`.

---

## 1. La relación estructural que hace reconocible a Aromia

`AROMIA_FOUNDATION`

Toda la página se construye con **una sola fila editorial de tres zonas**, repetida de principio a fin:

```
[ CARRIL ]   [ CAMPO DE LECTURA ]   [ ZONA MARGINAL ]
  190px          460–640px              170px+
```

Implementación (sin media queries, colapso intrínseco):

```
row    display:flex; flex-wrap:wrap; align-items:flex-start;
       gap: clamp(24px,3.5vw,56px)
rail   flex:0 1 190px; min-width:170px
field  flex:1 1 460px; max-width:640px
margin flex:1 1 170px; min-width:150px
```

Esta fila **es** la identidad. Lo que varía de historia a historia es **cuánto de cada zona está ocupado**, no la retícula.

- Zona vacía = silencio editorial, no espacio sin usar.
- El carril y la zona marginal envuelven por debajo de ~760px y se convierten en interludios en línea. El colapso es un comportamiento diseñado, no un fallback.
- Contenedor: `max-width:1440px`, padding lateral `clamp(20px,5vw,72px)`.

**Por qué es fundacional:** dos historias visualmente opuestas siguen perteneciendo a Aromia si comparten esta fila. No obliga a ninguna composición concreta.

## 2. Tipografía

`AROMIA_FOUNDATION`

Se conservan los tres roles del sistema existente. El prototipo solo aporta la escala verificada.

| Rol | Fuente | Uso demostrado |
|---|---|---|
| `font-display` | Newsreader | titular, subtítulos, **cuerpo del ensayo**, entradilla, cifra editorial |
| `font-sans` | Archivo | wordmark, navegación, copy funcional del cierre comercial |
| `font-plex` | IBM Plex Sans | metadata, captions, notas marginales, rótulos, datos |

Hallazgo del prototipo: **el cuerpo del ensayo va en Newsreader, no en Archivo.** Archivo queda como voz de interfaz. La distinción cuerpo-serif / interfaz-sans es lo que separa "revista" de "sitio de producto" sin recurrir a ornamento.

Escala verificada:

```
titular       Newsreader 300  clamp(44px, 11.5vw, 138px) / .86 / -.045em
entradilla    Newsreader 400  clamp(21px, .9vw+17px, 27px) / 1.48
subtítulo     Newsreader 400  clamp(30px, 3vw, 46px) / 1.02 / -.03em, max 12–15ch
cuerpo        Newsreader 400  clamp(18px, .55vw+16px, 21px) / 1.72
cuerpo Acto IV Newsreader 400 clamp(20px, .9vw+16px, 26px) / 1.6
nota marginal IBM Plex 400    13px / 1.55, max-width 240px
rótulo        IBM Plex 400    12px / .14em / mayúsculas
```

Reglas:
- El titular se rompe a mano (`El` / *`coleccionista`*), cuelga a la izquierda y **nunca se centra**. La segunda palabra en cursiva es lo que evita el "titular serif gigante" genérico.
- Los subtítulos se limitan a 12–15 caracteres de ancho: se rompen en 2–3 líneas y funcionan como bloque, no como banda.
- Suelo de 12px. Nada por debajo, ni en metadata.
- El titular no ocupa el viewport completo: espacio arriba > tamaño de letra.

## 3. Espacio y ritmo

`AROMIA_FOUNDATION` (escala) · `STORY_SPECIFIC` (curva)

Pasos verticales entre filas, en orden de intensidad narrativa:

```
respiro largo   clamp(52px, 9vh, 110px)
respiro normal  clamp(30px, 5vh, 56px)
compresión      clamp(20px, 3.2vh, 36px)
saturación      clamp(12px, 1.8vh, 22px)
liberación      clamp(120px, 26vh, 300px)   ← solo Acto IV
```

El ritmo del prototipo es una **curva**, no una constante: 110 → 56 → 36 → 22 → *saturación* → 300. Que exista una curva es fundacional; que esta curva concreta sea esta, es de la historia.

## 4. Color

`AROMIA_FOUNDATION`

```
papel            #FAF8F4   superficie base
papel liberado   #FDFCFA   solo Acto IV — más claro, no más blanco
vitela archivo   #EFEAE0   superficie documental
tinta            #1F1B15   negro cálido, nunca #000
apagado          #6B6155   secundario legible (AA)
terciario        #6B6155   rótulos (mismo valor que apagado: AA a 12px)
línea            rgba(31,27,21,.12–.35)
espécimen        #DFD8C9 / #D5CDBB
marino episódico #1E3348   acento de esta historia
error editorial  #8A3A2E   marca VERIFICAR (solo capa de inspección)
```

- **No hay dorado.** El oro heredado no aparece porque la historia no lo pide. Sigue disponible; deja de ser firma.
- Solo **dos** superficies de fondo en toda la pieza, más un tercer papel apenas más claro para la liberación. El cambio de superficie es un acontecimiento narrativo, no decoración de sección.
- El acento marino se usa **solo** en el gráfico de proporción y en enlaces. Nunca en tipografía editorial.

## 5. Imagen

`AROMIA_FOUNDATION`

Reglas que el prototipo demuestra:

1. **Ninguna imagen sin trabajo declarado.** Cada espécimen del prototipo lleva su función escrita en el caption.
2. **El recorte es autoría.** El espécimen de apertura sale del contenedor por la derecha (`margin-right: calc(-1 * clamp(40px,10vw,180px))`) porque el estante continúa fuera de la página. No es full-bleed decorativo.
3. **Ninguna proporción se repite.** Apertura panorámica recortada; archivo en tríptico vertical.
4. **Placeholder honesto.** Mientras el activo no exista, se muestra un campo rayado con la especificación del activo requerido en `font-plex`. No se genera un frasco falso ni se deja un hueco gris. El placeholder es una **ficha de encargo**, no un error.
5. Ninguna imagen se presenta como evidencia documental de un hecho (fórmula, lote, año) que no esté verificado.

## 6. Captions y metadata

`AROMIA_FOUNDATION`

Un solo lenguaje en toda la publicación:

```
[filete superior 1px rgba(31,27,21,.35)]
[texto Plex 13px/1.55, color #6B6155, max-width 240px]
[rótulo Plex 12px, .14em, mayúsculas, #6B6155]  ← opcional
```

El filete **superior** (no inferior, no caja) es la señal. Vive en el carril o en la zona marginal; nunca dentro del campo de lectura. Al colapsar en móvil conserva el filete y se convierte en interludio.

## 7. Datos como material compositivo

`REUSABLE_PRIMITIVE`

Las cifras no se escriben como numerales gigantes: se **dibujan como marcas contables** en la zona marginal (4/10 hogares; 35/100 lanzamientos). Barras de 4–5px, tinta contra `rgba(31,27,21,.13)`, con su lectura en Plex debajo.

Gana comprensión y densidad al mismo tiempo, que es exactamente lo que esta historia necesitaba. Reutilizable en cualquier pieza con una proporción real que contar. Prohibido si la cifra no es verificable.

## 8. Navegación y continuidad

`AROMIA_FOUNDATION`

Barra fija de 52px, papel sólido con filete inferior. Sin blur decorativo, sin sombra, sin logo grande.

- Izquierda: `AROMIA` (Archivo 600, .28em) + sección.
- Derecha: **indicador de acto**, que cambia según la sección visible (`01 Reconocer → 02 Acumular → 03 Conservar → 04 Soltar → 05 Cerrar`).

El indicador de acto sustituye a la barra de progreso: informa de *dónde está el argumento*, no de cuánto scroll queda. Es orientación editorial, no telemetría.

## 9. Motion

`AROMIA_FOUNDATION`

Un solo comportamiento en toda la página, y solo porque narra: las cuatro bandas del campo serial aparecen escalonadas (opacidad, 170ms entre bandas) al entrar en viewport. La acumulación *ocurre* en lugar de estar ya ahí.

- Sin parallax, sin scroll-jacking, sin reveals genéricos por sección.
- `prefers-reduced-motion` desactiva el escalonado; el contenido queda completo y estático.
- El indicador de acto no anima: cambia.

## 10. Accesibilidad y responsive

`AROMIA_FOUNDATION`

- Cero media queries. El responsive es intrínseco (`flex-wrap` + `clamp` + `auto-fill`). Consecuencia: la composición también sobrevive dentro de contenedores estrechos, no solo en viewports estrechos.
- Móvil no apila el desktop: el carril se convierte en interludio antes del párrafo que anota, y el campo serial se sale de pantalla a propósito.
- Contraste: `#6B6155` sobre `#FAF8F4` (5.71:1) y sobre `#EFEAE0` (5.2:1) — AA a 12px. **No existe un tercer nivel de gris:** cualquier valor más claro que `#6B6155` cae por debajo de 4.5:1 sobre vitela, que es el fondo más exigente. La jerarquía del rótulo se consigue con mayúsculas, tracking y tamaño, nunca bajando la luminancia. Mismo error que la auditoría OMNI ya corrigió en `--muted` (#8a8172 → #675e52); no reintroducirlo.
- Enlaces afiliados: `rel="sponsored nofollow noopener"`, subrayado permanente, divulgación adyacente.

---

## Gate anti-repetición aplicado a este prototipo

1. ¿Compatible con la identidad de Aromia? — Sí: fila de tres zonas, roles tipográficos, lenguaje de caption, sobriedad de color.
2. ¿Tiene comportamiento compositivo propio? — Sí: campo serial que se comprime, tríptico de conservación, liberación de 300px.
3. **¿Podría reutilizarse sin cambios en los próximos cinco artículos?** — **No.** La curva de densidad y el campo serial solo tienen sentido con este argumento.
4. ¿Las primitivas sirven a la narración? — Sí; ninguna aparece por existir.
5. ¿Coherencia sin previsibilidad? — La retícula y los captions se repiten; la ocupación y el ritmo no.
