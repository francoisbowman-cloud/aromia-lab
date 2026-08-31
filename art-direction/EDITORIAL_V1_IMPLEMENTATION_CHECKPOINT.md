# AROMIA EDITORIAL v1 — IMPLEMENTATION CHECKPOINT

IMPLEMENTATION: IN_PROGRESS
SURFACE: `/editorial-v1`
PRODUCTION: HOLD

## Implemented in isolated branch

- Living-cover route with Amouage lead and asymmetric Ambroxan/Ropion counterpoints.
- Editorial navigation hypothesis.
- Discovery interruption.
- Three article routes under `/editorial-v1/[slug]`.
- Story-specific composition behavior rather than a single visual template.
- Desktop/mobile CSS compositions.
- `prefers-reduced-motion` baseline inherited on the Editorial v1 surface.
- Semantic visual placeholders/abstract CSS fields instead of fabricated product or documentary assets.

## Deliberately not done

- No `main` merge.
- No production deploy.
- No fake bottle packshots.
- No fabricated Dominique Ropion portrait.
- No fabricated historical Sultan/Guy Robert scene.
- No claim that CSS interpretive material fields are documentary images.

## Important implementation note

The current article route uses condensed implementation copy to establish composition. Canonical editorial drafts remain the source of truth and must be integrated in full by Code before publication. Do not treat the condensed route copy as a replacement draft.

## Next gates

1. Code checkout/build/typecheck/lint on `feat/editorial-v1-implementation`.
2. Render `/editorial-v1` plus all three article routes at desktop and mobile.
3. Replace only approved visual slots with authentic/documentary or explicitly interpretive assets.
4. Browser QA and crop/hierarchy review.
5. Final OMNI only after rendered evidence.

Until those gates pass, status remains `PRODUCTION: HOLD`.
