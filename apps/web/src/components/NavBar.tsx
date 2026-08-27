"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/magazine", label: "Magazine" },
  { href: "/descubrir", label: "Discovery" },
  { href: "/academia", label: "Academia" },
  { href: "/club", label: "Club" },
] as const;

export default function NavBar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[rgba(247,245,240,.94)] backdrop-blur-xl dark:bg-[rgba(14,19,17,.94)] print:static print:hidden">
      <nav className="mx-auto flex h-[68px] max-w-[1520px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="inline-flex min-h-11 items-center font-display text-[25px] tracking-[.08em] text-ink lg:text-[28px]" aria-label="Aromia — Inicio">
          AROMIA
        </Link>

        <ul className="hidden items-center gap-6 font-sans text-[13px] lg:flex xl:gap-8">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center border-b transition-colors ${active ? "border-[#5a6b54] text-ink" : "border-transparent text-muted hover:text-ink"}`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/buscar" className="inline-flex min-h-11 items-center font-sans text-[13px] text-muted transition hover:text-ink">Buscar</Link>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <details className="relative">
            <summary className="flex min-h-11 cursor-pointer list-none items-center px-2 font-plex text-xs uppercase tracking-[.14em] text-ink">Menú</summary>
            <div className="absolute right-0 z-10 mt-1 w-60 border border-line bg-[#f7f5f0] p-4 shadow-[0_20px_60px_rgba(14,19,17,.12)] dark:bg-[#0e1311]">
              <ul className="font-display text-xl">
                {links.map((link) => (
                  <li key={`${link.href}-mobile`}><Link href={link.href} className="flex min-h-12 items-center border-b border-line text-ink">{link.label}</Link></li>
                ))}
                <li><Link href="/buscar" className="flex min-h-12 items-center text-muted">Buscar</Link></li>
              </ul>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
