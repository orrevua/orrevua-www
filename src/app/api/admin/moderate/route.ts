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

    return NextResponse.json({ error: "Invalid action." }, { status: 400 })
  } catch (error) {
    console.error("Error processing moderation:", error)
    return NextResponse.json(
      { error: "Error executing moderation via GitHub API." },
      { status: 500 }
    )
  }
}
