import Image from "@tiptap/extension-image";

/** An atomic image with editable alternative text and a visible source caption. */
export const CaptionedImage = Image.extend({
  addAttributes() {
    return { ...this.parent?.(), caption: { default: "", renderHTML: () => ({}) } };
  },
  parseHTML() {
    return [{
      tag: "figure[data-editorial-image]",
      getAttrs: (element) => {
        const image = element.querySelector("img");
        if (!image) return false;
        return { src: image.getAttribute("src"), alt: image.getAttribute("alt"), title: image.getAttribute("title"), caption: element.querySelector("figcaption")?.textContent ?? "" };
      },
    }, ...(this.parent?.() ?? [])];
  },
  renderHTML({ node, HTMLAttributes }) {
    return ["figure", { "data-editorial-image": "" }, ["img", HTMLAttributes], ["figcaption", {}, node.attrs.caption ?? ""]];
  },
});
