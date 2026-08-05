# Quiz "¿Qué perfume sos?" — Copy y lógica de matching

Sprint 1 — Cowork. Diseñado para funcionar sobre el CSV `PERFUMES_INITIAL_50.csv`.
Lógica de matching por reglas simples (no ML): cada respuesta suma puntos a un
set de tags. Al final, el tag con más puntos define el perfil, y el perfil
mapea a un subconjunto de perfumes del catálogo mediante `familia_olfativa` y
`nicho_o_comercial`.

## Sistema de tags internos

Cada respuesta del quiz suma puntos a uno o más de estos tags:

- `citrico_fresco`
- `floral`
- `gourmand_dulce`
- `amaderado_seco`
- `oriental_especiado`
- `nicho_statement`
- `clasico_comercial`

Al final, el/los tag(s) con mayor puntaje determinan el perfil de resultado.
Si hay empate entre dos tags, se prioriza el que haya aparecido primero en el
recorrido de respuestas (orden de preguntas).

## Preguntas

### Pregunta 1 — Contexto de uso
"¿Para qué momento estás buscando un perfume?"

- A. Uso diario, oficina, algo que no canse → `citrico_fresco` +2, `clasico_comercial` +1
- B. Una salida nocturna o un evento especial → `oriental_especiado` +2, `nicho_statement` +1
- C. Algo para sentirme cómodo/a en casa o clima frío → `gourmand_dulce` +2
- D. Quiero algo que hable de mí, distinto a lo que usa todo el mundo → `nicho_statement` +2, `amaderado_seco` +1

### Pregunta 2 — Textura preferida
"Si tuvieras que elegir una textura, ¿cuál te representa más?"

- A. Fresca y ligera, como recién duchado/a → `citrico_fresco` +2
- B. Cálida y envolvente, como una manta → `gourmand_dulce` +2, `oriental_especiado` +1
- C. Seca y elegante, sin ser dulce → `amaderado_seco` +2
- D. Delicada y romántica → `floral` +2

### Pregunta 3 — Estación favorita
"¿Cuál es tu estación favorita del año?"

- A. Verano → `citrico_fresco` +2
- B. Otoño/invierno → `oriental_especiado` +2, `gourmand_dulce` +1
- C. Primavera → `floral` +2
- D. Me da igual, uso lo mismo todo el año → `amaderado_seco` +1, `clasico_comercial` +1

### Pregunta 4 — Reacción social buscada
"Cuando alguien te huele, ¿qué te gustaría que piense?"

- A. "Huele genial, pero no sabría decir a qué" → `amaderado_seco` +2, `nicho_statement` +1
- B. "¿Qué perfume es ese? Nunca lo olí" → `nicho_statement` +2
- C. "Huele delicioso, como algo rico" → `gourmand_dulce` +2
- D. "Huele clásico, elegante, de siempre" → `clasico_comercial` +2, `floral` +1

### Pregunta 5 — Presupuesto de referencia
"¿Qué tan dispuesto/a estás a invertir en un perfume?"

- A. Prefiero algo accesible y efectivo → `clasico_comercial` +2, `citrico_fresco` +1
- B. Puedo pagar más si vale la pena → `nicho_statement` +1, `oriental_especiado` +1
- C. El precio no es el criterio principal, busco algo que me represente → `nicho_statement` +2, `amaderado_seco` +1

### Pregunta 6 — Color/imagen asociada
"Si tu perfume ideal fuera un color, ¿cuál sería?"

- A. Blanco o celeste, algo limpio → `citrico_fresco` +2
- B. Dorado o ámbar, algo cálido → `oriental_especiado` +2
- C. Rosa o lavanda, algo suave → `floral` +2
- D. Marrón o negro, algo profundo → `amaderado_seco` +2, `nicho_statement` +1

## Lógica de matching hacia el catálogo

Una vez calculado el tag dominante, mapear así contra las columnas del CSV:

