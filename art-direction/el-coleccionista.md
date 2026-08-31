# ART DIRECTION — EL COLECCIONISTA

## Publication state

```text
EDITORIAL: READY
ART_DIRECTION: READY
VISUAL_COMPOSITION: READY
DESIGN_PROTOTYPE: READY_FOR_EXTRACTION
DESIGN_SYSTEM_EXTRACTION: READY   (Code 2026-08-30 → apps/web/src/app/editorial.css + components/editorial/* + app/design-lab)
EARLY_OMNI: PASS
VISUAL_ASSETS: READY_WITH_CONSTRAINTS
IMPLEMENTATION: READY_FOR_FINAL_OMNI   (Code 2026-08-30 → app/magazine/el-coleccionista, rama local feat/el-coleccionista-design-lab, noindex, sin publicar)
QA: PENDING   (OMNI final)
PUBLISH: PENDING
TARGET_DATE: UNSCHEDULED
```

**Source manuscript:** `drafts/el-coleccionista.md`  
**Fact check:** `research/el-coleccionista-fact-check.md`  
**Founding Design specimen:** `design-lab/el-coleccionista/`  
**Composition study:** `art-direction/el-coleccionista-composition-study.md`  
**Early OMNI:** `design-lab/el-coleccionista/EARLY_OMNI_REVIEW.md`  
**Series:** Perfume como puerta  
**Art Direction / Visual Composition:** ChatGPT

## Canonical direction

The article is not really about owning many bottles. It is about a collection that cannot reach a stable ending: curiosity creates expansion, scarcity creates preservation, and the physical shelf becomes evidence of both impulses.

The page should therefore behave like a collection.

> **The composition accumulates while the argument accumulates, then abruptly gives the reader space again.**

The founding Claude Design specimen discovered a useful relationship rather than a reusable page: `CARRIL → CAMPO DE LECTURA → ZONA MARGINAL`. ChatGPT's composition keeps that relationship but decides how much each zone is occupied, when it collapses, and when it disappears.

**Repeat identity. Vary composition.**

## Accepted visual composition

### Act I — Recognition
Quiet and domestic. A single documentary opening image may enter the reading/marginal field only if it feels lived-in rather than retail/styled. If the candidate fails that gate, use no image. Recognition is more important than abundance.

### Act II — Accumulation
The page progressively tightens. The unsupported `4/10 households` mark is removed entirely. Proliferation is expressed primarily through a serial typographic field, with `30—40%` shown only as an attributed estimate and current verified Le Male names used only where literal names are needed. No default family beauty shot.

### Act III — Preservation
The register changes from multiplication to time. Use archive/vellum behavior and a sourced `2010 → hoy` temporal gesture for Aventus. Do not invent batches, reformulation dates, formula evidence, historical packaging or a documentary conservation triptych.

### Act IV — “Sí, pero”
Release the pressure. Large near-white field, empty rail, minimal marginal activity. No image. The visual absence is content.

### Act V — Close
Close editorially first. Then allow the restrained `Para quien quiera seguir oliendo` references to Le Male and Aventus with clear disclosure and no retail visual dominance.

## Asset decisions

`VISUAL_ASSETS: READY_WITH_CONSTRAINTS`

- Opening collection photograph: optional-but-preferred documentary asset; must pass rights + lived-in/not-retail gate. No pseudo-real generated branded bottles.
- Flanker multiplication: no new photographic asset required; typographic/serial treatment is canonical for this story.
- Preservation triptych: `NOT_REQUIRED`; rejected because it risks manufacturing documentary evidence.
- Act IV image: `NOT_REQUIRED` by design.
- `A.` identity mark: typographic or omitted. Do not generate simulated handwriting.

## Foundation / primitive extraction boundary

Early OMNI passed the creative direction but did **not** canonize the entire specimen.

Candidate Foundation:
- typography role relationships;
- reading-measure discipline;
- caption/credit language;
- warm paper / warm ink / accessible muted behavior;
- episodic color derived from real material;
- responsive transformation of marginal information into meaningful interludes;
- contrast rule forbidding a weak third gray.

Candidate reusable primitives:
- editorial rail / reading field / marginal field;
- marginal note → inline interlude;
- serial/repetition field;
- density transition;
- archive/time field;
- whitespace pause/reset;
- documentary opening image + caption/credit;
- contextual editorial-commerce close.

Keep story-specific:
- exact `110 → 56 → 36 → 22px` compression;
- four exact flanker bands / exact overflow;
- this article's vellum treatment;
- `2010 → hoy`;
- exact `300px` release;
- title-smaller-than-body reset;
- article-specific counting/marginalia.

## Responsive intent

Mobile is its own composition. Marginalia become inline interludes where useful; density becomes cadence and sequence rather than squeezed sidebars; deliberate overflow must remain legible; the `Sí, pero` release must be unmistakable; no carousel is introduced merely because the viewport is narrow.

## Implementation handoff

Early OMNI is now `PASS`. Code may begin system extraction and article implementation, but **must not publish**.

Required command:

> **Continúa Aromia desde el repo, sin publicar.**

Code must:
1. read `AROMIA_DESIGN_PROTOTYPING_SYSTEM.md`, this file, the composition study, the founding Design deliverables and `EARLY_OMNI_REVIEW.md`;
2. extract only approved Foundation/primitives into the permanent `/design-lab`;
3. avoid a universal `ArticleTemplate` and preserve story-specific gestures locally;
4. implement *El Coleccionista* from Foundation + primitives + this composition;
5. resolve the opening image conservatively: authentic/licensed and lived-in, or no image;
6. render desktop and mobile;
7. compare the browser result against narrative intent and implementation fidelity;
8. leave the work for final OMNI with `PUBLISH` still `PENDING`.

## Final browser gate

After implementation, final OMNI must verify:
- density actually accumulates in the rendered experience;
- `Sí, pero` visibly releases it;
- mobile preserves equivalent narrative tension;
- no unsupported data reappears;
- no fake product/documentary evidence is introduced;
- typography/grid/caption/contrast behavior matches the approved system;
- contextual commerce remains subordinate;
- the page feels like *El Coleccionista*, not an Aromia article template with different nouns.
