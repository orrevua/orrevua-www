import { NextRequest, NextResponse } from "next/server"
import { octokit, owner, repo, FEEDBACKS_PATH } from "@/lib/github"
import { isAdminTokenConfigured, isAuthorizedAdmin } from "@/lib/admin-auth"
import type { Feedback } from "@/types"

export async function GET(req: NextRequest) {
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

  const state = req.nextUrl.searchParams.get("state") === "merged" ? "closed" : "open"

  try {
    const { data: pulls } = await octokit.pulls.list({
      owner,
      repo,
      state,
      per_page: 50,
    })

    let feedbackIdsInFile: string[] = []
    if (state === "closed") {
      try {
        const { data: fileData } = await octokit.repos.getContent({
          owner,
          repo,
          path: "src/data/feedbacks.json",
          ref: "main",
        })

        if (!Array.isArray(fileData) && fileData.type === "file") {
          const content = Buffer.from(fileData.content, "base64").toString("utf-8")
          const feedbacks = JSON.parse(content)
          feedbackIdsInFile = feedbacks.map((f: any) => f.id)
        }
      } catch (err) {
        // if file not found or other error, leave feedbackIdsInFile empty
      }
    }

    const filteredPRs = pulls.filter((pr) => {
      if (!pr.head.ref.startsWith("feedback/")) return false
      if (state === "closed") return pr.merged_at !== null
      return true
    })

    const feedbackPRs = await Promise.all(
      filteredPRs.map(async (pr) => {
        const fid = pr.head.ref.replace("feedback/", "")
        const reverted = state === "closed" ? !feedbackIdsInFile.includes(fid) : false

        let feedbackData: Feedback | null = null
        try {
          const ref = state === "closed" ? "main" : pr.head.ref
          const { data: fileData } = await octokit.repos.getContent({
            owner,
            repo,
            path: FEEDBACKS_PATH,
            ref,
          })

          if (!Array.isArray(fileData) && fileData.type === "file") {
            const content = Buffer.from(fileData.content, "base64").toString("utf-8")
            const feedbacks: Feedback[] = JSON.parse(content)
            feedbackData = feedbacks.find((f) => f.id === fid) ?? null
          }
        } catch {
          // branch may have been deleted or file not found
        }

        return {
          prNumber: pr.number,
          title: pr.title,
          branchName: pr.head.ref,
          feedbackId: fid,
          htmlUrl: pr.html_url,
          reverted,
          data: {
            name: feedbackData?.name ?? pr.title.replace("Feedback: ", ""),
            role: feedbackData?.role ?? "",
            company: feedbackData?.company ?? "",
            message: feedbackData?.message ?? pr.body ?? "",
            messageEn: feedbackData?.messageEn ?? "",
            messagePt: feedbackData?.messagePt ?? "",
            date: feedbackData?.date ?? pr.merged_at ?? pr.created_at,
          },
        }
      })
    )

    return NextResponse.json(feedbackPRs, { status: 200 })
  } catch (error) {
    console.error("Error listing moderation PRs:", error)
    return NextResponse.json(
      { error: "Failed to fetch pending feedbacks." },
      { status: 500 }
    )
  }
}
