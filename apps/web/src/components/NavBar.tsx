"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/perfumes", label: "Perfumes" },
  { href: "/articulos", label: "Magazine" },
  { href: "/quiz", label: "Quiz" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line bg-surface">
      <nav className="mx-auto flex max-w-5xl items-center justify-between p-4 lg:px-10">
        <Link href="/" className="font-display text-lg tracking-[.08em] text-ink">
          AROMIA
        </Link>

        <ul className="hidden gap-8 font-sans text-sm sm:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "text-gold-contrast"
                      : "text-muted transition hover:text-ink"
                  }
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <details className="sm:hidden">
          <summary className="cursor-pointer list-none font-sans text-sm text-ink">
            Menú
          </summary>
          <ul className="absolute left-0 right-0 z-10 mt-4 flex flex-col gap-1 border-b border-line bg-surface px-4 pb-4 font-sans text-sm">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`block py-2 ${active ? "text-gold-contrast" : "text-muted"}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </details>
      </nav>
    </header>
  );
}
