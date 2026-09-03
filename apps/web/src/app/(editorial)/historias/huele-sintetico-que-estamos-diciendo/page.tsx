import { makeSubBatchMetadata, SubBatch01Story } from "../subBatch01Story";

const slug = "huele-sintetico-que-estamos-diciendo" as const;
export const metadata = makeSubBatchMetadata(slug);
export default function Page() { return <SubBatch01Story slug={slug} />; }
