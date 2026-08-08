# Runbook — piloto de auditoría de imágenes vía OpenAI API (Fase 2)

**Estado:** implementado, verificado en modo seco. **No ejecutado en modo
real todavía** — requiere aprobación explícita de Brey antes de gastar
crédito de la API.

**Objetivo:** automatizar la ejecución del paquete
`delegations/FASE-2-CHATGPT-PILOTO-5-PERFUMES.md` mediante la OpenAI
Responses API, para no depender de que Brey descargue/adjunte/envíe/copie
manualmente las 5 imágenes y sus resultados. Los criterios (perfumes, URLs,
reglas no negociables, clasificación A-E, las 13 evaluaciones, preguntas
puntuales) están transcritos sin reinterpretar en
`config/image-audit-pilot.json`, con `_source` apuntando al brief original.

## Archivos de este piloto

- `config/image-audit-pilot.json` — fuente de verdad operativa (perfumes,
  reglas, preguntas, modelo, límite de gasto, tarifas estimadas).
- `schemas/image-audit.schema.json` — JSON Schema de la salida estructurada
  exigida a la API (clasificación A-E, 13 evaluaciones, respuestas
  puntuales, confianza, recomendación).
- `scripts/audit-image-pilot.mjs` — script único, dos modos (`--dry-run` y
  real).
- `package.json` (raíz del repo) — expone `npm run images:audit-pilot`. No
  afecta los builds Docker de `apps/web`/`apps/api` (cada uno tiene su
  propio `package.json` y su root directory propio en Railway).
- `reports/image-audits/` — salida: un JSON por perfume + `_summary.json`.
  Se generan solo en modo real.
- `data/image-inventory.audit-proposal.csv` — propuesta de actualización del
  inventario (mismas columnas que `data/image-inventory.csv`, pero **nunca es
  el mismo archivo** — el oficial no se toca por este script bajo ninguna
  circunstancia). Se genera solo en modo real.

## Seguridad — invariantes del script

- La clave se lee **exclusivamente** de `process.env.OPENAI_API_KEY`. El
  script nunca la pide por prompt, nunca la imprime (ni siquiera parcial), y
  nunca la escribe a disco.
- `.env`, `.env.*` (salvo `.env.example`) y `/node_modules` están en
  `.gitignore` (raíz del repo) — confirmado antes de esta entrega.
- El script nunca escribe en `data/image-inventory.csv` — solo lee su
  cabecera para generar la propuesta en un archivo separado.
- El script nunca importa ni invoca `scripts/images/optimize.mjs` ni ningún
  otro script de procesamiento visual — sigue bloqueado.
- El script nunca modifica `imagen_url` en ningún lado (no toca Postgres, no
  toca ningún CSV de seed).
- Las imágenes descargadas para enviarlas a la API viven en un directorio
  temporal (`os.tmpdir()/aromia-image-audit-{uuid}`), fuera del repo, y se
  borran en un bloque `finally` al terminar la corrida (éxito o error).
- El límite de gasto (`spendLimitUsd` en el config, o `--limit-usd=N`) se
  revisa **antes** de cada perfume — si ya se alcanzó, el script se detiene
  y no llama a los perfumes restantes. El coste se **estima** localmente
  (tarifas configurables en `config/image-audit-pilot.json`) a partir de los
  tokens de uso que reporta la API (`usage.input_tokens` /
  `usage.output_tokens`); si la API llegara a exponer un campo de coste en
  dólares explícito (`usage.cost_usd`), el script lo prioriza sobre la
  estimación.

## Modo seco (`--dry-run`)

```bash
npm run images:audit-pilot -- --dry-run
```

No hace ninguna llamada a la API (no requiere `OPENAI_API_KEY`, aunque si
está seteada el script la detecta y lo informa sin leer/imprimir su valor).
Verifica:

- que los 5 perfumes estén definidos en el config;
- que cada mockup OVL exista en disco (`apps/web/public/ovl/{slug}.jpg`);
- que cada `source_url` responda (HEAD, con fallback a `GET` con
  `Range: bytes=0-0` porque algunos CDNs bloquean HEAD) — un fallo de
  red acá es una advertencia, no un error fatal, porque el entorno de
  ejecución puede tener salida HTTP restringida;
- cuántas solicitudes independientes se construirían (una por perfume);
- el límite de gasto configurado;
- la lista de archivos de salida que se crearían;
- que no se llamó a la API, no se tocó el inventario oficial, y
  `optimize.mjs` sigue sin invocarse.

Sale con código `0` si los prerrequisitos (config completo, 5 OVL presentes)
están OK, `1` si falta algo estructural.

## Modo real (consume crédito — requiere aprobación explícita)

```bash
export OPENAI_API_KEY="sk-..."   # nunca lo pegues en un archivo del repo
npm run images:audit-pilot
```

Flags opcionales: `--limit-usd=N` (sobreescribe `spendLimitUsd` del config),
`--model=gpt-...` (sobreescribe el modelo del config).

Por cada perfume: descarga la imagen de catálogo, lee el mockup OVL local,
arma una solicitud independiente a la OpenAI Responses API
(`POST /v1/responses`) con salida estructurada forzada
(`text.format.type = "json_schema"`, `strict: true`) contra
`schemas/image-audit.schema.json`, valida la respuesta con `ajv` antes de
aceptarla, guarda `reports/image-audits/{slug}.json`, y actualiza el
acumulado de coste/tokens. Al final escribe `_summary.json` y la propuesta
de CSV.

**Nota de honestidad técnica:** el payload exacto de `/v1/responses` para
salida estructurada con imágenes (`input_image`, `text.format.json_schema`)
está implementado según la documentación de OpenAI disponible al momento de
escribir este script, pero no fue probado contra la API real (no se hizo
ninguna llamada en esta entrega). Antes de la primera ejecución con gasto
real, vale la pena correr un smoke test con un solo perfume
(`--limit-usd=0.20` y comentar temporalmente los otros 4 en el config, o
pedir a Code que agregue un flag `--only=slug` si hace falta) para confirmar
que el shape de la respuesta coincide con lo que `extractStructuredOutput()`
espera, antes de correr los 5.

## Qué hacer con el resultado

1. Revisar `reports/image-audits/_summary.json` — clasificaciones,
   coste real vs. límite, fallos si los hubo.
2. Revisar cada `reports/image-audits/{slug}.json` individualmente.
3. Revisar `data/image-inventory.audit-proposal.csv` — es una **propuesta**,
   no reemplaza el inventario oficial. Code la compara manualmente contra
   `data/image-inventory.csv` y contra los resultados de Cowork
   (`delegations/FASE-2-COWORK-PILOTO-5-PERFUMES.md`) antes de proponer
   cualquier cambio al oficial.
4. Solo con la auditoría de ChatGPT (vía este pipeline) + los resultados de
   Cowork + aprobación explícita de Brey se avanza al Paso 5 en adelante de
   la misión de Fase 2 (consolidar resultados, proponer tratamiento,
   procesar).
