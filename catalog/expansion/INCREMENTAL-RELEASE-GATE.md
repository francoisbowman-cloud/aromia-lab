# Aromia Catalog Expansion — incremental release gate

The expansion engine evaluates two different things and must not conflate them:

1. **Catalog batch safety** — whether the rows proposed for an importable draft batch are individually safe and traceable.
2. **Automation efficiency** — how much of the 100-candidate research cohort can be prepared without human remediation.

## Hard release gate

A draft batch may receive `GO` only when all hard checks pass:

- the research cohort contains at least 100 candidates;
- `AUTO_READY + REVIEW_REQUIRED + BLOCKED = total`;
- the prepared batch contains at least 10 rows;
- prepared row count exactly matches the `AUTO_READY` partition;
- every prepared row remains `quality_status=AUTO_READY`;
- every prepared row has verified provenance and a non-pending `source_url`;
- prepared trace IDs are unique;
- blocked rate remains within the configured limit;
- destructive duplicate count is zero;
- model requirement gaps are zero;
- protected inputs are unchanged;
- Postgres writes are zero.

The batch builder is additionally fail-closed: it refuses any row whose quality status is not `AUTO_READY`.

## Automation KPI

The program still targets:

- `auto_preparation_yield >= 90%`;
- `human_review_burden <= 10%`.

These remain visible in `go-no-go.json` as the automation target. Missing the target creates a remediation backlog; it does not promote unresolved rows and it does not invalidate otherwise safe `AUTO_READY` rows.

## Quarantine contract

`REVIEW_REQUIRED` and `BLOCKED` rows never enter `batch-003-prepared.csv`. They remain in the remediation queue until new evidence changes their row-level quality state.

## Production boundary

A `GO` result prepares an import candidate only. It does not write to Postgres, modify the master catalog, or publish a perfume. Database import remains a separate transactional action after integration validation and explicit authorization.
