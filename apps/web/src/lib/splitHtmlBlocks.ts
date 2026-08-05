export interface HtmlBlock {
  tag: string;
  html: string;
}

/**
 * Splits a flat HTML string (Tiptap output — sibling block tags, no nested
 * blocks) into individual top-level block fragments. Regex-based rather than
 * DOMParser so it also runs server-side (PrintableArticle is a Server
 * Component); safe here because the admin editor's toolbar only ever
 * produces p / h1-h6 / ul / ol / blockquote as top-level siblings.
 */
export function splitHtmlBlocks(html: string | undefined | null): HtmlBlock[] {
  if (!html) return [];
  const matches = html.match(/<(h[1-6]|blockquote|ul|ol|p)[^>]*>[\s\S]*?<\/\1>/gi) ?? [];
  return matches.map((fragment) => {
    const tag = fragment.match(/^<(\w+)/)?.[1].toLowerCase() ?? "p";
    return { tag, html: fragment };
  });
}
