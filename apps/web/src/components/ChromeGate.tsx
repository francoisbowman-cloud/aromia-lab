"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Oculta el chrome global (NavBar / Footer) en las superficies editoriales que
 * traen su propia continuidad (barra fija de 52px + indicador de acto), según
 * Visual Grammar Sheet §8.
 *
 * Hoy: el espécimen "El Coleccionista" y /design-lab. NO se aplica a todo
 * /magazine — el pipeline público /magazine/[slug] lo maneja el editor.
 */

const EDITORIAL_PREFIXES = ["/design-lab", "/magazine/el-coleccionista"];

export function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const isEditorial = EDITORIAL_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (isEditorial) return null;
  return <>{children}</>;
}
