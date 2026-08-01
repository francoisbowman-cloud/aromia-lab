# CURSO PERSONAL DE BREY — Informática aplicada a proyectos reales

*Curso vivo, construido a partir de la práctica real en Aromia, Atlas E-Commerce y demás proyectos. No es un curso genérico: cada lección nace de algo que realmente implementamos o decidimos.*

**Protocolo de este archivo (léelo antes de editar):** este documento es actualizado por Claude, Code y Cowork indistintamente. Las lecciones se insertan **en orden de prerrequisitos** — un concepto que otro necesita para entenderse debe aparecer antes, no después. El skill `curso-tecnico-brey` define la plantilla y las reglas completas de redacción; si vas a añadir una lección, consúltalo primero. Nunca se reordena ni se borra contenido existente sin avisar a Brey — solo se añade o se amplía con fecha nueva.

---

## Índice

**Bloque 1 — Arquitectura básica de una aplicación web**
1. [Frontend vs. Backend, y qué es una API](#1-frontend-vs-backend-y-qué-es-una-api)

**Bloque 2 — Control de versiones**
2. [Git: repositorios y commits](#2-git-repositorios-y-commits)
3. [Ramas (branches) y merge](#3-ramas-branches-y-merge)

**Bloque 3 — Datos**
4. [Bases de datos relacionales: Postgres](#4-bases-de-datos-relacionales-postgres)
5. [Caché: Redis](#5-caché-redis)

**Bloque 4 — Construyendo la aplicación**
6. [Frameworks de backend: Express](#6-frameworks-de-backend-express)
7. [Frameworks de frontend: Next.js (y React)](#7-frameworks-de-frontend-nextjs-y-react)
8. [Componentes en React](#8-componentes-en-react)
9. [Tailwind CSS](#9-tailwind-css)

**Bloque 5 — Configuración y empaquetado**
10. [Variables de entorno](#10-variables-de-entorno)
11. [Contenedores: Docker](#11-contenedores-docker)

**Bloque 6 — Llevarlo al mundo real**
12. [Entornos: staging vs. producción](#12-entornos-staging-vs-producción)
13. [Deploy](#13-deploy)

**Bloque 7 — Monetización**
14. [Redes de afiliados: el caso de Awin](#14-redes-de-afiliados-el-caso-de-awin)

⏳ Por clasificar:
- [Recorte de imágenes en CSS: `object-fit` y `object-position`, vs. estandarizar assets](#recorte-de-imágenes-en-css-object-fit-y-object-position-vs-estandarizar-assets)

---

## Bloque 1 — Arquitectura básica de una aplicación web

### 1. Frontend vs. Backend, y qué es una API

**En una frase:** el frontend es todo lo que el visitante ve y toca en el navegador; el backend es el programa que corre en un servidor, invisible para el visitante, que maneja datos y lógica de negocio.

**Analogía:** un restaurante. El frontend es el salón y el mesero (lo que el cliente ve e interactúa). El backend es la cocina (donde realmente se preparan las cosas). La **API** es el mesero llevando el pedido a la cocina y trayendo el plato de vuelta — un contrato fijo de "cómo se piden las cosas" entre ambos lados.

**¿Dónde aparece en nuestros proyectos?** En Aromia 2.0, `apps/web` (Next.js) es el frontend — lo que Brey ve al entrar a la página. `apps/api` (Express) es el backend — responde cuando el frontend pregunta "dame la lista de perfumes" o "guarda este resultado de quiz".

**Por qué importa:** separar frontend y backend permite que cada uno evolucione o se reemplace sin romper el otro, siempre que la API (el "menú" de peticiones que acepta) se mantenga estable.

**Se relaciona con:** con esto entendido, tienen sentido las lecciones de frameworks (#6, #7) — Express es un framework de backend, Next.js de frontend.

**Fecha y contexto:** 15 jul 2026 — Claude, base para entender el resto de la arquitectura de Aromia 2.0.

---

## Bloque 2 — Control de versiones

### 2. Git: repositorios y commits

**En una frase:** Git es un sistema que guarda el historial completo de cambios de un proyecto de código, para poder ver, comparar o revertir cualquier versión anterior.

**Analogía:** como el historial de versiones de un documento de Google Docs, pero mucho más detallado y controlado por ti: cada "guardado" (commit) es una foto exacta del proyecto en ese momento, con un mensaje explicando qué cambió.

**¿Dónde aparece en nuestros proyectos?** El repositorio `aromia-lab` en GitHub contiene todo el historial de Aromia 1.0 y 2.0. Cada vez que Code sube trabajo, crea un commit con un mensaje describiendo el cambio.

**Por qué importa:** sin esto, cualquier error sería casi imposible de deshacer con precisión, y trabajar en equipo (Brey revisando, Code implementando) sería un caos de archivos duplicados y "versión_final_v2_definitiva.zip".

**Se relaciona con:** es el prerrequisito directo de la lección #3 (ramas), que es la razón real por la que Git se vuelve indispensable en equipo.

**Fecha y contexto:** 15 jul 2026 — Claude, base necesaria para entender la arquitectura de ramas del proyecto (sección 4 del ESTADO).

---

### 3. Ramas (branches) y merge

**En una frase:** una rama es una copia paralela del proyecto donde se puede trabajar sin afectar la versión "oficial"; hacer *merge* es fusionar esos cambios de vuelta cuando están listos.

**Analogía:** como escribir un borrador aparte de un documento importante en vez de editar el original directamente — puedes experimentar, romper cosas, deshacer, y solo cuando estás seguro, copias esos cambios al documento real.

**¿Dónde aparece en nuestros proyectos?** Aromia usa exactamente esta lógica en cadena: `main` (Aromia 1.0, en producción, nunca se toca directo) → `feature/2.0` (el monorepo de Next.js donde Code trabaja) → `design/ui-ux` (rama de diseño, que sale de `feature/2.0`, no de `main`). El orden de merge acordado es `design/ui-ux` → `feature/2.0` → `main`.

**Por qué importa:** permite que Code experimente e implemente sin riesgo de romper el sitio que ya está viviendo en producción real (aromialab.com), y que Brey revise cambios antes de que lleguen a lo público.

**Se relaciona con:** depende de entender #2 (Git/commits). Se conecta más adelante con #12 (staging vs. producción) y #13 (deploy) — las ramas suelen mapear a distintos entornos.

**Fecha y contexto:** 15 jul 2026 — Claude, documentando la arquitectura de ramas ya decidida para Aromia 2.0.

---

## Bloque 3 — Datos

### 4. Bases de datos relacionales: Postgres

**En una frase:** un programa que guarda datos organizados en tablas (como hojas de cálculo relacionadas entre sí) de forma permanente, ordenada y consultable.

**Analogía:** un archivero gigante con carpetas (tablas) — una carpeta de "perfumes", otra de "usuarios", otra de "reseñas" — donde cada ficha puede referenciar a otra (una reseña "apunta" a qué perfume pertenece).

**¿Dónde aparece en nuestros proyectos?** Aromia 2.0 usa Postgres para guardar el catálogo de perfumes, sus atributos (marca, notas, precio), y en el futuro las reseñas y resultados del quiz — en vez de tenerlo todo escrito a mano en archivos HTML como en Aromia 1.0.

**Por qué importa:** con datos en una base de datos real, se puede filtrar, comparar y actualizar contenido sin editar código a mano cada vez — es lo que hace posible el comparador de perfumes y el quiz de recomendación.

**Se relaciona con:** es prerrequisito de #5 (Redis/caché) — el caché existe justamente para no tener que consultar la base de datos todo el tiempo.

**Fecha y contexto:** 15 jul 2026 — Claude, parte del stack de Aromia 2.0 (`apps/api` + Postgres).

---

### 5. Caché: Redis

**En una frase:** una memoria temporal ultra-rápida que guarda respuestas ya calculadas, para no tener que volver a preguntarle a la base de datos (más lenta) cada vez que se pide lo mismo.

**Analogía:** como anotar en un post-it el resultado de una cuenta que hiciste hace un minuto, en vez de volver a hacer la cuenta si te la vuelven a preguntar.

**¿Dónde aparece en nuestros proyectos?** Aromia 2.0 usa Redis junto a Postgres — por ejemplo, si muchos visitantes piden la misma lista de "los 10 perfumes más populares", Redis puede servir esa respuesta al instante sin que Postgres tenga que recalcularla cada vez.

**Por qué importa:** mejora la velocidad del sitio y reduce la carga sobre la base de datos real, algo que se vuelve importante en cuanto hay tráfico de verdad.

**Se relaciona con:** depende de #4 (Postgres) — Redis no reemplaza a la base de datos, la complementa.

**Fecha y contexto:** 15 jul 2026 — Claude, parte del stack de Aromia 2.0.

---

## Bloque 4 — Construyendo la aplicación

### 6. Frameworks de backend: Express

**En una frase:** Express es una herramienta (framework) sobre Node.js que simplifica escribir el backend — recibir peticiones del frontend y responder con datos — sin tener que programar esa parte "a mano" desde cero.

**Analogía:** si el backend es la cocina de un restaurante, Express es como tener ya instalados los quemadores, el horno y el fregadero — no tienes que construir la cocina desde los ladrillos, solo cocinar.

**¿Dónde aparece en nuestros proyectos?** `apps/api` en Aromia 2.0 está escrito en Express + TypeScript — ahí viven las rutas que responden preguntas como "dame los perfumes que cumplen tal filtro".

**Por qué importa:** ahorra muchísimo código repetitivo (manejo de peticiones HTTP, rutas, formatos de respuesta) que de otro modo habría que escribir manualmente por cada funcionalidad.

**Se relaciona con:** depende de #1 (frontend/backend/API). Se complementa con #7 — Next.js es el equivalente del lado del frontend.

**Fecha y contexto:** 15 jul 2026 — Claude, parte del stack de Aromia 2.0.

---

### 7. Frameworks de frontend: Next.js (y React)

**En una frase:** React es una librería para construir interfaces por piezas reutilizables; Next.js es un framework construido sobre React que además resuelve cosas como rutas de página, rendimiento y estructura de proyecto.

**Analogía:** React te da las piezas de LEGO (botones, tarjetas, formularios reutilizables); Next.js te da además el manual de instrucciones de cómo organizar esas piezas en un edificio completo (páginas, navegación, carga rápida).

**¿Dónde aparece en nuestros proyectos?** `apps/web` en Aromia 2.0 es Next.js 14. Las rutas `/perfumes`, `/perfumes/[slug]` y `/quiz` son páginas generadas automáticamente por Next.js a partir de la estructura de carpetas del proyecto.

**Por qué importa:** en Aromia 1.0 cada página es un archivo HTML escrito a mano; en 2.0, Next.js genera páginas dinámicamente a partir de los datos en Postgres — así el comparador y el quiz pueden crecer sin tener que escribir HTML nuevo para cada perfume.

**Se relaciona con:** depende de #1 (frontend/backend). Es el prerrequisito directo de #8 (componentes React) y #9 (Tailwind, que se usa dentro de estos componentes).

**Fecha y contexto:** 15 jul 2026 — Claude, parte del stack de Aromia 2.0.

---

### 8. Componentes en React

**En una frase:** un componente es un bloque de interfaz reutilizable (un botón, una tarjeta de producto, un menú) que se puede usar una y otra vez con datos distintos cada vez.

**Analogía:** un molde de galletas — el molde (componente) es siempre el mismo, pero cada galleta (instancia) puede tener un color o decoración distinta según los datos que le des.

**¿Dónde aparece en nuestros proyectos?** La "tarjeta de perfume" que se repite en `/perfumes` es un componente: se escribe una sola vez y se reutiliza para cada uno de los perfumes del catálogo, solo cambiando los datos (nombre, precio, imagen) que recibe.

**Por qué importa:** evita reescribir el mismo bloque de HTML/diseño decenas de veces, y si se necesita cambiar el diseño de la tarjeta, se cambia en un solo lugar y se actualiza en todas partes.

**Se relaciona con:** depende de #7 (Next.js/React). Se relaciona con #9 (Tailwind) — el estilo visual de un componente normalmente se define con clases de Tailwind.

**Fecha y contexto:** 15 jul 2026 — Claude, parte del stack de Aromia 2.0.

---

### 9. Tailwind CSS

**En una frase:** una forma de darle estilo visual (colores, espaciado, tipografía) a los elementos escribiendo pequeñas clases directamente en el HTML/componente, en vez de escribir hojas de estilo (CSS) separadas.

**Analogía:** en vez de escribir en un documento aparte "todos los botones azules deben tener este tono exacto de azul", le pones directamente la etiqueta `azul-500` al botón mismo — como poner post-its de instrucciones directamente sobre el objeto, en vez de en un manual separado.

**¿Dónde aparece en nuestros proyectos?** `apps/web` usa Tailwind para todo el estilo visual de Aromia 2.0 — la paleta dorada (`--gold: #B68A44 / #C8A86B`) usada en el hero rediseñado de Aromia 1.0 sigue esa misma filosofía de utilidades, aunque esa parte estática no use Tailwind directamente.

**Por qué importa:** acelera mucho el trabajo de diseño porque no hay que saltar entre archivos de CSS y componentes — todo el estilo vive junto al elemento que lo usa.

**Se relaciona con:** depende de #8 (componentes) — Tailwind se aplica normalmente dentro de un componente.

**Fecha y contexto:** 15 jul 2026 — Claude, parte del stack de Aromia 2.0.

---

## Bloque 5 — Configuración y empaquetado

### 10. Variables de entorno

**En una frase:** valores de configuración (contraseñas, claves de API, direcciones de base de datos) que se guardan fuera del código, para que el mismo código funcione en distintos lugares (tu máquina, staging, producción) sin tener que reescribirlo.

**Analogía:** como los ajustes de una app de celular (idioma, cuenta conectada) — la app (el código) es la misma, pero se comporta distinto según la configuración que tenga cargada en cada dispositivo.

**¿Dónde aparece en nuestros proyectos?** `AFFILIATE_ACTIVE = true` y el StoreID `aromialab-20` en Aromia 1.0 son variables de este tipo — controlan si los enlaces de afiliado están activos y con qué cuenta, sin tener que cambiar el HTML de cada página.

**Por qué importa:** mantiene secretos (claves, contraseñas) fuera del código que se sube a GitHub (público o compartido), y permite que el mismo proyecto se comporte distinto en desarrollo, staging y producción con solo cambiar estos valores.

**Se relaciona con:** depende de #1 (frontend/backend) y se vuelve central en #11 (Docker) y #12 (staging vs. producción) — ahí es donde estas variables realmente cambian de un entorno a otro.

**Fecha y contexto:** 15 jul 2026 — Claude, tema recurrente en el checklist de deploy a Railway.

---

### 11. Contenedores: Docker

**En una frase:** Docker empaqueta una aplicación junto con todo lo que necesita para correr (versión exacta de Node, librerías, configuración) en una unidad cerrada llamada *contenedor*, que funciona igual sin importar en qué computadora se ejecute.

**Analogía:** como enviar un mueble ya armado y envuelto en una caja hermética, en vez de enviar las piezas sueltas con instrucciones de ensamblaje — no importa el camión ni la casa de destino, la caja llega y funciona igual.

**¿Dónde aparece en nuestros proyectos?** Aromia 2.0 usa `docker-compose` para levantar juntos el frontend (Next.js), el backend (Express), Postgres y Redis, todos como contenedores separados que se comunican entre sí — tanto en la máquina de Code como, más adelante, en Railway.

**Por qué importa:** elimina el clásico problema de "en mi máquina funciona" — si el contenedor corre en la laptop de Code, corre igual en el servidor de Railway.

**Se relaciona con:** depende de #10 (variables de entorno) — cada contenedor recibe su configuración a través de ellas. Es prerrequisito directo de #12 (staging vs. producción) y #13 (deploy).

**Fecha y contexto:** 15 jul 2026 — Claude, parte del checklist de deploy a Railway entregado a Code.

---

## Bloque 6 — Llevarlo al mundo real

### 12. Entornos: staging vs. producción

**En una frase:** *producción* es la versión real que ven los visitantes del sitio; *staging* es una copia idéntica pero privada, usada para revisar cambios antes de que lleguen a producción.

**Analogía:** staging es el ensayo general de una obra de teatro — mismo escenario, mismo vestuario, pero sin público pagando entrada todavía. Producción es la función real, con el público (los visitantes reales) presente.

**¿Dónde aparece en nuestros proyectos?** Aromia 1.0 vive en `main`, en producción real (aromialab.com). Aromia 2.0 se está desplegando primero a un staging en Railway, para que Brey lo revise visualmente antes de que se apruebe el merge final a `main`.

**Por qué importa:** permite detectar errores de diseño o funcionamiento sin arriesgar la experiencia de los visitantes reales ni los ingresos por afiliados ya activos en Aromia 1.0.

**Se relaciona con:** depende de #3 (ramas — cada entorno suele mapear a una rama distinta) y #11 (Docker — mismo contenedor, distinta configuración). Es el paso previo inmediato a #13 (deploy).

**Fecha y contexto:** 15 jul 2026 — Claude, parte central del timeline acordado (staging live: 15-21 jul).

---

### 13. Deploy

**En una frase:** el proceso de tomar el código y ponerlo a correr en un servidor real, accesible desde internet, ya sea en staging o en producción.

**Analogía:** es el acto de mudarse — no basta con tener las cajas empacadas (el código listo), hay que llevarlas físicamente al lugar nuevo y desempacarlas ahí para que la casa (el sitio) esté habitable.

**¿Dónde aparece en nuestros proyectos?** El deploy actual en progreso es `feature/2.0` → Railway (staging), usando el checklist paso a paso ya entregado a Code (`PARA-CODE-EJECUTAR-AHORA.md`). Más adelante, cuando la Fase 3 esté completa y Brey apruebe, habrá un deploy final de `main` a producción (~25 ago).

**Por qué importa:** es el paso que convierte "código que funciona en la laptop de Code" en "sitio real que Brey puede revisar" o "sitio que el público puede visitar".

**Se relaciona con:** es la culminación de todo lo anterior — depende de #11 (Docker, para empaquetar) y #12 (saber a qué entorno se está desplegando).

**Fecha y contexto:** 15 jul 2026 — Claude, tarea inmediata de Code según el timeline acordado.

---

## Bloque 7 — Monetización

### 14. Redes de afiliados: el caso de Awin

**En una frase:** una red de afiliados es un intermediario entre Aromia (que recomienda productos) y las tiendas (Douglas, Primor) que los venden: genera los links con tracking, registra qué visitante compró qué gracias a un link nuestro, y paga la comisión — sin que Aromia tenga que negociar un acuerdo separado con cada tienda.

**Analogía:** es como una agencia de corretaje inmobiliario que trabaja con muchas propiedades a la vez. En vez de que Aromia negocie una comisión distinta con Douglas, con Primor y con cada tienda nueva, se da de alta una sola vez en Awin (la agencia), y desde ahí accede a todas las tiendas que ya trabajan con esa red bajo condiciones ya fijadas.

**¿Dónde aparece en nuestros proyectos?** El "scraper de precios" de Aromia 2.0 (`apps/api/src/scraper/`) ya tiene el código listo para consultar el feed de productos de Awin (un CSV con precios y disponibilidad actualizados) y comparar cada fila contra el catálogo real de perfumes, para mantener los precios de Douglas y Primor al día automáticamente. Hoy ese código está deployado pero inactivo ("no-op") porque falta el paso de Brey: crear la cuenta de afiliado en Awin y pasar el token de API (`AWIN_API_TOKEN`) — sin eso, no hay credencial con la que consultar el feed.

**Por qué importa:** sin una red de afiliados, cada link de "comprar en Douglas" en Aromia sería solo un link común, sin forma de que Douglas sepa que la venta vino de Aromia — y por lo tanto, sin comisión. Awin es la pieza que convierte "recomendamos este perfume" en "generamos ingresos cuando alguien lo compra por nuestro link". Amazon funciona parecido pero con su propio programa directo (Amazon Associates), sin pasar por Awin — por eso el catálogo ya tiene `link_afiliado` de Amazon funcionando, mientras que Douglas/Primor siguen esperando este paso.

**Se relaciona con:** depende de [[10-variables-de-entorno]] (el token de Awin se guarda como variable de entorno, igual que cualquier otra credencial) y de [[1-frontend-vs-backend-y-qué-es-una-api]] (Awin expone su feed de productos como una API que el backend de Aromia consulta).

**Fecha y contexto:** 31 jul 2026 — Claude, al retomar el trabajo y explicarle a Brey qué es Awin antes de decidir los próximos pasos (ver decisión #56 y #61 de `ESTADO-aromia.md`).

---

## Por clasificar

### Recorte de imágenes en CSS: `object-fit` y `object-position`, vs. estandarizar assets

**En una frase:** cuando una imagen no tiene las mismas proporciones que el espacio donde se muestra, `object-fit` decide cómo se ajusta (recortando, estirando o encogiendo) y `object-position` decide qué parte de la imagen se prioriza al recortar — pero es un parche sobre la imagen original, no un reemplazo de tenerla bien preparada de antemano.

**Analogía:** es como mirar una foto rectangular a través de una ventana redonda — `object-fit: cover` decide si la foto se agranda hasta llenar la ventana (recortando bordes) o se encoge para que entre completa (dejando espacios vacíos); `object-position` decide si esa ventana se centra en la cara de la persona o en sus pies.

**¿Dónde aparece en nuestros proyectos?** Las tarjetas de `catalogo.html` usan `.card-img img { object-fit: cover }` sobre un marco de proporción fija (`aspect-ratio: 3/4`). Las fotos de producto vienen directo de Amazon (`m.media-amazon.com/...`), cada una con su propia composición — algunas centran bien el frasco, otras no — así que el recorte automático a veces corta mal la imagen.

**Por qué importa:** hay dos soluciones de nivel distinto para el mismo síntoma. `object-position` es un ajuste de CSS, rápido, caso por caso, pero limitado por la imagen que ya existe — si la foto original tiene el producto corrido hacia un costado, no hay ajuste de CSS que la arregle del todo. La alternativa real es estandarizar: descargar cada imagen, recortarla/redimensionarla a un lienzo consistente, y alojarla en el propio servidor (`assets/`) en vez de enlazar a Amazon. Eso da control total y, de paso, independiza al sitio de que Amazon cambie o borre esas URLs — pero implica procesar cada imagen a mano (o con un script), no es gratis.

**Se relaciona con:** [[9-tailwind-css]] usa las mismas utilidades de CSS por debajo del capó, aunque `catalogo.html` no use Tailwind directamente.

**Fecha y contexto:** 16 jul 2026 — Code, decisión tomada con Brey: arreglo rápido con `object-position` ahora, estandarizar assets queda como tarea de fondo para más adelante.

---

*Última actualización: 16 jul 2026, por Code — agregada lección de `object-fit`/`object-position` en "Por clasificar".*
