import { makeSubBatchMetadata, SubBatch01Story } from "../subBatch01Story";

const slug = "por-que-una-lista-de-notas-no-te-dice-como-huele" as const;
export const metadata = makeSubBatchMetadata(slug);
export default function Page() { return <SubBatch01Story slug={slug} />; }
