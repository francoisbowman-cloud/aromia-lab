# Aromia DSI — sistema de diseño real

## Propósito

Este documento es el contrato de integración entre Aromia y el Design System Intelligence (DSI) de OMNI.

**OMNI sigue siendo independiente.** Aromia no importa ni modifica el core de OMNI: consume únicamente la salida gobernada del análisis DSI como conocimiento local del producto.

## Descubrimiento del sistema real

El sistema existente no es una sola paleta ni una colección de componentes. Su identidad emerge de estas capas:

1. **Fundación:** papel, tinta, superficies suaves, acento dorado, tipografías Cormorant/Archivo/IBM Plex, radios sobrios y foco accesible.
2. **Semántica:** `paper`, `surface`, `soft`, `ink`, `muted`, `line`, `primary`, `secondary`, `accent`, `destructive`.
3. **Componentes:** shadcn/ui como base técnica; componentes de producto y editorial encima de esa base.
4. **Composición:** el principio de "repetir relaciones, no layouts" gobierna catálogo, academia, magazine y descubrimiento.
5. **Atmósfera:** escenas y materiales son expresivos, pero no sustituyen la legibilidad ni la fidelidad del producto.
6. **Confianza:** el packshot canónico del perfume y los datos verificables tienen prioridad sobre el tratamiento visual.
7. **Interacción:** foco visible, targets táctiles, reduced-motion y equivalencia teclado/touch forman parte del sistema, no son QA posterior.

## Decisiones que DSI debe conservar

- No convertir Aromia en una interfaz SaaS genérica.
- No normalizar todas las páginas a una plantilla única.
- No ampliar el dorado hasta convertirlo en identidad dominante.
- No introducir glassmorphism, 3D o parallax como decoración por defecto.
- No degradar la fidelidad de las botellas para obtener composiciones más limpias.
- No introducir una segunda fuente de verdad para tokens o componentes.
- No modificar el core de OMNI desde este repositorio.

## Jerarquía de tokens

`primitive → semantic → component → composition`.

Las primitivas describen valores; los semánticos describen intención; los componentes consumen semánticos; las composiciones pueden variar sin crear tokens ad-hoc.

### Roles canónicos

| Rol | Token |
|---|---|
| Fondo editorial | `--color-paper` |
| Superficie | `--color-surface` |
| Agrupación suave | `--color-soft` |
| Texto principal | `--color-ink` |
| Texto secundario | `--color-muted` |
| Separación funcional | `--color-line` |
| Acción primaria | `--color-primary` |
| Foco/interacción | `--color-focus` |
| Error | `--color-danger` |

Los aliases históricos (`--bg`, `--text`, `--gold`, etc.) permanecen para compatibilidad y migración gradual.

## Subsystems permitidos

**Editorial/producto:** comparte la fundación Aromia.

**Admin:** puede conservar un lenguaje operativo más denso y sus tokens específicos (`admin-*`). No se fuerza a heredar la estética editorial cuando hacerlo reduzca eficacia.

**Print:** mantiene sus reglas propias de lectura y paginación.

## Regla de cambio

Toda modificación relevante debe declarar:

- `BEFORE`: evidencia del problema.
- `AFTER`: cambio concreto.
- `DELTA`: beneficio observable.
- `WHY ACCEPTED`: evidencia/gate que justifica conservarlo.
- `SCOPE`: qué superficie cambia y cuál queda explícitamente fuera.

## Gate de independencia OMNI

Una integración DSI es válida solo si:

- no agrega dependencia runtime de OMNI;
- no importa código del core de OMNI;
- no cambia contratos de datos o rutas por motivos puramente visuales;
- el repositorio puede compilar y desplegar sin que OMNI esté disponible;
- el conocimiento DSI queda versionado como artefacto local y auditable.

## Estado inicial descubierto

El sistema ya tenía una dirección visual fuerte y varias decisiones maduras: tokens semánticos, shadcn/ui, tipografías diferenciadas, dark mode, reduced-motion, foco visible y reglas estrictas de imagen. El principal problema no era falta de identidad, sino **dispersión de la fuente de verdad**: parte del sistema estaba expresada en variables semánticas, otra parte en aliases históricos y otra en valores directos de Tailwind/CSS.

La optimización de esta integración consiste primero en hacer explícitas esas relaciones y reducir la deriva futura, no en rediseñar Aromia por completo.
