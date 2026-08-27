# Aromia — Editorial Workflow

Aromia is evolving from catalog-first commerce into a fragrance magazine. Stories come first; products and affiliate links appear only when editorially justified.

## Working model

**Claude = Editor + Editorial Architect**

For each publication Claude should:
- research and fact-check the subject;
- write the article as editorial content, not a product page;
- structure the reading rhythm;
- identify moments where visual expression can materially improve the story;
- integrate the final visual assets back into the article.

**ChatGPT = Visual Director + Image Composer**

Claude must leave creative room for ChatGPT rather than prescribing finished image prompts. ChatGPT decides which visual language best serves each moment and may combine, reinterpret, or reject techniques.

Available visual vocabulary includes, but is not limited to:
- Hero Shot
- Conceptual Product Photography
- Advertising Still Life
- Lifestyle Product Photography
- CGI Product Visualization
- Commercial Beauty Photography
- Ingredient-Driven Composition
- editorial photography
- material/macro studies
- abstraction and metaphor
- negative-space compositions
- serial/repetition compositions
- diptychs/triptychs
- collage and typographic compositions
- environmental/scenographic imagery

These are tools, **not a checklist or closed menu**. Do not force a Hero Shot or product image when the story needs something else.

**OMNI = Critic / Gate**

OMNI evaluates whether the combined editorial and visual solution actually improves the experience. It should reject decoration, unnecessary complexity, AI-slop, weak authenticity, or visual work without perceptual/narrative gain.

## Visual opportunity handoff

When Claude finds a moment where visual work could add meaning, mark:

```text
[AROMIA_VISUAL_OPPORTUNITY]
Narrative purpose:
Emotional objective:
Authenticity constraints:
Relationship to surrounding text:
Other hard constraints:
Creative freedom: LOW | MEDIUM | HIGH
```

Do **not** prescribe lens, lighting, exact camera, object positions, effects, complete set design, or a finished generation prompt unless the story genuinely requires a specific constraint.

The question for ChatGPT is:

> What is the strongest visual way to make this moment felt or understood?

ChatGPT may also decide that no image is the stronger solution.

## Production loop

`IDEA → RESEARCH → STORY → EDITORIAL STRUCTURE → VISUAL OPPORTUNITIES → CHATGPT VISUAL DIRECTION/ASSETS → INTEGRATION → OMNI GATE → CORRECTION`

Keep the process lightweight. Do not create a branch, subsystem, schema, automation, or new framework merely to support this workflow unless a real recurring need proves it necessary.

## Editorial principle

> **Una fragancia, una historia.**

Aromia does not need to show everything that exists. It needs to find what deserves to be told.
