# Aromia — Project progress and verified gates

The private admin now includes `/admin/progreso` (full milestone checklist) and an abbreviated progress bar on `/admin/operaciones`. The progress model is versioned in `apps/web/src/lib/projectProgress.ts`, with tests ensuring that only **verified** gates contribute to the numerator.

## Measurement policy
- At snapshot **2026-11-17**, 1 of 10 defined milestone gates has closed with explicit repository evidence: #186 was merged to main. The 10% display is **verified gate closure**, not a forecast of effort remaining, completeness of the website or confidence of production launch.
- In-progress branches, passing component CI, incomplete visual rights evidence, runtime pilots and editorial backlogs do **not** increment the numerator.
- Blocked/planned statuses remain visible with actionable next checks. Stage metadata is a manually reconciled, source-controlled snapshot. It is **not** real-time GitHub, production or Railway telemetry.
- Evidence links point to the relevant PR; GitHub CI job results must still be checked per commit. PR #187 onward remains unmerged unless later independently confirmed.
- To advance a gate, inspect the source, validate completion criteria, record a durable result, and update this file and `projectProgress.ts` in a reviewed commit. Never change the percentage just to show momentum.

## Safety
The progress view is private to the existing admin layout, consumes no paid external services, stores no secrets and does not grant publishing or merging authority. It does not alter the source-only YouTube channel policy: **only the Publisher selects channels; no registry is auto-populated**.

## Existing visual-review feature
PR #194 inspector web CI initially found two test/typing issues; they were corrected without weakening lint, with commit `9cdfcec` for Sharp typing and `6282de9` for the reserved variable. Latest full web CI must still be checked before calling this chain green. Deployment and full browser QA remain separate.
