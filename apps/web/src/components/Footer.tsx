import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 p-8 text-center font-sans text-sm text-muted lg:flex-row lg:justify-between lg:text-left">
        <span className="font-display text-base tracking-[.06em] text-ink">AROMIA</span>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <li>
            <Link href="/catalogo" className="nav-link transition hover:text-ink">
              Catálogo
            </Link>
          </li>
          <li>
            <Link href="/magazine" className="nav-link transition hover:text-ink">
              Magazine
            </Link>
          </li>
          <li>
            <Link href="/academia" className="nav-link transition hover:text-ink">
              Academia
            </Link>
          </li>
          <li>
            <Link href="/quiz" className="nav-link transition hover:text-ink">
              Quiz
            </Link>
          </li>
          <li>
            <Link href="/club" className="nav-link transition hover:text-ink">
              Club
            </Link>
          </li>
          <li>
            <Link href="/privacidad" className="nav-link transition hover:text-ink">
              Privacidad
            </Link>
          </li>
        </ul>
        <span>&copy; {new Date().getFullYear()} Aromia</span>
      </div>
    </footer>
  );
}