| Tag dominante | familia_olfativa objetivo (buscar coincidencia parcial) | nicho_o_comercial sugerido |
|---|---|---|
| `citrico_fresco` | "citrico fresco", "aromatico fresco", "acuatico aromatico" | ambos, priorizar comercial |
| `floral` | "floral", "floral afrutado", "floral amaderado" | ambos |
| `gourmand_dulce` | "oriental gourmand", "amaderado gourmand" | ambos |
| `amaderado_seco` | "amaderado", "amaderado aromatico", "amaderado especiado" | priorizar nicho |
| `oriental_especiado` | "oriental especiado", "ambarado especiado", "ambarado" | ambos |
| `nicho_statement` | cualquier familia | filtrar `nicho_o_comercial = nicho` únicamente |
| `clasico_comercial` | cualquier familia | filtrar `nicho_o_comercial = comercial` únicamente |

Regla de selección final: de los perfumes que matchean familia + categoría,
mostrar los 3 con mayor `precio_referencia_usd` como "opciones aspiracionales"
y los 3 de menor precio como "opciones accesibles", para dar variedad de
presupuesto dentro del mismo perfil olfativo.

## Copy de resultado (pensado para compartir / OG tags)

Estructura sugerida por perfil, con título corto (para OG title) y descripción
compartible (para OG description / texto de post).

### Perfil: Fresco Clásico (`citrico_fresco`)
- **Título compartible:** "Sos Fresco Clásico 🍋"
- **Descripción:** "Tu firma olfativa es la frescura que no se impone: cítricos y acuáticos que funcionan en cualquier contexto. Descubrí qué perfumes de nuestro catálogo matchean con vos."

### Perfil: Alma Floral (`floral`)
- **Título compartible:** "Sos Alma Floral 🌸"
- **Descripción:** "Elegís lo delicado sin perder presencia. Tu perfil olfativo se inclina por ramos florales que suman romanticismo a cualquier ocasión."

### Perfil: Gourmand Adictivo (`gourmand_dulce`)
- **Título compartible:** "Sos Gourmand Adictivo 🍯"
- **Descripción:** "Vainilla, café, praliné: tu perfil busca calidez y dulzura con carácter. Nada de sutilezas tibias — vos vas directo al placer."

### Perfil: Amaderado Silencioso (`amaderado_seco`)
- **Título compartible:** "Sos Amaderado Silencioso 🌲"
- **Descripción:** "Preferís la elegancia seca antes que el dulzor evidente. Tu perfil olfativo construye presencia sin necesidad de gritarla."

### Perfil: Especiado Nocturno (`oriental_especiado`)
- **Título compartible:** "Sos Especiado Nocturno 🔥"
- **Descripción:** "Cálido, envolvente, memorable. Tu perfil olfativo se siente mejor cuando cae el sol y sube la intensidad."

### Perfil: Statement de Nicho (`nicho_statement`)
- **Título compartible:** "Sos un Statement de Nicho 💎"
- **Descripción:** "No buscás lo que usa todo el mundo. Tu perfil olfativo se define por la originalidad y el descubrimiento, no por la popularidad."

### Perfil: Clásico Atemporal (`clasico_comercial`)
- **Título compartible:** "Sos un Clásico Atemporal ⏳"
- **Descripción:** "Preferís lo que ya demostró funcionar. Tu perfil olfativo se apoya en fragancias reconocidas y queridas, sin necesidad de reinventar nada."

## Nota técnica para Code (no bloqueante)

Este archivo asume que el matching se resuelve en frontend o en una función
simple de backend (no requiere modelo de ML). Si el `schema/perfume.schema.json`
de Code define nombres de columna distintos a los usados en
`PERFUMES_INITIAL_50.csv` (ver ese archivo), la tabla de mapeo de arriba deberá
ajustarse a los nombres reales de columna — señalado también en
`SPRINT1_COMPLETE_COWORK.md`.
