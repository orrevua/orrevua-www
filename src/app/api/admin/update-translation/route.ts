import { NextRequest, NextResponse } from "next/server"
import { octokit, owner, repo, FEEDBACKS_PATH } from "@/lib/github"
import { isAdminTokenConfigured, isAuthorizedAdmin } from "@/lib/admin-auth"
import type { Feedback } from "@/types"

export async function POST(req: NextRequest) {
  if (!isAdminTokenConfigured()) {
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
    const { branchName, feedbackId, messageEn, messagePt } = await req.json()

    if (!branchName || !feedbackId) {
      return NextResponse.json({ error: "Missing parameters." }, { status: 400 })
    }

    const { data: fileData } = await octokit.repos.getContent({
      owner,
      repo,
      path: FEEDBACKS_PATH,
      ref: branchName,
    })

    if (Array.isArray(fileData) || fileData.type !== "file") {
      return NextResponse.json(
        { error: "Could not read feedbacks file." },
        { status: 500 }
      )
    }

    const content = Buffer.from(fileData.content, "base64").toString("utf-8")
    const feedbacks: Feedback[] = JSON.parse(content)

    const idx = feedbacks.findIndex((f) => f.id === feedbackId)
    if (idx === -1) {
      return NextResponse.json(
        { error: `Feedback ${feedbackId} not found.` },
        { status: 404 }
      )
    }

    if (typeof messageEn === "string") feedbacks[idx].messageEn = messageEn
    if (typeof messagePt === "string") feedbacks[idx].messagePt = messagePt

    const updatedJson = JSON.stringify(feedbacks, null, 2) + "\n"
    const encodedContent = Buffer.from(updatedJson, "utf-8").toString("base64")

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: FEEDBACKS_PATH,
      message: `chore: update translations for ${feedbackId}`,
      content: encodedContent,
      branch: branchName,
      sha: fileData.sha,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("Error updating translation:", message)
    return NextResponse.json(
      { error: "Failed to update translation." },
      { status: 500 }
    )
  }
}
