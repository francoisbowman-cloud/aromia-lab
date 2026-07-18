import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 p-8 text-center font-sans text-sm text-muted lg:flex-row lg:justify-between lg:text-left">
        <span className="font-display text-base tracking-[.06em] text-ink">AROMIA</span>
        <ul className="flex gap-6">
          <li>
            <Link href="/perfumes" className="hover:text-ink">
              Perfumes
            </Link>
          </li>
          <li>
            <Link href="/articulos" className="hover:text-ink">
              Magazine
            </Link>
          </li>
          <li>
            <Link href="/quiz" className="hover:text-ink">
              Quiz
            </Link>
          </li>
        </ul>
        <span>&copy; {new Date().getFullYear()} Aromia</span>
      </div>
    </footer>
  );
}
