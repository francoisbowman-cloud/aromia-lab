# Batch 003 preflight

The production importer is permitted to proceed only if all of the following are true at runtime:
- accepted CSV SHA-256 matches the pinned hash;
- exactly 10 rows parse;
- every row is `AUTO_READY`, `source_verified=true`, and `catalog_relation=NEW`;
- every row has slug/name/brand/concentration/gender/source URL/high confidence;
- every row has non-empty top/middle/base notes;
- all 10 slugs are unique;
- none of the 10 slugs already exists in Postgres.

Any failure aborts before COMMIT. No partial batch is accepted.
