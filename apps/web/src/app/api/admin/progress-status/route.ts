import { NextResponse } from "next/server";
import { adminAuthorizationError } from "@/lib/adminApiProxy";
import { fetchAromiaPrStatuses } from "@/lib/githubProgress.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const privateHeaders = {"Cache-Control":"private, no-store, max-age=0"};

export async function GET() {
  const denied = await adminAuthorizationError();
  if (denied) return denied;
  try {
    const pulls = await fetchAromiaPrStatuses(process.env.GITHUB_PROGRESS_TOKEN);
    return NextResponse.json({
      source:"github_rest_pr_metadata",
      fetchedAt:new Date().toISOString(),
      pulls,
      milestonesAutomaticallyApproved:false,
      ciVerifiedByThisFeed:false,
    },{headers:privateHeaders});
  } catch {
    return NextResponse.json({
      error:"github_progress_unavailable",
      message:"No se pudo comprobar el estado actual de GitHub. Los hitos manuales no cambian.",
    },{status:503,headers:privateHeaders});
  }
}
// Deliberately no writes: GitHub PR data is an observation, not authority to publish or merge.
