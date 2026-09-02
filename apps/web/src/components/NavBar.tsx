"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SITE_NAV, navItemIsActive } from "@/lib/siteNavigation";

export default function NavBar() {
  const pathname = usePathname();
  const coverMode = pathname === "/";

  return (
    <header className={`sticky top-0 z-50 border-b border-line backdrop-blur-xl print:static print:hidden ${coverMode ? "bg-[var(--aromia-chrome-bg)]" : "bg-[var(--aromia-chrome-bg)]"}`}>
      <nav className="mx-auto flex h-[68px] max-w-[1520px] items-center justify-between px-5 sm:px-8 lg:px-12" aria-label="Navegación principal">
        <Link href="/" className="inline-flex min-h-11 items-center font-display text-[25px] tracking-[.08em] text-ink lg:text-[28px]" aria-label="Aromia — Portada">
          AROMIA
        </Link>

        <ul className="hidden items-center gap-5 font-sans text-[13px] lg:flex xl:gap-7">
          {SITE_NAV.map((item) => {
            const active = navItemIsActive(pathname, item);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`nav-link ${active ? "text-ink" : "text-muted hover:text-ink"}`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/buscar" aria-current={pathname === "/buscar" ? "page" : undefined} className="nav-link font-sans text-[13px] text-muted hover:text-ink">Buscar</Link>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <Link href="/buscar" aria-label="Buscar" className="inline-flex min-h-11 min-w-11 items-center justify-center font-display text-xl text-ink">⌕</Link>
          <ThemeToggle />
          <details className="relative">
            <summary className="flex min-h-11 cursor-pointer list-none items-center px-2 font-plex text-xs uppercase tracking-[.14em] text-ink">Menú</summary>
            <div className="absolute right-0 z-10 mt-1 w-64 border border-line bg-[var(--aromia-paper-clean)] p-4 shadow-[0_20px_60px_var(--aromia-chrome-shadow)]">
              <ul className="font-display text-xl">
                {SITE_NAV.map((item) => {
                  const active = navItemIsActive(pathname, item);
                  return <li key={`${item.href}-mobile`}><Link href={item.href} aria-current={active ? "page" : undefined} className={`flex min-h-12 items-center border-b border-line ${active ? "text-ink" : "text-muted"}`}>{item.label}</Link></li>;
                })}
                <li><Link href="/buscar" className="flex min-h-12 items-center text-muted">Buscar</Link></li>
              </ul>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
