---
titulo: "Matriz olfativa: quince perfumes, cuatro maneras de leerlos"
tipo: dato
serie: "Reference Issue 01"
perfumes_mencionados: ["Angel EDP", "Aventus", "Baccarat Rouge 540 EDP", "Delina", "Eau Sauvage", "Fahrenheit", "Flowerbomb", "Interlude Man", "La Vie Est Belle", "Le Male", "Miss Dior Blooming Bouquet", "Molecule 01", "Pure Poison", "Reflection Man", "Terre d'Hermes EDT"]
keyword_objetivo: "familias olfativas perfumes comparación"
estado: editorial_ready
---

```text
EDITORIAL: READY
ART_DIRECTION: PENDING
VISUAL_ASSETS: PENDING
IMPLEMENTATION: PENDING
QA: PENDING
PUBLISH: PENDING
TARGET_DATE: UNSCHEDULED
```

**Territorio del calendario:** Reference Issue 01 — matriz sensorial
(pieza 9 del PLAN) y soporte de descubrimiento por familia olfativa
(pieza 13).

**Fact-check:** los quince perfumes de esta matriz y sus valores de
género, familia olfativa y notas por pirámide provienen directamente de
`PERFUMES_INITIAL_50.csv` (raíz del repo, idéntico a
`apps/api/data/PERFUMES_INITIAL_50.csv` según especifica `CLAUDE.md`),
no de un juicio propio de Cowork sobre cómo huele cada perfume. La
selección de estos quince, entre los 38-50 disponibles en catálogo, se
hizo priorizando (a) perfumes que ya tienen artículo propio en
`drafts/` — lo que da a esta matriz una función real de mapa cruzado
dentro de RI01, no una lista aislada — y (b) cobertura real de familias
y géneros distintos, para que el patrón que se comenta abajo sea
verificable con solo mirar la tabla. No se consultó directamente la
tabla `perfumes` de Postgres ni el registro de imágenes OVL — si Code
tiene valores más recientes o distintos ahí (la propia tabla tiene
`estado` y columnas que este CSV no expone), esta matriz debería
recalcularse contra esa fuente antes de publicar, tal como sugiere el
brief.

**Valor de catálogo marcado como sospechoso, no corregido:** la fila de
Baccarat Rouge 540 EDP en este CSV lista "cedro;abeto" como notas de
fondo. La ficha oficial de Maison Francis Kurkdjian no menciona cedro
ni abeto en la composición — describe el perfume en tres "auras"
(Aire: hedione y jazmín; Fuego: azafrán y etil-maltol; Mineral:
Ambroxan y ámbar gris). Este mismo hallazgo ya se documentó en
`drafts/br540-hype-vs-merito.md`; se repite acá porque esta matriz usa
el mismo dato de catálogo y hereda la misma inconsistencia. Se deja tal
cual viene del CSV, sin corregir — la corrección de la fila le
corresponde a Code, no a esta pieza.

# Matriz olfativa: quince perfumes, cuatro maneras de leerlos

| Perfume | Marca | Género | Familia olfativa | Nota de salida dominante | Nota de fondo dominante |
|---|---|---|---|---|---|
| Angel EDP | Mugler | femenino | oriental gourmand | melocotón | chocolate / vainilla |
| Aventus | Creed | masculino | afrutado amaderado | piña | ámbar gris / musgo de roble |
| Baccarat Rouge 540 EDP | Maison Francis Kurkdjian | unisex | ambarado floral | azafrán | cedro / abeto* |
| Delina | Parfums de Marly | femenino | floral afrutado | lichi | almizcle / vainilla |
| Eau Sauvage | Dior | masculino | cítrico fresco | bergamota | musgo de roble / vetiver |
| Fahrenheit | Dior | masculino | amaderado especiado | cedro | cuero / sándalo |
| Flowerbomb | Viktor & Rolf | femenino | floral oriental | té verde | pachulí / ámbar |
| Interlude Man | Amouage | masculino | oriental especiado | incienso | ámbar / cuero |
| La Vie Est Belle | Lancôme | femenino | floral afrutado gourmand | grosella negra | praliné / vainilla |
| Le Male | Jean Paul Gaultier | masculino | aromático fougère | menta / lavanda | vainilla / sándalo |
| Miss Dior Blooming Bouquet | Dior | femenino | floral afrutado | mandarina siciliana | almizcle blanco |
| Molecule 01 | Escentric Molecules | unisex | almizclado mineral | Iso E Super | Iso E Super |
| Pure Poison | Dior | femenino | floral almizclado | (sin salida registrada) | almizcle / vainilla |
| Reflection Man | Amouage | masculino | floral amaderado | bergamota | sándalo / cedro |
| Terre d'Hermès EDT | Hermès | masculino | amaderado especiado | pomelo | vetiver / cedro |

