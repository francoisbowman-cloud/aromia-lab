import { makeSubBatchMetadata, SubBatch01Story } from "../subBatch01Story";

const slug = "comprar-para-oler-o-comprar-para-tener" as const;
export const metadata = makeSubBatchMetadata(slug);
export default function Page() { return <SubBatch01Story slug={slug} />; }
