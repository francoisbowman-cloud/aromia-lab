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
  contenido_html: '<p>Primer párrafo con <a href="https://example.org/fuente">una fuente</a>.</p><p>Segundo.</p>',
} as unknown as Article;

let root: Root | null = null;
afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function tab(shift = false) {
  const e = new KeyboardEvent("keydown", { key: "Tab", shiftKey: shift, cancelable: true, bubbles: true });
  document.dispatchEvent(e);
  return e;
}

async function open() {
  window.matchMedia ??= ((q: string) => ({
    matches: false, media: q, addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  const opener = document.createElement("button");
  opener.textContent = "Iniciar lectura";
  document.body.appendChild(opener);
  opener.focus();
  const host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
  const onClose = vi.fn();
  await act(async () => { root!.render(createElement(PageFlipReader, { article, onClose })); });
  return { opener, host, onClose };
}

describe("PageFlipReader: comportamiento de diálogo modal", () => {
  it("expone rol, modalidad y nombre accesible", async () => {
    const { host } = await open();
    const dialog = host.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog!.getAttribute("aria-modal")).toBe("true");
    expect(dialog!.getAttribute("aria-label")).toBe("Lector de Prueba de lector");
  });

  it("mueve el foco al botón Cerrar y bloquea el scroll de la página", async () => {
    const { host } = await open();
    expect(document.activeElement).toBe(host.querySelector("button"));
    expect(document.activeElement?.textContent).toContain("Cerrar");
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("mantiene el foco dentro del lector con Tab y Shift+Tab", async () => {
    const { host } = await open();
    const focusable = Array.from(host.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    expect(first.textContent).toContain("Cerrar");
    expect(last.getAttribute("aria-label")).toBe("Página siguiente");

    last.focus();
    const forward = tab();
    expect(forward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);

    const backward = tab(true);
    expect(backward.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });

  it("recupera el foco si este escapa fuera del lector", async () => {
    const { opener, host } = await open();
    opener.focus();
    const e = tab();
    expect(e.defaultPrevented).toBe(true);
    expect(host.contains(document.activeElement)).toBe(true);
  });

  it("devuelve el foco al botón que lo abrió y restaura el scroll al cerrar", async () => {
    const { opener } = await open();
    expect(document.activeElement).not.toBe(opener);
    await act(async () => { root!.unmount(); });
    root = null;
    expect(document.activeElement).toBe(opener);
    expect(document.body.style.overflow).toBe("");
  });
});
