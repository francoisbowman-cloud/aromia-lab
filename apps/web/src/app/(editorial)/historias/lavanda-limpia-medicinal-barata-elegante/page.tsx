import { makeSubBatchMetadata, SubBatch01Story } from "../subBatch01Story";

const slug = "lavanda-limpia-medicinal-barata-elegante" as const;
export const metadata = makeSubBatchMetadata(slug);
export default function Page() { return <SubBatch01Story slug={slug} />; }
