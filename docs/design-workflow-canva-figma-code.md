# Aromia — Visual Design Workflow

## Principle

Canva and Figma are complementary rather than competing tools in Aromia's design process.

- **Canva = creative studio / art direction.** Use it for rapid visual exploration, mood, editorial composition, photography scale, negative space, typography relationships, collage, and finding unexpected visual directions before paying the cost of implementation.
- **Figma = product design studio.** Once a direction is strong, use Figma to turn it into a coherent product system: grids, tokens, components, variants, states, responsive behavior, prototypes, and developer handoff.
- **Code = production materialization.** Next.js/CSS/real data convert the design system into the actual product.
- **Live browser = source of truth.** The deployed preview determines whether the intended composition survives real content, responsive constraints, loading, navigation, accessibility, interaction and performance.
- **OMNI / automated gates = specialist QA tools.** They may audit or verify where useful, but are not the center of the creative process.
- **Human judgment = final perceptual gate.** Human review should judge desire, identity and memorability after obvious defects have already been found and corrected upstream.

## Preferred sequence

1. **Reality** — repository, real catalog data, authentic perfume imagery, routes and constraints.
2. **Canva** — broad art-direction exploration and rapid compositions.
3. **Design Lock** — select and document one winning visual direction.
4. **Figma when useful** — translate that direction into a product system across desktop/tablet/mobile, components and states.
5. **Code** — implement with real Aromia data and behavior.
6. **Build + deploy preview** — create an isolated runtime tied to the exact design branch/commit.
7. **Live click-through audit** — open the actual URL, click through Home → Catalog → filters → PDP → Magazine → article → Discovery → navigation, and inspect desktop plus mobile.
8. **Visual / UX audit** — record crop, whitespace, hierarchy, typography, image authenticity, loading, overflow, dark-mode, focus, empty-state and interaction defects.
9. **Fix + re-audit** — correct defects and repeat the same live path until the preview passes.
10. **Human acceptance** — decide whether the already-audited result is genuinely excellent rather than merely new or technically correct.

## Live click-through gate

A successful build, CI pass, Railway `SUCCESS`, correct branch, or correct commit is **not** visual acceptance.

Before presenting a version as a candidate for approval, the live preview itself must be traversed. At minimum verify:

- first viewport at desktop and mobile;
- primary navigation and back/forward behavior;
- Catalog search, filters and explicit reset state;
- at least one real PDP and its image behavior;
- Magazine hub and one article;
- Discovery and one route/recommendation interaction;
- light/dark mode where applicable;
- focus/keyboard-visible states where practical;
- image loading/fallbacks and authentic product rendering;
- no accidental double frames, excess whitespace, clipping, overlap, scroll traps or obvious layout shifts.

**Human review is the last perceptual gate, not the first place obvious defects should be discovered.**

## Tool selection rule

Do not force every change through Canva or Figma.

Use **Canva** when visual exploration is cheaper than exploration in code. Use **Figma** when a successful visual idea needs systematic UI/product definition. Go **directly to code** when the intervention is already well understood and visual exploration would add unnecessary process.

## Aromia-specific guardrails

- Real product data and authentic perfume imagery take precedence over mockup convenience.
- Do not generate or reconstruct branded perfume bottles as substitutes for authentic product imagery.
- Avoid generic AI-luxury shorthand and template aesthetics.
- Preserve the material-led Aromia palette and editorial identity established by the current redesign lock.
- Avoid card-heavy SaaS patterns when an editorial or spatial composition communicates the information more naturally.
- Mockup fidelity is not enough: desktop/mobile live renders and click-through are mandatory before final acceptance.

## Why this workflow exists

Direct-to-code design is excellent for incremental refinement, but it makes code itself the sketching medium during major visual transformations. Canva lowers the cost of discovering a compelling art direction. Figma lowers fidelity loss when the concept needs systematic product definition. Code materializes the product. The live browser then exposes the truth that neither a design tool nor a passing build can fully simulate.

The target pipeline is therefore:

**REALITY → CANVA → DESIGN LOCK → FIGMA WHEN USEFUL → CODE → BUILD → LIVE CLICK-THROUGH → VISUAL/UX AUDIT → FIX → RE-AUDIT → HUMAN ACCEPTANCE**
