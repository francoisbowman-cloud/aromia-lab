import {NextRequest,NextResponse} from "next/server";
import {adminAuthorizationError} from "@/lib/adminApiProxy";
import {inspectLocalVisualAsset} from "@/lib/visualEvidence";
import {planVisualReplacement} from "@/lib/visualReplacementPlan";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const noStore={"Cache-Control":"private, no-store, max-age=0"};
// A GET-only local calculation, never a file write or permission to release.
export async function GET(request:NextRequest) {
  const denied=await adminAuthorizationError();
  if(denied)return denied;
  if(process.env.VISUAL_EVIDENCE_INSPECTION_ENABLED!=="true")
    return NextResponse.json({error:"Visual evidence inspector disabled"},{status:503,headers:noStore});
  const q=request.nextUrl.searchParams;
  const reason=q.get("reason")??"",slug=q.get("slug")??"";
  if(reason.length>3000 || slug.length>160)
    return NextResponse.json({error:"invalid_visual_replacement_proposal"},{status:400,headers:noStore});
  try{
    const root=process.cwd().replace(/\/apps\/web$/,"");
    const [current,candidate]=await Promise.all([
      inspectLocalVisualAsset(root,q.get("current")),
      inspectLocalVisualAsset(root,q.get("candidate"))
    ]);
    const plan=planVisualReplacement({productSlug:slug,current,candidate,reason});
    return NextResponse.json(plan,{headers:noStore});
  }catch(error){
    const code=error instanceof Error?error.message:"visual_replacement_unavailable";
    return NextResponse.json({error:code},{status:400,headers:noStore});
  }
}
