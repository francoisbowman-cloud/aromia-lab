import { makeSubBatchMetadata, SubBatch01Story } from "../subBatch01Story";

const slug = "antes-del-perfume-ya-oliamos" as const;
export const metadata = makeSubBatchMetadata(slug);
export default function Page() { return <SubBatch01Story slug={slug} />; }
