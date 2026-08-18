# Batch 003 import contract

`importCatalogBatch003.ts` is intentionally insert-only and hash-pinned to the accepted `catalog/imports/batch-003.csv` artifact.

Safety properties:
- requires the accepted SHA-256 before connecting data to the import path;
- requires exactly 10 `AUTO_READY`, source-verified, NEW rows;
- requires complete top/middle/base note pyramids;
- aborts before the transaction if any target slug already exists;
- inserts only with `catalog_source = 'batch-003'`;
- verifies all 10 rows inside the transaction before COMMIT;
- verifies total and published counts increased by exactly 10 after COMMIT;
- rolls back the transaction on any pre-commit failure.

`rollbackCatalogBatch003.ts` is separately guarded by `ROLLBACK_BATCH_003=YES` and refuses to act unless exactly 10 rows exist with `catalog_source = 'batch-003'`.
