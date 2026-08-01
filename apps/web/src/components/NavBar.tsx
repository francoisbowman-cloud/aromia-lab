"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/magazine", label: "Magazine" },
  { href: "/academia", label: "Academia" },
  { href: "/quiz", label: "Quiz" },
  { href: "/club", label: "Club" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur-md print:hidden print:static">
      <nav className="mx-auto flex max-w-5xl items-center justify-between p-4 lg:px-10">
        <Link href="/" className="font-display text-lg tracking-[.08em] text-ink">
          AROMIA
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          <ul className="flex gap-6 font-sans text-sm">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      "nav-link " + (active ? "text-ink" : "text-muted transition hover:text-ink")
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ThemeToggle className="ml-2" />
        </div>

        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <details className="relative">
            <summary className="nav-link cursor-pointer list-none font-sans text-sm text-ink">
              Menú
            </summary>
            <ul className="absolute right-0 z-10 mt-2 flex w-48 flex-col gap-1 rounded-card border border-line bg-surface p-2 font-sans text-sm shadow-lux">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`nav-link block ${active ? "text-ink" : "text-muted"}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </details>
        </div>
      </nav>
    </header>
  );
}
