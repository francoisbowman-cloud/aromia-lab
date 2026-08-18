import Link from "next/link";

const ECOSISTEMA = [
  { href: "/magazine", label: "Magazine" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/academia", label: "Academia" },
  { href: "/perfumistas", label: "Perfumistas" },
];

const COMUNIDAD = [
  { href: "/quiz", label: "Quiz" },
  { href: "/descubrir", label: "Mi mapa olfativo" },
  { href: "/club", label: "Club" },
  { href: "/privacidad", label: "Privacidad" },
];

const VALORES = ["Claridad", "Curiosidad", "Criterio"];

export default function Footer() {
  return (
    <footer className="bg-[#fffdf8] font-sans dark:bg-[#100d0a] print:hidden">
      <div className="mx-auto max-w-[1440px] px-6 py-14 lg:px-10 lg:py-20">
        <div className="flex items-center justify-between font-plex text-[8px] uppercase tracking-[.18em] text-muted"><span>Aromia</span><span>Fin / índice</span></div>
        <div className="mt-10 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.55fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <span className="font-display text-[28px] tracking-[.16em] text-ink">AROMIA</span>
            <p className="mt-5 max-w-[34ch] text-sm leading-7 text-muted">Perfumes, materias e historias para descubrir con más contexto y menos ruido.</p>
          </div>
          <div><div className="mb-5 font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Explorar</div><ul className="flex flex-col gap-3">{ECOSISTEMA.map((item) => <li key={item.href}><Link href={item.href} className="nav-link text-sm text-muted transition hover:text-ink">{item.label}</Link></li>)}</ul></div>
          <div><div className="mb-5 font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Continuar</div><ul className="flex flex-col gap-3">{COMUNIDAD.map((item) => <li key={item.href}><Link href={item.href} className="nav-link text-sm text-muted transition hover:text-ink">{item.label}</Link></li>)}</ul></div>
          <div><div className="mb-5 font-plex text-[9px] uppercase tracking-[.18em] text-gold-contrast">Aromia</div><p className="text-sm leading-[2] text-muted">{VALORES.map((valor, i) => <span key={valor}>{valor}{i < VALORES.length - 1 ? <br /> : null}</span>)}</p></div>
        </div>
      </div>

      <div className="bg-[#f7f1e8] dark:bg-[#15110d]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-6 py-6 font-plex text-[8px] leading-5 uppercase tracking-[.08em] text-muted lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <span className="max-w-[54ch] normal-case tracking-normal text-ink">As an Amazon Associate, we earn from qualifying purchases.</span>
          <span className="max-w-[72ch] lg:text-right">&copy; {new Date().getFullYear()} Aromia · Este sitio contiene enlaces de afiliado.</span>
        </div>
      </div>
    </footer>
  );
}
