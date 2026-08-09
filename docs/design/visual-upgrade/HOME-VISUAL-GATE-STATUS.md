# AROMIA HOME — VISUAL GATE STATUS

Status: PREVIEW READY / FINAL PHOTOGRAPHIC APPROVAL PENDING
Branch: `feat/aromia-home-visual-polish-01`
Draft PR: #17
Scope: Home only.

## 1. Structural implementation

- [x] Home integrated in `apps/web`, not prototype-only.
- [x] Server-side real data retained (`getPerfumes`, `getArticulos`).
- [x] Hero split into a small client island only where pointer interaction is required.
- [x] Scroll reveal isolated in a reusable client wrapper.
- [x] No Framer Motion or new animation dependency.
- [x] No changes to PR #10 / Fase 3.
- [x] No GDPR/GA or npm-audit work mixed into the branch.

## 2. Visual language

- [x] Hybrid 01 direction consolidated.
- [x] Editorial Cinematic remains the emotional backbone.
- [x] Ecosystem uses the approved large typographic index gesture.
- [x] Olfactive discovery uses the approved editorial-index treatment.
- [x] Sensory language is carried through Hero → Product Reveal.
- [x] Magazine is a spread, not a generic promotional card.
- [x] Quiz is framed as an olfactive consultation, not a form CTA.
- [x] Club + Newsletter close as one editorial chapter instead of a black card pair.

## 3. Light / Dark

### Atelier Ivorio / Light

- [x] Light is the dominant visual state rather than a washed-out Dark theme.
- [x] Warm paper / ivory / stone surfaces replace cold neutral grey.
- [x] No large forced black panel in the final conversion chapter.
- [x] Photography can remain luminous without using white overlays as a fake day treatment.

### Maison Grafito / Dark

- [x] Existing Aromia theme mechanism is reused.
- [x] Deep surfaces retain warm graphite/brown-black character.
- [x] Light and Dark remain one brand, not two design systems.

## 4. Responsive

- [x] Mobile architecture remains editorial rather than converting indexes into cards.
- [x] Hero uses `svh` sizing for mobile viewport behavior.
- [x] Mobile and tablet expose two sensory labels by default.
- [x] Four labels are reserved for `lg` desktop where hierarchy has enough room.
- [x] Major split layouts stack below `lg`, including Magazine, Quiz, Index and closing conversion chapter.
- [x] Tablet 768×1024 is protected structurally by the same stacked layout rather than forcing desktop splits early.

Visual pixel-level tablet approval still belongs to preview QA; this document does not claim a browser screenshot review that has not occurred.

## 5. Accessibility / motion

- [x] Global `prefers-reduced-motion` keeps reveal content visible.
- [x] Hero parallax exits for reduced-motion users.
- [x] Hero parallax runs only on hover-capable fine pointers.
- [x] Sensory note links have explicit labels, visible keyboard focus and a minimum 44px interaction height.
- [x] Decorative editorial photography uses empty alt semantics / hidden context.
- [x] Primary navigation actions remain real links/buttons.

## 6. Photography

### Provisional real photographic layer

The Home no longer relies only on CSS gradients. It currently uses existing repository-owned editorial masters:

- H01 Light preview: `/editorial/bright-soft-focus.png`
- H01 Dark preview: `/editorial/moody-closeup.png`
- H02 Light preview: `/editorial/sunlit-warm.png`
- H02 Dark preview: `/editorial/cinematic-warm.png`

These are served via `next/image`; procedural scene classes remain underneath as deterministic fallback/loading layers.

### Final asset gate

- [ ] H01 bespoke Light visually approved against ingredient anchors.
- [ ] H01 bespoke Dark visually approved against the same interaction map.
- [ ] H02 bespoke Light visually approved.
- [ ] H02 bespoke Dark visually approved.

Reason: the connected GitHub interface can verify the binary assets exist but cannot visually inspect private PNG blob content. The existing masters therefore provide preview-quality photography but are not misrepresented as having passed the final art-direction gate.

Production prompts and reject criteria are versioned in `HOME-ASSET-PROMPTS.md`.

## 7. Magazine asset strategy

- [x] Home now prefers real `imagen_portada_url` from the article API.
- [x] `.aromia-scene-editorial` remains a fallback when no cover exists.
- [x] No invented reading-time value remains in the component.

## 8. CI / technical verification

Draft PR #17 triggers `.github/workflows/v2-ci.yml`.

Verified successful CI before the provisional photography pass:
- [x] API typecheck.
- [x] Web dependency install.
- [x] Web lint.
- [x] Web typecheck.
- [x] Web production build.

The current branch head must also finish green after the final photography/a11y commits before the gate can advance from PREVIEW READY to CODE READY.

## 9. Railway

Production is intentionally untouched.

Railway `web` is sourced from `main`, not the visual branch, so PR #17 does not auto-deploy a preview. Existing production services remain on their previous successful deployments.

No production redeploy, source-branch mutation or new preview service is performed by this gate without an explicit deployment decision.

## 10. Gate decision

Current decision: **PREVIEW READY — DO NOT MERGE YET**.

To advance:
1. current-head CI green;
2. visual preview at desktop, 768×1024 tablet and 375×812 mobile;
3. Light/Dark visual check;
4. decide whether repository-owned provisional masters are strong enough for a preview release or replace them with bespoke H01/H02 masters;
5. only then mark PR #17 ready for review / merge.

Home is structurally and technically mature enough to stop redesigning by abstraction. Remaining decisions should be made from a rendered preview, not additional speculative CSS.
