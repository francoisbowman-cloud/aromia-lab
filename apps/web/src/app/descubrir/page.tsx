import type { Metadata } from "next";
import Link from "next/link";
import { getPerfumes } from "@/lib/api";
import { DiscoveryDashboard } from "@/components/discovery/DiscoveryDashboard";

export const metadata: Metadata = {
  title: "Tu mapa olfativo — Aromia",
  description: "Una vista viva de tus afinidades de familias, notas, perfumistas y recomendaciones en Aromia.",
};

export default async function DescubrirPage() {
  const perfumes = await getPerfumes();

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto max-w-[1380px] px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-8 pb-12 lg:grid-cols-[1.12fr_.7fr] lg:items-end lg:pb-16">
          <div>
            <p className="font-plex text-xs uppercase tracking-[.16em] text-[var(--aromia-editorial-accent)]">Discovery</p>
            <h1 className="mt-4 max-w-[9ch] font-display text-[54px] leading-[.88] tracking-[-.05em] sm:text-[72px] lg:text-[92px]">Tu mapa olfativo.</h1>
            <p className="mt-6 max-w-[28ch] font-display text-[26px] leading-[1.1] tracking-[-.02em] text-[var(--aromia-editorial-accent)] sm:text-[31px]">Una cartografía que se forma a partir de lo que realmente exploras.</p>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-[42ch] font-sans text-base leading-7 text-muted">Familias, notas, autorías y perfumes se ordenan como un atlas vivo. Sin puntuaciones inventadas ni perfiles genéricos.</p>
            <Link href="/quiz" className="mt-6 inline-flex min-h-11 items-center border-b border-ink font-plex text-xs uppercase tracking-[.12em] text-ink">¿Empiezas de cero? Haz el Quiz →</Link>
          </div>
        </div>
        <DiscoveryDashboard perfumes={perfumes} />
      </section>
    </main>
  );
}
