import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../editorial.css";

/**
 * /design-lab — superficie editable y permanente del sistema editorial de Aromia.
 *
 * No es una guía de estilo pública. Es el banco de trabajo de ChatGPT, Code,
 * OMNI y el Publisher para ver Foundation + primitivas en condiciones reales de
 * navegador. `noindex` a propósito; fuera de nav y de sitemap.
 */

export const metadata: Metadata = {
  title: "Design Lab",
  robots: { index: false, follow: false },
};

export default function DesignLabLayout({ children }: { children: ReactNode }) {
  return <div className="editorial-root">{children}</div>;
}
