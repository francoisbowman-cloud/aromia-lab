import { makeSubBatchMetadata, SubBatch01Story } from "../subBatch01Story";

const slug = "podemos-describir-un-olor-sin-compararlo" as const;
export const metadata = makeSubBatchMetadata(slug);
export default function Page() { return <SubBatch01Story slug={slug} />; }