*Ver nota de fact-check sobre este valor.

[AROMIA_VISUAL_OPPORTUNITY]
Narrative purpose: This is explicitly a data table, not an image — per PLAN §C, forcing this piece into a visual primitive would violate the criterion "dato, no imagen." No visual asset should replace or duplicate the table itself.
Emotional objective: N/A — data literacy, not mood.
Authenticity constraints: N/A.
Relationship to surrounding text: N/A — this marker exists only to document that no image was omitted by oversight; it was a deliberate exclusion.
Other hard constraints: Do not generate a chart, infographic, or illustrated version of this table as a replacement for the table itself.
Creative freedom: N/A

## Lo primero que salta: el amaderado especiado no tiene género fijo

Dos perfumes de esta lista —Fahrenheit y Terre d'Hermès EDT— comparten
la misma familia, "amaderado especiado", y ambos están catalogados como
masculinos. Pero sus notas de fondo divergen bastante: uno cierra en
cuero y sándalo, el otro en vetiver y cedro. La misma etiqueta de
familia no garantiza el mismo perfume de fondo — funciona más como una
categoría amplia de intensidad y textura que como una promesa de
ingredientes idénticos.

## El género comercial no corresponde uno a uno con la familia olfativa

Molecule 01 y Baccarat Rouge 540 EDP están catalogados como unisex, pero
pertenecen a familias muy distintas entre sí (almizclado mineral, casi
sin pirámide tradicional, frente a ambarado floral con notas dulces
marcadas). Eso sugiere que "unisex" en este catálogo no describe un
perfil olfativo compartido, sino más bien una decisión de mercadeo
independiente de la familia. En el otro extremo, "floral afrutado"
aparece tanto en Delina como en Miss Dior Blooming Bouquet, ambos
catalogados como femeninos — ahí sí la familia y el género comercial
coinciden, lo que hace más visible por contraste el caso unisex.

## Las notas de salida repiten menos de lo que uno esperaría

De los quince perfumes, solo dos comparten exactamente la misma nota de
salida dominante: Eau Sauvage y Reflection Man abren ambos con
bergamota, pese a pertenecer a familias distintas (cítrico fresco
contra floral amaderado). El resto de la lista no repite ninguna nota
de salida entre sí. Esto contradice una intuición común: que las notas
de apertura, por ser las más "vendibles" comercialmente, tienden a
concentrarse en un puñado de ingredientes populares. En este subconjunto
al menos, no es así.

## Sí, pero

Esta lectura tiene un límite que vale la pena decir con claridad: quince
perfumes no son una muestra representativa de toda la perfumería, ni
siquiera de todo el catálogo de Aromia. Se eligieron, en parte, porque
ya tenían un artículo propio — es decir, la selección no es aleatoria,
está sesgada hacia los perfumes que el equipo editorial ya decidió cubrir
por otras razones. Un patrón que aparece claro acá (por ejemplo, la
falta de repetición en notas de salida) podría no sostenerse si se
mirara el catálogo completo, o la industria en general. Esta matriz es
una fotografía de un subconjunto curado, no una encuesta estadística.

## Una tabla para cruzar, no para memorizar

El valor real de esta matriz no está en memorizar quince filas, sino en
usarla como punto de referencia rápido: si un lector busca algo
"parecido" a un perfume que ya conoce, mirar la columna de familia
olfativa y la de notas dominantes ayuda más que confiar solo en el
nombre de la marca. Dicho eso, ninguna tabla reemplaza a la nariz — la
familia olfativa clasifica una tendencia general, no una promesa exacta
de cómo va a oler cada frasco en cada piel.

