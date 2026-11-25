// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { CaptionedImage } from "./captionedImage";

function make(content: string) {
  return new Editor({ element: document.createElement("div"), extensions: [StarterKit, CaptionedImage], content });
}

describe("editor HTML serialization (Tiptap 3.34)", () => {
  it("rehydrates legacy plain HTML (headings, lists, quotes, links, formatting) without losing text", () => {
    const html = '<h2>Título</h2><p>Un <strong>párrafo</strong> con <em>énfasis</em> y un <a href="https://example.com/x">enlace</a>.</p><ul><li><p>uno</p></li><li><p>dos</p></li></ul><blockquote><p>cita</p></blockquote>';
    const out = make(html).getHTML();
    for (const piece of ["<h2>Título</h2>", "<strong>párrafo</strong>", "<em>énfasis</em>", 'href="https://example.com/x"', "<li><p>uno</p></li>", "<blockquote><p>cita</p></blockquote>"]) {
      expect(out).toContain(piece);
    }
  });

  it("is idempotent: a second save/rehydrate cycle yields identical HTML", () => {
    const first = make('<h3>A</h3><p>texto <a href="https://example.com">l</a></p><ol><li><p>x</p></li></ol>').getHTML();
    expect(make(first).getHTML()).toBe(first);
  });

  it("round-trips captioned editorial images with alt, src and caption", () => {
    const html = '<figure data-editorial-image=""><img src="/editorial/a.webp" alt="Bergamota" title="t"><figcaption>Fuente: archivo</figcaption></figure>';
    const out = make(html).getHTML();
    expect(out).toContain('data-editorial-image');
    expect(out).toContain('src="/editorial/a.webp"');
    expect(out).toContain('alt="Bergamota"');
    expect(out).toContain("<figcaption>Fuente: archivo</figcaption>");
    expect(make(out).getHTML()).toBe(out);
  });

  it("parses legacy bare <img> into a captioned figure instead of dropping it", () => {
    const out = make('<p>x</p><img src="/y.webp" alt="y">').getHTML();
    expect(out).toContain('src="/y.webp"');
  });

  it("does not turn an own __proto__ attribute into DOM attributes (GHSA-cp6q-959q-f8rh)", () => {
    const out = make('<p>x</p><img src="/z.webp" alt="z" __proto__="onerror=alert(1)">').getHTML();
    expect(out).not.toMatch(/onerror/i);
  });
});
