# Batch 003 release note

This is the first import candidate accepted after the post-#73 catalog hardening loop.

Evidence delta:
- AUTO_READY: 4 -> 10
- REVIEW_REQUIRED: 96 -> 90
- BLOCKED: 0 -> 0
- batch decision: NO_GO -> GO
- `minPreparedRows`: unchanged at 10
- rejected intermediate GO: 1 (Hacivat/Hacivat X identity leak)
- accepted artifact after correction: SHA-256 `e97833db0a7555c67cd7a84342fdca844efc1ae876fcdeabfa4512611a2ad32b`

No threshold reduction or fabricated publication fields were used to reach GO.
