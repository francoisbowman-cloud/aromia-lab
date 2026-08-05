export interface ArticleBlock {
  type: "p" | "h2" | "blockquote" | "other";
  html: string;
  text: string;
}

export interface ArticlePage {
  kicker: string;
  blocks: ArticleBlock[];
}

const CHARS_PER_PAGE = 550;
const DEFAULT_KICKER = "LECTURA";

/**
 * Splits contenido_html into a static array of pages for the page-flip
 * reader. There are no page markers in the CMS (Tiptap only produces flat
 * HTML), so pages are grouped by a character budget rather than measured
 * layout — the spec calls for a static React structure, not runtime text
 * generation, so an approximate budget is enough.
 */
export function paginateArticle(html: string | undefined | null): ArticlePage[] {
  if (!html || typeof window === "undefined") return [];

  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks: ArticleBlock[] = Array.from(doc.body.children).map((el) => {
    const tag = el.tagName.toLowerCase();
    const type: ArticleBlock["type"] = /^h[1-6]$/.test(tag)
      ? "h2"
      : tag === "p"
        ? "p"
        : tag === "blockquote"
          ? "blockquote"
          : "other";
    return { type, html: el.outerHTML, text: el.textContent ?? "" };
  });

  const pages: ArticlePage[] = [];
  let currentKicker = DEFAULT_KICKER;
  let currentBlocks: ArticleBlock[] = [];
  let currentChars = 0;

  function flush() {
    if (currentBlocks.length > 0) {
      pages.push({ kicker: currentKicker, blocks: currentBlocks });
      currentBlocks = [];
      currentChars = 0;
    }
  }

  for (const block of blocks) {
    if (block.type === "h2") {
      flush();
      currentKicker = block.text.toUpperCase();
    }

    if (currentChars > 0 && currentChars + block.text.length > CHARS_PER_PAGE) {
      flush();
    }

    currentBlocks.push(block);
    currentChars += block.text.length;
  }
  flush();

  return pages.length > 0 ? pages : [{ kicker: DEFAULT_KICKER, blocks: [] }];
}
