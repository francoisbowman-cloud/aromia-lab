import path from "node:path";

import type { Config } from "tailwindcss";

// Los globs de `content` se resuelven contra el CWD del proceso, no contra este
// archivo. Railway construye con root apps/web, pero lanzar el dev server desde
// la raíz del monorepo (next dev apps/web) dejaba el escaneo vacío y el sitio
// salía sin ninguna utilidad de Tailwind. Anclarlos acá los vuelve hermético.
const src = path.join(__dirname, "src");

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    path.join(src, "pages/**/*.{js,ts,jsx,tsx,mdx}"),
    path.join(src, "components/**/*.{js,ts,jsx,tsx,mdx}"),
    path.join(src, "app/**/*.{js,ts,jsx,tsx,mdx}"),
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Los tokens con consumidores de opacidad (bg-paper/[.88], text-ink/70,
        // bg-gold/15, text-muted/40…) se declaran con el slot <alpha-value> sobre
        // el canal RGB hermano (--*-rgb, definido junto a cada hex en los CSS de
        // tokens). Sin esto Tailwind v3.4 no genera los utilities de opacidad
        // para un color que es var() pelado. `bg-paper` sin modificador compila a
        // rgb(var(--bg-rgb) / 1), color idéntico a var(--bg).
        paper: "rgb(var(--bg-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        ink: "rgb(var(--text-rgb) / <alpha-value>)",
        muted: "rgb(var(--muted-rgb) / <alpha-value>)",
        line: "var(--line)",
        soft: "rgb(var(--soft-rgb) / <alpha-value>)",
        gold: {
          DEFAULT: "rgb(var(--gold-rgb) / <alpha-value>)",
          light: "#B68A44",
          dark: "#C8A86B",
          contrast: "var(--gold-contrast)",
        },
        // Tokens semánticos de shadcn/ui — alias sobre la paleta de arriba,
        // usados por los componentes base en components/ui/*.
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive-rgb) / <alpha-value>)",
          foreground: "var(--destructive-foreground)",
        },
        admin: {
          bg: "#F6F4EF",
          surface: "#FFFFFF",
          sidebar: "#111315",
          border: "#E8E1D5",
          text: "#171717",
          muted: "#6F6A60",
          success: "#1F8F58",
          "success-bg": "#E7F6ED",
          "success-text": "#146B42",
          warning: "#B87012",
          "warning-bg": "#FFF1DB",
          "warning-text": "#8A560D",
          danger: "#B4443C",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-body)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        plex: ["var(--font-plex)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        // Sistema "Aromia Lujo" (dc.html importado 01/08): radio casi recto
        // y deliberadamente sobrio en tarjetas/paneles — reemplaza el 28px
        // anterior. Píldoras/chips/botones circulares siguen en rounded-full
        // (999px), sin cambios.
        card: "2px",
        table: "16px",
        "admin-card": "14px",
      },
      boxShadow: {
        lux: "0 22px 70px rgba(30,23,13,.12)",
        admin: "0 10px 30px rgba(28,24,18,.08)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
