"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/catalogo", label: "Catálogo" },
  { href: "/admin/magazine", label: "Magazine" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="sticky top-0 flex h-screen w-[240px] flex-col bg-admin-sidebar p-4 text-white">
      <div className="flex items-center gap-2 px-2 pb-6">
        <span className="font-display text-lg tracking-[.12em] text-gold-dark">AROMIA</span>
        <span className="font-sans text-[9px] tracking-[.18em] text-white/50">2.0</span>
      </div>

      <nav className="grid gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-3 py-2.5 font-sans text-sm ${
                active ? "bg-gold/20 text-white" : "text-white/70 hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-4">
        <Link href="/" className="block px-2 py-2 font-sans text-xs text-white/60">
          Ver sitio ↗
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="block w-full px-2 py-2 text-left font-sans text-xs text-white/60 hover:text-white"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
