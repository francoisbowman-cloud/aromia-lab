import matter from "gray-matter";
import sanitizeHtml from "sanitize-html";

/** Public readers receive story text and insertion markers, never preparation notes. */
export function publicStoryMarkdown(source: string | null): string | null {
  if (!source) return null;
  const parsed = matter(source);
  const heading = /^# [^\r\n]+\r?$/m.exec(parsed.content);
  if (!heading) return null;
  const lines = parsed.content.slice(heading.index).split(/\r?\n/);
  const visible: string[] = [];
  let fence: string | null = null;
  let visualNotes = false;
  for (const line of lines) {
    const trimmed = line.trim();
    const delimiter = /^(?:```|~~~)/.exec(trimmed)?.[0];
    if (delimiter) { fence = fence === delimiter ? null : fence ?? delimiter; continue; }
    if (fence) continue;
    if (/^Nota para Code:/i.test(trimmed)) break;
    if (trimmed === "[AROMIA_VISUAL_OPPORTUNITY]") {
      visible.push(trimmed); visualNotes = true; continue;
    }
    if (visualNotes) { if (!trimmed) { visible.push(""); visualNotes = false; } continue; }
    visible.push(line);
  }
  const serie = typeof parsed.data.serie === "string" ? parsed.data.serie : "Historias";
  return `---\nserie: ${JSON.stringify(serie)}\n---\n${visible.join("\n").trim()}`;
}

export function synchronizeStoryTitle(source: string, title: string): string {
  return source.replace(/^titulo:[^\r\n]*$/m, `titulo: ${JSON.stringify(title)}`)
    .replace(/^# [^\r\n]+\r?$/m, `# ${title}`);
}

export function publicArticleHtml(html: string | null): string | null {
  if (!html) return html;
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "h2", "h3", "h4", "strong", "em", "s", "u", "ul", "ol", "li", "blockquote", "a", "img", "figure", "figcaption", "hr", "pre", "code", "table", "thead", "tbody", "tr", "th", "td"],
    allowedAttributes: { a: ["href", "title", "target", "rel"], img: ["src", "alt", "title", "width", "height", "loading"], td: ["colspan", "rowspan"], th: ["colspan", "rowspan"] },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }), img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }) },
  });
}
