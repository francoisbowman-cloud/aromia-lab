// Server-only, read-only GitHub PR metadata for the private Aromia dashboard.
// Never count PR activity as a completed milestone or infer CI from mergeability.
export const AROMIA_TRACKED_PRS = [186,187,188,189,190,191,192,193,194,195] as const;
const REPO = "francoisbowman-cloud/aromia-lab";
type GithubPR = {
  number: number;
  state: "open"|"closed";
  draft: boolean;
  merged_at: string|null;
  html_url: string;
  title: string;
  updated_at: string;
  head: {sha: string};
};
export type PublicPrStatus = {
  number: number;
  title: string;
  state: "merged"|"open"|"draft"|"closed_without_merge";
  url: string;
  headSha: string;
  updatedAt: string;
  ci: "not_checked";
};
const isTrustedPrUrl = (url:string, number:number) =>
  url === `https://github.com/${REPO}/pull/${number}`;

export async function fetchAromiaPrStatuses(token?:string): Promise<PublicPrStatus[]> {
  const headers:Record<string,string> = {
    "Accept":"application/vnd.github+json",
    "X-GitHub-Api-Version":"2022-11-28",
    "User-Agent":"Aromia-Private-Progress",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  // Only fixed PR numbers in the trusted project's repository are queried.
  // Bounded to avoid an arbitrary GitHub API proxy and a hidden rate-cost loop.
  const prs = await Promise.all(AROMIA_TRACKED_PRS.map(async number => {
    const response = await fetch(`https://api.github.com/repos/${REPO}/pulls/${number}`, {
      headers, cache:"no-store", signal:AbortSignal.timeout(6000),
    });
    if (!response.ok) throw new Error("github_progress_unavailable");
    const value = await response.json() as GithubPR;
    if (value.number !== number || !isTrustedPrUrl(value.html_url, number) ||
        !["open","closed"].includes(value.state) ||
        typeof value.draft !== "boolean" || typeof value.title !== "string" ||
        typeof value.head?.sha !== "string" || !/^[0-9a-f]{40}$/i.test(value.head.sha) ||
        typeof value.updated_at !== "string") throw new Error("github_progress_invalid_response");
    return {
      number, title:value.title.slice(0,160),
      state: value.merged_at ? "merged" : value.state === "closed" ? "closed_without_merge" :
        value.draft ? "draft" : "open",
      url:value.html_url, headSha:value.head.sha, updatedAt:value.updated_at,
      ci:"not_checked" as const,
    } satisfies PublicPrStatus;
  }));
  return prs.sort((a,b)=>a.number-b.number);
}
