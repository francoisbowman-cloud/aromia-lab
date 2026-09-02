import Link from "next/link";

const EXPLORAR = [
  { href: "/magazine", label: "Historias" },
  { href: "/academia", label: "Saber" },
  { href: "/perfumistas", label: "Personas" },
  { href: "/descubrir", label: "Discovery" },
];

const CONTINUAR = [
  { href: "/quiz", label: "Empezar mi mapa" },
  { href: "/buscar", label: "Buscar" },
  { href: "/club", label: "Club" },
  { href: "/privacidad", label: "Privacidad" },
];

const VALORES = ["Claridad", "Curiosidad", "Criterio"];

export default function Footer() {
  return (
    <footer className="bg-[var(--aromia-paper-clean)] font-sans print:hidden">
      <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-10 lg:py-20">
        <div className="flex items-center justify-between font-plex text-xs uppercase tracking-[.16em] text-muted"><span>Aromia</span><span>Fin / índice</span></div>
        <div className="mt-10 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.55fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <span className="font-display text-[28px] tracking-[.16em] text-ink">AROMIA</span>
            <p className="mt-5 max-w-[34ch] text-sm leading-7 text-muted">Una revista de perfumería para seguir historias, materias, personas y las pistas que conectan unas con otras.</p>
          </div>
          <div><div className="mb-3 font-plex text-xs uppercase tracking-[.16em] text-gold-contrast">Explorar</div><ul className="flex flex-col gap-1">{EXPLORAR.map((item) => <li key={item.href}><Link href={item.href} className="nav-link inline-flex min-h-11 items-center text-sm text-muted transition hover:text-ink">{item.label}</Link></li>)}</ul></div>
          <div><div className="mb-3 font-plex text-xs uppercase tracking-[.16em] text-gold-contrast">Continuar</div><ul className="flex flex-col gap-1">{CONTINUAR.map((item) => <li key={item.href}><Link href={item.href} className="nav-link inline-flex min-h-11 items-center text-sm text-muted transition hover:text-ink">{item.label}</Link></li>)}</ul></div>
          <div><div className="mb-5 font-plex text-xs uppercase tracking-[.16em] text-gold-contrast">Aromia</div><p className="text-sm leading-[2] text-muted">{VALORES.map((valor, i) => <span key={valor}>{valor}{i < VALORES.length - 1 ? <br /> : null}</span>)}</p></div>
        </div>
      </div>

      <div className="bg-[var(--aromia-paper-soft)]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-6 py-6 font-plex text-xs leading-5 tracking-[.04em] text-muted lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <span className="max-w-[62ch]">Aromia puede recibir una comisión por compras elegibles realizadas desde algunos enlaces. La selección editorial no depende de esos enlaces.</span>
          <span className="max-w-[72ch] lg:text-right">&copy; {new Date().getFullYear()} Aromia · Una fragancia, una historia.</span>
        </div>
      </div>
    </footer>
  );
}
