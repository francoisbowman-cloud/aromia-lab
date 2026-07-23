"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", match: (p: string) => p === "/admin" },
  {
    href: "/admin/catalogo",
    label: "Catálogo",
    match: (p: string) => p.startsWith("/admin/catalogo") || p.startsWith("/admin/perfumes"),
  },
  { href: "/admin/magazine", label: "Magazine", match: (p: string) => p.startsWith("/admin/magazine") },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Cierra el drawer mobile al cambiar de ruta.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between bg-admin-sidebar px-4 py-3 text-white lg:hidden">
        <span className="font-display text-lg tracking-[.12em] text-gold-dark">AROMIA</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="flex h-9 w-9 items-center justify-center rounded text-white/80 hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[240px] flex-col bg-admin-sidebar p-4 text-white transition-transform duration-200 lg:sticky lg:top-0 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2 pb-6">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg tracking-[.12em] text-gold-dark">AROMIA</span>
            <span className="font-sans text-[9px] tracking-[.18em] text-white/50">2.0</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="flex h-8 w-8 items-center justify-center rounded text-white/70 hover:bg-white/10 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="grid gap-1">
          {NAV.map((item) => {
            const active = item.match(pathname);
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
    </>
  );
}
