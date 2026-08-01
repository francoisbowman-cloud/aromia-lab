import Link from "next/link";

const ECOSISTEMA = [
  { href: "/magazine", label: "Magazine" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/academia", label: "Academia" },
];

const COMUNIDAD = [
  { href: "/quiz", label: "Quiz" },
  { href: "/club", label: "Club" },
  { href: "/privacidad", label: "Privacidad" },
];

const VALORES = ["Honestidad", "Educación", "Elegancia"];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface font-sans print:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-9 lg:px-10 lg:py-14">
        <div>
          <span className="font-display text-xl tracking-[.24em] text-ink">AROMIA</span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            La plataforma de perfumería más respetada del mundo hispanohablante.
            Honestidad, educación y elegancia.
          </p>
        </div>

        <div>
          <div className="mb-4 text-[11px] uppercase tracking-[.18em] text-gold-contrast">
            Ecosistema
          </div>
          <ul className="flex flex-col gap-2.5">
            {ECOSISTEMA.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link text-sm text-muted transition hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-4 text-[11px] uppercase tracking-[.18em] text-gold-contrast">
            Comunidad
          </div>
          <ul className="flex flex-col gap-2.5">
            {COMUNIDAD.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link text-sm text-muted transition hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-4 text-[11px] uppercase tracking-[.18em] text-gold-contrast">
            Valores
          </div>
          <p className="text-sm leading-[1.9] text-muted">
            {VALORES.map((valor, i) => (
              <span key={valor}>
                {valor}
                {i < VALORES.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-6 py-5 text-xs text-muted lg:px-10">
          <span className="font-medium text-ink">
            As an Amazon Associate, we earn from qualifying purchases.
          </span>
          <span>
            &copy; {new Date().getFullYear()} Aromia. La autoridad editorial que además vende. Este
            sitio contiene enlaces de afiliado.
          </span>
        </div>
      </div>
    </footer>
  );
}
