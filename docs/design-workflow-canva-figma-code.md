# Aromia — Visual Design Workflow

## Principle

Canva and Figma are complementary rather than competing tools in Aromia's design process.

- **Canva = creative studio / art direction.** Use it for rapid visual exploration, mood, editorial composition, photography scale, negative space, typography relationships, collage, and finding unexpected visual directions before paying the cost of implementation.
- **Figma = product design studio.** Once a direction is strong, use Figma to turn it into a coherent product system: grids, tokens, components, variants, states, responsive behavior, prototypes, and developer handoff.
- **Code = production materialization.** Next.js/CSS/real data convert the design system into the actual product.
- **Browser/render = source of truth.** The rendered product determines whether the intended composition survives real content, responsive constraints, loading, accessibility, interaction, and performance.
- **OMNI / automated gates = specialist QA tools.** They may audit or verify where useful, but are not the center of the creative process.
- **Human judgment = final perceptual gate.** Passing technical checks is insufficient; Aromia should feel distinctive, desirable, and memorable.

## Preferred sequence

1. **Reality** — repository, real catalog data, authentic perfume imagery, routes and constraints.
2. **Canva** — broad art-direction exploration and rapid compositions.
3. **Design Lock** — select and document one winning visual direction.
4. **Figma** — translate that direction into a product system across desktop/tablet/mobile, components and states.
5. **Code** — implement with real Aromia data and behavior.
6. **Browser** — compare implementation against design intent using real renders.
7. **QA** — responsive, accessibility, performance, content authenticity, visual fidelity and interaction gates.
8. **Human acceptance** — decide whether the result is genuinely excellent rather than merely new or technically correct.

## Tool selection rule

Do not force every change through Canva or Figma.

Use **Canva** when visual exploration is cheaper than exploration in code. Use **Figma** when a successful visual idea needs systematic UI/product definition. Go **directly to code** when the intervention is already well understood and visual exploration would add unnecessary process.

## Aromia-specific guardrails

- Real product data and authentic perfume imagery take precedence over mockup convenience.
- Do not generate or reconstruct branded perfume bottles as substitutes for authentic product imagery.
- Avoid generic AI-luxury shorthand and template aesthetics.
- Preserve the material-led Aromia palette and editorial identity established by the current redesign lock.
- Avoid card-heavy SaaS patterns when an editorial or spatial composition communicates the information more naturally.
- Mockup fidelity is not enough: desktop/mobile browser renders are mandatory before final acceptance.

## Why this workflow exists

Direct-to-code design is excellent for incremental refinement, but it makes code itself the sketching medium during major visual transformations. Canva lowers the cost of discovering a compelling art direction. Figma then lowers the fidelity loss between a compelling mockup and a robust product implementation. The browser finally exposes the truth that neither design tool can fully simulate.

The target pipeline is therefore:

**REALITY → CANVA → DESIGN LOCK → FIGMA → CODE → BROWSER → QA → HUMAN ACCEPTANCE**
