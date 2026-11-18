// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement, act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { PageFlipReader } from "./PageFlipReader";
import type { Article } from "@/lib/types";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const article = {
  titulo: "Prueba de lector",
  autor: "Aromia",
  publicado_en: "2026-01-02T00:00:00Z",
  contenido_html: "<p>Primer párrafo.</p><h2>Sección</h2><p>Segundo párrafo.</p>",
} as unknown as Article;

let root: Root | null = null;

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.innerHTML = "";
});

describe("PageFlipReader bajo React 19", () => {
  it("monta el libro sin errores de consola y cierra con Escape", async () => {
    window.matchMedia ??= ((q: string) => ({
      matches: false, media: q, addEventListener() {}, removeEventListener() {},
      addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const onClose = vi.fn();
    const host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);

    await act(async () => {
      root!.render(createElement(PageFlipReader, { article, onClose }));
    });

    expect(host.textContent).toContain("Prueba de lector");
    expect(host.textContent).toContain("Primer párrafo.");
    expect(errors).not.toHaveBeenCalled();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    errors.mockRestore();
  });
});
