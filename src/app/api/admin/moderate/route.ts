import { NextRequest, NextResponse } from "next/server"
import { octokit, owner, repo, FEEDBACKS_PATH, BASE_BRANCH } from "@/lib/github"
import { isAdminTokenConfigured, isAuthorizedAdmin } from "@/lib/admin-auth"
import type { Feedback } from "@/types"

export async function POST(req: NextRequest) {
  if (!isAdminTokenConfigured()) {
    console.warn("ADMIN_SECRET_TOKEN is not set.")
    return NextResponse.json(
      { error: "Server misconfiguration." },
      { status: 500 }
    )
  }

  const authHeader = req.headers.get("Authorization")
  if (!isAuthorizedAdmin(authHeader)) {
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
      const feedbackId = branchName.replace("feedback/", "")

      const { data: fileData } = await octokit.repos.getContent({
        owner,
        repo,
        path: FEEDBACKS_PATH,
        ref: BASE_BRANCH,
      })

      if (Array.isArray(fileData) || fileData.type !== "file") {
        return NextResponse.json(
          { error: "Could not read feedbacks file." },
          { status: 500 }
        )
      }

      const content = Buffer.from(fileData.content, "base64").toString("utf-8")
      const feedbacks: Feedback[] = JSON.parse(content)
      const filtered = feedbacks.filter((f) => f.id !== feedbackId)

      if (filtered.length === feedbacks.length) {
        return NextResponse.json(
          { error: `Feedback ${feedbackId} not found in feedbacks.json.` },
          { status: 404 }
        )
      }

      const updatedJson = JSON.stringify(filtered, null, 2) + "\n"
      const encodedContent = Buffer.from(updatedJson, "utf-8").toString("base64")

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: FEEDBACKS_PATH,
        message: `revert: remove feedback ${feedbackId} (PR #${prNumber})`,
        content: encodedContent,
        branch: BASE_BRANCH,
        sha: fileData.sha,
      })

      return NextResponse.json({
        success: true,
        message: `Feedback ${feedbackId} removed. Vercel will redeploy.`,
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
