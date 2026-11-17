# Aromia editorial fonts

These are the existing Newsreader, Archivo and IBM Plex Sans families, served
locally with `next/font/local` so builds and readers do not need Google Fonts.
Newsreader includes upright and italic optical-size/weight variable fonts;
Archivo and IBM Plex Sans include their weight/width axes. No glyphs were removed.

Sources are the official `google/fonts` repository pinned in `provenance.json`.
The manifest records upstream TTF and delivered WOFF2 SHA-256 hashes. WOFF2 is a
lossless format conversion performed with fontTools; accompanying OFL files
retain the upstream copyright and license notices. No new font license is needed.
The pinned font versions may differ from Google's dynamically served CSS version;
new browser QA is required before treating typography as a production-approved match.

Regeneration is an asset maintenance operation, not an install step: fetch each
pinned source, verify its `source_sha256`, load with `fontTools.ttLib.TTFont`, set
`font.flavor = 'woff2'`, save and update output hashes after reviewing the result.
Keep the license files with redistributed binaries.

Full glyph coverage costs about 860 KiB combined before browser caching. Assess
real loading/performance budgets before considering any future licensed subset;
do not replace faces with system fallbacks just to make a benchmark pass.
