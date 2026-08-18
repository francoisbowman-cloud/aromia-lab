# Batch 003 import plan

Execution order:
1. PR CI detects `catalog/imports/batch-003.csv` and requires a fresh GO.
2. Merge only if catalog, v2 CI and strict audit pass.
3. Execute `apps/api/src/db/importCatalogBatch003.ts` against production with the existing `DATABASE_URL`.
4. Run `apps/api/src/db/verifyCatalogBatch003.ts`.
5. Verify API list count and all 10 slugs.
6. Verify web catalog/PDP/runtime and product-image integrity.
7. Accept if all checks pass; otherwise use the guarded rollback only for a data-integrity failure.
