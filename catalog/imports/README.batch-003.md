# Batch 003 release boundary

This directory contains the first post-hardening import candidate accepted by OMNI after manual artifact inspection.

Release requirements before any Postgres write:
1. `catalog/imports/batch-003.csv` must match SHA-256 `e97833db0a7555c67cd7a84342fdca844efc1ae876fcdeabfa4512611a2ad32b`.
2. Catalog Expansion Engine CI must detect release intent and return GO with `minPreparedRows=10` unchanged.
3. The 10 rows must remain `AUTO_READY`, source-verified, NEW, unique and free of identity/flanker conflicts.
4. The transactional importer must refuse pre-existing target slugs.
5. Runtime verification must pass after import; otherwise the guarded rollback path is used.
