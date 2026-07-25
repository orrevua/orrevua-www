import { NextRequest, NextResponse } from "next/server"
import { octokit, owner, repo } from "@/lib/github"
import {
  clientIp,
  enforceRateLimit,
  requireAdmin,
  requireSameOrigin,
} from "@/lib/blog/route-guards"
import { parseBlogBranch } from "@/lib/blog/validate"

export async function POST(req: NextRequest) {
  const authFail = requireAdmin(req)
  if (authFail) return authFail
  const originFail = requireSameOrigin(req)
  if (originFail) return originFail
  const rlFail = await enforceRateLimit(`blog:merge:${clientIp(req)}`)
  if (rlFail) return rlFail

  try {
    const { prNumber, branchName } = (await req.json()) as {
      prNumber?: number
      branchName?: string
    }
    if (!prNumber || !branchName) {
      return NextResponse.json({ error: "Missing parameters." }, { status: 400 })
    }
    const parsed = parseBlogBranch(branchName)
    if (!parsed) {
      return NextResponse.json({ error: "Invalid branch name." }, { status: 400 })
    }

    const { data: pr } = await octokit.pulls.get({ owner, repo, pull_number: prNumber })
    if (pr.mergeable === false) {
      return NextResponse.json(
        { error: `PR is not mergeable (state: ${pr.mergeable_state}).` },
        { status: 409 }
      )
    }

    await octokit.pulls.merge({
      owner,
      repo,
      pull_number: prNumber,
      commit_title: `merge: blog ${parsed.slug} (PR #${prNumber})`,
    })

    await octokit.git.deleteRef({ owner, repo, ref: `heads/${branchName}` })

    return NextResponse.json({
      success: true,
      message: "PR merged. Vercel will redeploy.",
    })
  } catch (error) {
    console.error("Error merging blog PR:", error)
    const message = error instanceof Error ? error.message : "Unknown error."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
