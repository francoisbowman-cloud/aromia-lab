import type { Metadata } from "next";
import { getPerfumes } from "@/lib/api";
import { EditorialMotionPilot } from "@/components/home/EditorialMotionPilot";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Aromia — Editorial Motion Pilot",
  description: "Piloto aislado de la skill de composición espacial y motion editorial.",
  robots: { index: false, follow: false },
};

export default async function EditorialMotionPilotPage() {
  const perfumes = await getPerfumes();
  return <EditorialMotionPilot perfumes={perfumes} />;
}
