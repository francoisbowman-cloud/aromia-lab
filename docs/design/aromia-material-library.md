# Aromia Material Library

Biblioteca visual reusable para construir atmósferas, explicar materias primas y dar continuidad sensorial a Aromia.

No es un catálogo de decoración. Cada activo debe poder responder: **¿qué relación real tiene con el perfume, la nota, la familia o la historia que acompaña?**

## 1. Orden de prioridad

La biblioteca se expande en este orden:

1. materias que aparecen repetidamente en el catálogo actual;
2. materias estructurales de la perfumería con alta capacidad narrativa;
3. ingredientes necesarios para nuevos perfumes antes de ampliar el catálogo;
4. elementos atmosféricos no literales, solo cuando existe una necesidad compositiva concreta.

### Tier A — núcleo del catálogo / máxima reutilización

- bergamota
- jazmín
- vainilla
- cedro
- patchouli
- sándalo
- ámbar / resinas cálidas
- almizcle: representar mediante materia/atmósfera, nunca mediante animal
- rosa
- mandarina
- vetiver
- lavanda
- iris / orris
- pimienta rosa
- haba tonka
- azahar / neroli
- musgo de roble

### Tier B — recurrentes y de alto valor compositivo

- limón
- toronja / pomelo
- naranja
- cardamomo
- canela
- azafrán
- tabaco
- oud / agarwood
- incienso / frankincense
- mirra
- cuero: usar material realista, no una abstracción plástica
- cacao
- café
- almendra
- pera
- manzana
- piña
- grosella negra
- violeta
- peonía
- tuberosa
- ylang-ylang
- romero
- salvia
- enebro

### Tier C — expansión y composiciones específicas

Se añaden cuando aparecen en el catálogo validado o en contenido editorial verificable: frutos exóticos, flores menos frecuentes, hierbas, maderas regionales, especias, minerales, acordes marinos y objetos de contexto.

## 2. Activos ya producidos como candidatos

Durante la fase visual se han producido candidatos transparentes para varias materias de Tier A/B, entre ellas bergamota, limón, toronja, mandarina, rosa, jazmín, lavanda, azahar, patchouli, vetiver, iris, ylang-ylang, canela, cardamomo, clavo, pimienta rosa, azafrán, vainilla, tonka, cedro, sándalo, oud, musgo de roble, incienso, mirra, tabaco, pera, manzana, grosella negra y enebro.

**Estado:** candidato visual. Un activo generado no pasa automáticamente a producción. Debe superar el gate de fidelidad descrito abajo y después incorporarse al almacenamiento de assets del proyecto con nombre estable.

## 3. Naming contract

Formato recomendado:

`material-{slug}-{state}-{view}-vNN.{webp|png|avif}`

Ejemplos:

- `material-bergamot-fresh-cut-v01.webp`
- `material-iris-flower-cluster-v01.webp`
- `material-vetiver-dry-root-v01.webp`
- `material-frankincense-resin-tears-v01.webp`

Metadatos asociados:

- `material_slug`
- nombre común
- nombre botánico cuando aplique
- estado: fresh / dried / resin / wood / flower / fruit / root / leaf
- fondo: alpha / white
- lighting_family
- scale_reference
- source_type: photographed / generated / licensed
- review_status
- reviewer_note
- allowed_contexts
- rejected_contexts

## 4. Gate visual “NO IA”

Un candidato se rechaza si presenta:

- anatomía botánica imposible;
- semillas, pétalos, hojas o cortes inconsistentes con la materia real;
- repetición sospechosa de texturas;
- brillo plástico o superficie encerada sin razón física;
- gotas perfectas o humedad excesiva repetida como fórmula estética;
- bordes fundidos o ramas fusionadas;
- sombras incompatibles con la iluminación del propio objeto;
- profundidad de campo imposible dentro de un simple recorte de estudio;
- simetría artificial;
- saturación que haga parecer el ingrediente un render 3D;
- escala imposible de inferir o composición que confunda una materia con otra.

La nitidez no significa hiperrealidad artificial. Debe conservar textura, imperfección y variación natural.

## 5. Transparencia

Preferencia:

1. alpha real y bordes limpios;
2. blanco puro si el recorte pierde fidelidad;
3. fondo contextual solo para una composición editorial terminada.

No ejecutar una extracción agresiva que borre filamentos, raíces, pétalos translúcidos o bordes finos.

## 6. Cómo OMNI debe componer

### Una materia no es una escena

El asset base se conserva neutro. OMNI crea la escena combinando:

- producto real;
- 1–3 materias relevantes;
- luz/material de fondo;
- profundidad y escala coherentes;
- texto solo en la capa UI, nunca incrustado en la fotografía base.

### Regla de luz

No mezclar activos con direcciones de luz contradictorias salvo que se relitifiquen de manera verificable.

### Regla de escala

Una bergamota no puede competir en tamaño físico con una botella si la composición pretende leerse como still life real. La exageración de escala solo se permite como gesto editorial evidente, no como accidente.

### Regla de evidencia

Un ingrediente puede aparecer junto a un perfume solo cuando:

- forma parte de la pirámide o acorde verificado;
- es una materia editorialmente explicada como relación, no como hecho literal;
- o la escena declara explícitamente que es una evocación.

No convertir asociaciones visuales en datos falsos.

## 7. Modos de uso

### Catálogo

No usar materiales alrededor del packshot. El catálogo prioriza producto real sobre blanco.

### PDP

Pueden aparecer en anatomía, contexto o story layer, nunca tapando marca/etiqueta del frasco.

### Academia

Uso principal: explicar familias y materias de manera tangible.

### Discovery / Quiz

Uso selectivo para reforzar afinidades y atmósferas. Evitar convertir cada opción en una tarjeta ilustrada.

### Magazine

Mayor libertad editorial, manteniendo provenance y coherencia de luz.

### Home

Usar como atmósfera secundaria. El protagonista debe seguir siendo una relación real con el catálogo, no una imagen anónima de lujo.

## 8. Preparación para 500 perfumes

Antes de cada batch de catálogo:

1. extraer notas/familias nuevas del batch validado;
2. comparar contra `material_slug` disponibles;
3. marcar gaps;
4. producir solo los assets de alto reuse o necesarios para superficies concretas;
5. auditar NO-IA;
6. publicar assets aprobados;
7. permitir que OMNI los use en composiciones.

Esto impide generar cientos de imágenes que luego no tengan una función real.
