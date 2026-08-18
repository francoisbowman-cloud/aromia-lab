# Aromia Material Library

Canonical collaboration dataset: `assets/aromia-materials/`.

Start here:

- Inventory/editing: `assets/aromia-materials/materials.csv`
- Integrity/automation: `assets/aromia-materials/manifest.json`
- Agent instructions: `assets/aromia-materials/CLAUDE.md`
- Operating contract: `assets/aromia-materials/README.md`
- Binary ingest: `assets/aromia-materials/INGEST.md`
- Next materials: `assets/aromia-materials/priority-backlog.json`

For release/integration validation run:

```bash
node scripts/materials/validate-material-library.mjs --require-binaries
```

This library is editorial material vocabulary, never canonical perfume identity.