---

*Nota: pieza de dato editorial de Aromia. Los enlaces de compra dirigen
a retailers autorizados.*

[Angel EDP, Mugler](https://www.amazon.com/s?k=Mugler+Angel&tag=aromialab-20) — oriental gourmand, mencionado en esta matriz.
[Aventus, Creed](https://www.amazon.com/s?k=Creed+Aventus&tag=aromialab-20) — afrutado amaderado, mencionado en esta matriz.
[Baccarat Rouge 540 EDP, Maison Francis Kurkdjian](https://www.amazon.com/dp/B074V34X4C?tag=aromialab-20) — ambarado floral, mencionado en esta matriz.
[Delina, Parfums de Marly](https://www.amazon.com/s?k=Parfums+de+Marly+Delina&tag=aromialab-20) — floral afrutado, mencionado en esta matriz.
[Eau Sauvage, Dior](https://www.amazon.com/s?k=Dior+Eau+Sauvage&tag=aromialab-20) — cítrico fresco, mencionado en esta matriz.
[Fahrenheit, Dior](https://www.amazon.com/s?k=Dior+Fahrenheit&tag=aromialab-20) — amaderado especiado, mencionado en esta matriz.
[Flowerbomb, Viktor & Rolf](https://www.amazon.com/s?k=Viktor+Rolf+Flowerbomb&tag=aromialab-20) — floral oriental, mencionado en esta matriz.
[Interlude Man, Amouage](https://www.amazon.com/s?k=Amouage+Interlude+Man&tag=aromialab-20) — oriental especiado, mencionado en esta matriz.
[La Vie Est Belle, Lancôme](https://www.amazon.com/s?k=Lancome+La+Vie+Est+Belle&tag=aromialab-20) — floral afrutado gourmand, mencionado en esta matriz.
[Le Male, Jean Paul Gaultier](https://www.amazon.com/s?k=Jean+Paul+Gaultier+Le+Male&tag=aromialab-20) — aromático fougère, mencionado en esta matriz.
[Miss Dior Blooming Bouquet, Dior](https://www.amazon.com/s?k=Dior+Miss+Dior+Blooming+Bouquet&tag=aromialab-20) — floral afrutado, mencionado en esta matriz.
[Molecule 01, Escentric Molecules](https://www.amazon.com/s?k=Escentric+Molecules+Molecule+01&tag=aromialab-20) — almizclado mineral, mencionado en esta matriz.
[Pure Poison, Dior](https://www.amazon.com/s?k=Dior+Pure+Poison&tag=aromialab-20) — floral almizclado, mencionado en esta matriz.
[Reflection Man, Amouage](https://www.amazon.com/s?k=Amouage+Reflection+Man&tag=aromialab-20) — floral amaderado, mencionado en esta matriz.
[Terre d'Hermès EDT, Hermès](https://www.amazon.com/dp/B09N3WKW1S?tag=aromialab-20) — amaderado especiado, mencionado en esta matriz.

```text
COWORK_STAGE: READY_FOR_CODE_INGEST
BASE_MAIN_SHA: 9974d1d
SOURCE_BRANCH: (local a Cowork, sin push — ver working tree)
BATCH: Reference Issue 01 — Encargo D (matriz olfativa, dato no imagen)
```

Nota para Code: los valores de familia/género/notas vienen del CSV de
catálogo (`PERFUMES_INITIAL_50.csv`), no de un análisis propio de
Cowork — si la tabla Postgres `perfumes` tiene valores distintos o más
actualizados, hay que recalcular la tabla contra esa fuente antes de
publicar. El valor "cedro;abeto" de Baccarat Rouge 540 EDP se mantiene
tal cual viene del CSV pese a no coincidir con la ficha oficial MFK —
ver detalle completo en `drafts/br540-hype-vs-merito.md`. Los enlaces
de afiliado usan el formato de búsqueda genérica de Amazon (no ASIN
directo) para los perfumes que no tienen `link_afiliado` verificado en
el CSV; Baccarat Rouge 540 y Terre d'Hermès EDT sí usan su ASIN real
del CSV. No se hizo commit ni push, per instrucción del brief — queda
en el working tree.
