"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/catalogo", label: "Fragancias", section: "catalog" },
  { href: "/perfumistas", label: "Perfumistas", section: "perfumers" },
  { href: "/academia", label: "Academia", section: "academia" },
  { href: "/magazine", label: "Revista", section: "magazine" },
  { href: "/quiz", label: "Quiz", section: "quiz" },
] as const;

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return <Link href={href} aria-label={label} className="grid h-10 w-10 place-items-center text-ink transition hover:text-gold-contrast focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">{children}</Link>;
}

export default function NavBar() {
  const pathname = usePathname();
  return <header className="sticky top-0 z-50 border-b border-line bg-[rgba(251,248,243,.94)] backdrop-blur-xl dark:bg-[rgba(14,12,10,.94)] print:hidden print:static"><nav className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 lg:px-10">
    <Link href="/" className="font-display text-[26px] tracking-[.08em] text-ink lg:text-[30px]" aria-label="Aromia — Inicio">AROMIA</Link>
    <ul className="hidden items-center gap-6 font-display text-[15px] lg:flex xl:gap-9">{links.map((link) => { const active = link.section === "catalog" ? pathname === "/catalogo" || pathname.startsWith("/catalogo/") : link.section === "perfumers" ? pathname === "/perfumistas" || pathname.startsWith("/perfumistas/") : pathname === link.href || pathname.startsWith(`${link.href}/`); return <li key={link.label}><Link href={link.href} aria-current={active ? "page" : undefined} className={`nav-link border-b pb-1 transition ${active ? "border-gold text-ink" : "border-transparent text-muted hover:text-ink"}`}>{link.label}</Link></li>; })}</ul>
    <div className="hidden items-center gap-0.5 sm:flex"><IconLink href="/buscar" label="Buscar en Aromia"><svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-none stroke-current" strokeWidth="1.5"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg></IconLink><IconLink href="/quiz" label="Encontrar mi perfume"><svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-none stroke-current" strokeWidth="1.5"><path d="M12 3 9.8 8.8 4 11l5.8 2.2L12 19l2.2-5.8L20 11l-5.8-2.2L12 3Z"/></svg></IconLink><IconLink href="/club" label="Club Aromia"><svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-none stroke-current" strokeWidth="1.5"><path d="M20.8 5.8c-2-2-5.2-1.9-7.2.1L12 7.5l-1.6-1.6c-2-2-5.2-2.1-7.2-.1-2 2-2 5.2 0 7.2L12 21l8.8-8c2-2 2-5.2 0-7.2Z"/></svg></IconLink><ThemeToggle className="ml-1" /></div>
    <div className="flex items-center gap-1 sm:hidden"><ThemeToggle /><details className="relative"><summary className="cursor-pointer list-none px-2 py-3 font-plex text-[10px] uppercase tracking-[.16em] text-ink">Menú</summary><ul className="absolute right-0 z-10 mt-1 flex w-56 flex-col border border-line bg-[#fffdf8]/98 p-3 font-display text-base shadow-lux backdrop-blur-xl dark:bg-[#120f0c]/98">{links.map((link) => <li key={`${link.label}-mobile`}><Link href={link.href} className="block border-b border-line px-2 py-3 text-ink">{link.label}</Link></li>)}<li><Link href="/buscar" className="block border-b border-line px-2 py-3 text-ink">Buscar</Link></li><li><Link href="/club" className="block px-2 py-3 text-gold-contrast">Club Aromia</Link></li></ul></details></div>
  </nav></header>;
}
