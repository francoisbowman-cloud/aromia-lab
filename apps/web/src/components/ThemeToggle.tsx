"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const STORAGE_KEY = "aromia_theme";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage puede fallar en modo privado — el tema simplemente no
    // persiste entre sesiones, no es un caso que rompa la UI.
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  // El script anti-flash en layout.tsx ya fija data-theme antes del primer
  // paint; este estado solo se usa para el ícono, así que arranca en "light"
  // (el default del script) y se sincroniza real en el primer render cliente.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      className={
        "inline-flex h-9 w-9 items-center justify-center rounded-full text-muted outline-none transition hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
        (className ?? "")
      }
    >
      {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}
