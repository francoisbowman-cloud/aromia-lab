import type { Metadata } from "next";
import { getPerfumes } from "@/lib/api";
import { DiscoveryDashboard } from "@/components/discovery/DiscoveryDashboard";

export const metadata: Metadata = { title: "Tu mapa olfativo — Aromia", description: "Una vista viva de tus afinidades de familias, notas, perfumistas y recomendaciones en Aromia." };

export default async function DescubrirPage() {
  const perfumes = await getPerfumes();
  return (
    <main className="bg-[#fbf8f3] text-ink dark:bg-[#0f0c09]">
      <section className="mx-auto max-w-[1240px] px-6 py-12 lg:px-10 lg:py-20">
        <div className="grid gap-8 pb-12 lg:grid-cols-[1.1fr_.75fr] lg:items-end">
          <div>
            <p className="font-plex text-[9px] uppercase tracking-[.2em] text-gold-contrast">Discovery</p>
            <h1 className="mt-5 max-w-[10ch] font-display text-[50px] leading-[.94] tracking-[-.035em] sm:text-[58px] lg:text-[70px]">Tu mapa olfativo.</h1>
          </div>
          <p className="max-w-[42ch] font-sans text-base leading-7 text-muted lg:justify-self-end">Tus visitas al catálogo, las notas que exploras y tu resultado del Quiz afinan las siguientes recomendaciones.</p>
        </div>
        <DiscoveryDashboard perfumes={perfumes}/>
      </section>
    </main>
  );
}
