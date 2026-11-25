# AROMIA — Criterio obligatorio: fidelidad de producto e identidad

**Norma del Publisher (literal):**

> **Producto e identidad**
>
> Etiquetas, textos, logotipos, geometría, color, dimensiones y elementos distintivos deben corresponder al producto real. Ningún resultado visual espectacular compensa una representación incorrecta.

## Jerarquía de decisión

**Veracidad de producto → procedencia y derechos → legibilidad y calidad editorial → dirección artística.**

En fotografías o recreaciones de un perfume comercial identificable, **ninguna estética, composición, iluminación, cromática, retoque ni puntuación generativa tiene permiso de modificar, sustituir o imaginar las características propias del producto**. El contexto que rodea al frasco puede ser artístico; el frasco identificable no.

La autoridad de referencia es el **producto exacto**, no la familia, nombre de marca, primer resultado de búsqueda o un flanker cercano. Deberían constar casa, fragancia, concentración (EDT/EDP/Parfum), variante, capacidad/presentación, fecha de packaging si existe rediseño, y referencia oficial específica. La ausencia de un dato produce `sin comprobar`, nunca aprobación.

## Propuesta operativa — Product Identity Fidelity Gate

Cada imagen de producto se somete a ocho observaciones trazables:

| Característica | Qué comparar con el producto real |
| --- | --- |
| Etiqueta | Forma, material, posición, distribución y tipografía |
| Textos | Nombre, ortografía, concentración, volumen y mensajes |
| Logotipos | Geometría, tamaño, posición, acabado y presencia real |
| Geometría | Silueta, hombros, base, tapón, atomizador y detalles |
| Color | Vidrio, transparencia, líquido, tapa, decoración y reflejos de color propio |
| Dimensiones | Proporción alto/ancho, escalas y relación entre componentes, sin inferir medidas no disponibles |
| Elementos distintivos | Grabados, relieves, texturas, ornamentos y acabado de esa edición |
| Variante | Marca, nombre, flanker, concentración y presentación exacta |

### Evidencia y estados

1. Identificar la referencia oficial del producto exacto; documentar fabricante, variante y cualquier versión histórica de packaging.
2. Inspeccionar los **bytes actuales** del recurso bajo revisión y fijar SHA-256.
3. Comparar punto por punto, guardando fuente/observaciones sin tratar declaraciones como verificación independiente.
4. Si **cualquier elemento material contradice el producto**, marcar `material_mismatch_blocked`: rechazar la imagen candidata o corregirla y reiniciar inspección con el nuevo SHA.
5. Si nada contradice pero falta evidencia o las ocho observaciones parecen correctas, mantener `independent_verification_required`; un operador que marca ocho coincidencias no acredita por sí solo el producto real.
6. Verificar por separado **derechos de uso, procedencia, calidad, accesibilidad, responsive y autorización humana** antes de considerar publicación.

### Fotografía, IA y dirección de arte

- Para **packshots reconocibles**, preferir imágenes propias autorizadas o fuentes de fabricante/distribuidor con licencia revisada, sin asumir que una foto publicada puede reutilizarse.
- La IA puede crear **atmósfera, fondos, ingredientes y escenas**; no inventar letras, proporciones ni geometría de productos reales. Un producto real puede componerse a partir de un asset permitido, preservándolo intacto.
- No usar una imagen de una concentración EDP para una EDT, ni otra capacidad, flanker, edición o envase, aunque sea visualmente similar.
- No corregir errores de identidad con “se ve editorial”; una representación bella pero falsa es **inaceptable**.
- Si solo hay renders artísticos o ambiguos, etiquetar explícitamente como representación conceptual **sin afirmar que representan el producto comercial**, y no utilizarlos como packshot, ficha, CTA o enlace de compra.
- En escenas editoriales de ingredientes sin un perfume identificable, aplicar libertad creativa sin atribuirles falsamente la identidad física de un frasco real.

### Implementación inicial y límites

El módulo `apps/web/src/lib/productIdentityFidelity.ts` es un validador puro que cubre ocho criterios; la interfaz privada `ProductIdentityFidelityChecklist` se vincula al perfume e imagen SHA inspeccionada. Cualquier discrepancia bloquea la propuesta. **Incluso ocho coincidencias declaradas mantienen `fidelityVerified:false`, `replacementAllowed:false` y `publication:'blocked'`**: esta fase no acredita autenticidad, licencia ni aprobación. La captura del checklist es local en el navegador y no se almacena; el sistema de decisiones humanas persistentes continúa separado y protegido.

Para completar el gate en futuras fases: revisión independiente contra imagen/modelo oficial, adjuntar evidencia documental a almacenamiento privado, asociar usuario/rol verificable, cerrar versión y SHA, registrar autorización y revocación, QA visual antes/después y rollback real. **No fusionar ni publicar assets por el mero resultado del checklist.**

Este criterio también se aplica a futuras herramientas de OMNI, Art Direction, agentes de imagen, Amazon/afiliación y Discovery. No habilita generación de activos ni nuevas fuentes. El Publisher sigue seleccionando exclusivamente los canales de YouTube autorizados.
