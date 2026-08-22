/**
 * Aromia's local, runtime-independent DSI vocabulary.
 *
 * This is deliberately data-only: it describes the design system discovered
 * in this product without importing OMNI or creating a runtime dependency on
 * OMNI. Components should consume semantic CSS/Tailwind tokens rather than
 * inventing new visual primitives.
 */

export const aromiaDesignSystem = {
  version: "1.0.0",
  source: "discovered-from-aromia",
  foundation: {
    colors: ["paper", "surface", "soft", "ink", "muted", "line", "primary", "focus", "danger"],
    typography: ["display", "sans", "plex"],
    radii: ["control", "card", "table", "full"],
    motion: ["fast", "standard", "slow", "none"],
  },
  principles: [
    "repetir relaciones, no layouts",
    "claridad antes que ornamentación",
    "fidelidad del producto antes que limpieza estética",
    "espacio y agrupación antes que divisores",
    "motion con propósito y reduced-motion como contrato",
  ],
  boundaries: {
    omniCore: "independent",
    admin: "scoped-subsystem",
    print: "scoped-subsystem",
  },
} as const;

export type AromiaDesignSystem = typeof aromiaDesignSystem;
