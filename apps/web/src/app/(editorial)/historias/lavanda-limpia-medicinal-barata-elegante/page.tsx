import type { Metadata } from "next";
import { makeSubBatchMetadata, SubBatch01Story } from "../subBatch01Story";

const slug = "lavanda-limpia-medicinal-barata-elegante" as const;
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> { return makeSubBatchMetadata(slug); }
export default function Page() { return <SubBatch01Story slug={slug} />; }
