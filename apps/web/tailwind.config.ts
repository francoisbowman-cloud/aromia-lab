import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        paper: "var(--bg)",
        surface: "var(--surface)",
        ink: "var(--text)",
        muted: "var(--muted)",
        line: "var(--line)",
        soft: "var(--soft)",
        gold: {
          DEFAULT: "var(--gold)",
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
          DEFAULT: "var(--destructive)",
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
      },
      borderRadius: {
        card: "28px",
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
