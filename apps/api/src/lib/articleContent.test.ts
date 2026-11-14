import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { publicArticleHtml, publicStoryMarkdown, synchronizeStoryTitle } from "./articleContent";

test("public stories retain headings and visual insertion order without preparation text", () => {
  const dir = resolve(__dirname, "../../../../drafts");
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const raw = readFileSync(resolve(dir, file), "utf8");
    const result = publicStoryMarkdown(raw);
    if (!/^# /m.test(raw)) { assert.equal(result, null); continue; }
    assert(result?.includes(/^# ([^\r\n]+)/m.exec(raw)![0]), file);
    assert(!/EDITORIAL: READY|COWORK_STAGE:|AUTHOR_INPUT_OPPORTUNITY|Narrative purpose:|Nota para Code:|batch_100_item:/.test(result!), file);
  }
});
test("title edits synchronize the actual reader heading, keeping preparation notes private", () => {
  const raw = '---\ntitulo: Original\nserie: Materia\n---\nPrivate preparation\n# Original\n\nBody text';
  const edited = synchronizeStoryTitle(raw, 'Título con "comillas"');
  assert(edited.includes('Private preparation'));
  const visible = publicStoryMarkdown(edited)!;
  assert(visible.includes('# Título con "comillas"'));
  assert(!visible.includes('Private preparation'));
});
test("HTML publishing preserves captioned images and formatting while removing executable markup", () => {
  const result = publicArticleHtml('<h2>Lectura</h2><figure><img src="/uploads/articles/image.png" alt="Resina" onerror="alert(1)"><figcaption>Fuente y autor</figcaption></figure><a href="javascript:alert(1)">Enlace</a><script>alert(2)</script><iframe src="https://example.com"></iframe>')!;
  assert(result.includes('<h2>Lectura</h2>'));
  assert(result.includes('<figcaption>Fuente y autor</figcaption>'));
  assert(result.includes('src="/uploads/articles/image.png"'));
  assert(!/onerror|javascript:|script|iframe|alert/.test(result));
});
