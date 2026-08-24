import type { Metadata } from "next";
import { getPerfumes } from "@/lib/api";
import { DiscoveryDashboard } from "@/components/discovery/DiscoveryDashboard";

export const metadata: Metadata = {
  title: "Tu mapa olfativo — Aromia",
  description: "Una vista viva de tus afinidades de familias, notas, perfumistas y recomendaciones en Aromia.",
};

export default async function DescubrirPage() {
  const perfumes = await getPerfumes();

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-ink dark:bg-[#0e1311]">
      <section className="mx-auto max-w-[1380px] px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-8 pb-12 lg:grid-cols-[1.12fr_.7fr] lg:items-end lg:pb-16">
          <div>
            <h1 className="max-w-[9ch] font-display text-[54px] leading-[.88] tracking-[-.05em] sm:text-[72px] lg:text-[92px]">Tu mapa olfativo.</h1>
            <p className="mt-6 max-w-[28ch] font-display text-[26px] leading-[1.1] tracking-[-.02em] text-[#5a6b54] sm:text-[31px]">Una cartografía que se forma a partir de lo que realmente exploras.</p>
          </div>
          <p className="max-w-[42ch] font-sans text-base leading-7 text-muted lg:justify-self-end">Familias, notas, autorías y perfumes se ordenan como un atlas vivo. Sin puntuaciones inventadas ni perfiles genéricos.</p>
        </div>
        <DiscoveryDashboard perfumes={perfumes} />
      </section>
    </main>
  );
}
