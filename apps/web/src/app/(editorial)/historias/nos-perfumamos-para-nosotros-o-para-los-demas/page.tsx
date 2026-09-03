import { makeSubBatchMetadata, SubBatch01Story } from "../subBatch01Story";

const slug = "nos-perfumamos-para-nosotros-o-para-los-demas" as const;
export const metadata = makeSubBatchMetadata(slug);
export default function Page() { return <SubBatch01Story slug={slug} />; }
