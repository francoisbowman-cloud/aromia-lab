import type { Metadata } from "next";
import { makeSubBatchMetadata, SubBatch01Story } from "../subBatch01Story";

const slug = "podemos-describir-un-olor-sin-compararlo" as const;
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> { return makeSubBatchMetadata(slug); }
export default function Page() { return <SubBatch01Story slug={slug} />; }
