import { makeSubBatchMetadata, SubBatch01Story } from "../subBatch01Story";

const slug = "cuando-ya-no-hueles-tu-perfume" as const;
export const metadata = makeSubBatchMetadata(slug);
export default function Page() { return <SubBatch01Story slug={slug} />; }
