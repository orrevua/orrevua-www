import { NextRequest, NextResponse } from "next/server"
import { octokit, owner, repo } from "@/lib/github"

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization")
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  try {
    const { data: pulls } = await octokit.pulls.list({
      owner,
      repo,
      state: "open",
      per_page: 50,
    })

    const feedbackPRs = pulls
      .filter((pr) => pr.head.ref.startsWith("feedback/"))
      .map((pr) => ({
        prNumber: pr.number,
        title: pr.title,
        branchName: pr.head.ref,
        htmlUrl: pr.html_url,
        data: {
          name: pr.title.replace("💬 New feedback from ", ""),
          message: pr.body || "",
          date: pr.created_at,
        },
      }))

    return NextResponse.json(feedbackPRs, { status: 200 })
  } catch (error) {
    console.error("Error listing moderation PRs:", error)
    return NextResponse.json(
      { error: "Failed to fetch pending feedbacks." },
      { status: 500 }
    )
  }
}
