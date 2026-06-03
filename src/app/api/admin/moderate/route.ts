import { NextRequest, NextResponse } from "next/server"
import { octokit, owner, repo } from "@/lib/github"

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization")
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  try {
    const { prNumber, branchName, action } = await req.json()

    if (!prNumber || !branchName || !action) {
      return NextResponse.json({ error: "Missing parameters." }, { status: 400 })
    }

    if (action === "approve") {
      await octokit.pulls.merge({
        owner,
        repo,
        pull_number: prNumber,
        commit_title: `merge: approve feedback (PR #${prNumber})`,
      })

      await octokit.git.deleteRef({
        owner,
        repo,
        ref: `heads/${branchName}`,
      })

      return NextResponse.json({
        success: true,
        message: "PR merged. Vercel will redeploy.",
      })
    } else if (action === "reject") {
      await octokit.pulls.update({
        owner,
        repo,
        pull_number: prNumber,
        state: "closed",
      })

      await octokit.git.deleteRef({
        owner,
        repo,
        ref: `heads/${branchName}`,
      })

      return NextResponse.json({
        success: true,
        message: "Feedback rejected and branch deleted.",
      })
    }

    if (action === "revert") {
      if (!prNumber) {
        return NextResponse.json({ error: "Missing prNumber." }, { status: 400 })
      }

      const { data: pr } = await octokit.pulls.get({
        owner,
        repo,
        pull_number: prNumber,
      })

      if (!pr.merge_commit_sha) {
        return NextResponse.json(
          { error: "This PR has no merge commit to revert." },
          { status: 400 }
        )
      }

      const revertBranch = `revert/feedback-pr-${prNumber}`
      const { data: mainRef } = await octokit.git.getRef({
        owner,
        repo,
        ref: "heads/main",
      })

      await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${revertBranch}`,
        sha: mainRef.object.sha,
      })

      await octokit.repos.merge({
        owner,
        repo,
        base: revertBranch,
        head: mainRef.object.sha,
      })

      const { data: mergeCommit } = await octokit.git.getCommit({
        owner,
        repo,
        commit_sha: pr.merge_commit_sha,
      })

      const parentSha = mergeCommit.parents[0].sha
      const { data: parentCommit } = await octokit.git.getCommit({
        owner,
        repo,
        commit_sha: parentSha,
      })

      const { data: newCommit } = await octokit.git.createCommit({
        owner,
        repo,
        message: `revert: undo feedback PR #${prNumber}`,
        tree: parentCommit.tree.sha,
        parents: [mainRef.object.sha],
      })

      await octokit.git.updateRef({
        owner,
        repo,
        ref: `heads/${revertBranch}`,
        sha: newCommit.sha,
        force: true,
      })

      const { data: revertPR } = await octokit.pulls.create({
        owner,
        repo,
        title: `Revert feedback PR #${prNumber}`,
        head: revertBranch,
        base: "main",
        body: `Reverts the merge commit from PR #${prNumber}.`,
      })

      await octokit.pulls.merge({
        owner,
        repo,
        pull_number: revertPR.number,
        commit_title: `revert: undo feedback PR #${prNumber}`,
      })

      await octokit.git.deleteRef({
        owner,
        repo,
        ref: `heads/${revertBranch}`,
      })

      return NextResponse.json({
        success: true,
        message: `Feedback from PR #${prNumber} reverted. Vercel will redeploy.`,
      })
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 })
  } catch (error) {
    console.error("Error processing moderation:", error)
    return NextResponse.json(
      { error: "Error executing moderation via GitHub API." },
      { status: 500 }
    )
  }
}
