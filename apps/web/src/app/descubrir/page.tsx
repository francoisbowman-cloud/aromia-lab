import { EditorialOpening } from "@/components/editorial/EditorialOpening";
import type { Metadata } from "next";
import Link from "next/link";
import { getDiscoverySeedPerfumes, getPerfumeFacets } from "@/lib/api";
import { DiscoveryDashboard } from "@/components/discovery/DiscoveryDashboard";

export const metadata: Metadata = {
  title: "Tu mapa olfativo — Aromia",
  description: "Una vista viva de tus afinidades de familias, notas, perfumistas y recomendaciones en Aromia.",
};

export default async function DescubrirPage() {
  // Antes: getPerfumes() traía el catálogo completo al browser solo para
  // derivar la lista de familias y rankear 6 recomendaciones. Ahora: facetas
  // (familias ya agregadas por el servidor) + una muestra acotada y diversa
  // (hasta 8 perfumes por familia) — suficiente para el atlas y para
  // rankear localmente contra el perfil, sin transportar el catálogo entero.
  // Ver handoffs/AROMIA_CODE_DISCOVERY_SEARCH_ARCHITECTURE_2026-09-20.md.
  const [facets, seedPerfumes] = await Promise.all([getPerfumeFacets(), getDiscoverySeedPerfumes(48)]);

  return (
    <main className="ed-page ed-discovery min-h-screen bg-paper text-ink">
      <section className="mx-auto max-w-[1380px] px-5 py-12 sm:px-8 lg:px-12 lg:py-20">
        <EditorialOpening label="Discovery" title="Sigue lo que te atrae." description="Empieza por una materia, descubre una familia y encuentra tu próximo perfume." image={{src:"/editorial-v1/frankincense-documentary.jpg",alt:"Resina de Boswellia sacra sobre la corteza.",credit:"Krzysztof Ziarnek · CC BY-SA 4.0"}}>
          <Link href="/descubrir/familias" className="ed-link">Explorar familias →</Link><Link href="/quiz" className="ed-link">Crear mi mapa →</Link>
        </EditorialOpening>
        <DiscoveryDashboard facets={facets.families} seedPerfumes={seedPerfumes} />
      </section>
    </main>
  );
}
