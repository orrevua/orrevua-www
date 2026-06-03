import { NextRequest, NextResponse } from "next/server"
import { octokit, owner, repo, FEEDBACKS_PATH, BASE_BRANCH } from "@/lib/github"
import { checkRateLimit } from "@/lib/rate-limit"
import type { Feedback } from "@/types"

function sanitize(value: unknown): string {
  if (typeof value !== "string") return ""
  return value.replace(/<[^>]*>/g, "").trim()
}

function sanitizeForCommit(value: string): string {
  return value.replace(/[\r\n\t\u0000\u0001]+/g, " ").replace(/\s+/g, " ").trim()
}

function validate(body: Record<string, unknown>): {
  valid: true
  data: { name: string; role: string; email: string; message: string }
} | { valid: false; error: string } {
  const name = sanitize(body.name)
  const role = sanitize(body.role)
  const email = sanitize(body.email)
  const message = sanitize(body.message)

  if (!name || name.length > 100)
    return { valid: false, error: "Name is required and must be under 100 characters." }
  if (role.length > 100)
    return { valid: false, error: "Role must be under 100 characters." }
  if (email.length > 200)
    return { valid: false, error: "Email must be under 200 characters." }
  if (!message || message.length < 10)
    return { valid: false, error: "Message is required and must be at least 10 characters." }
  if (message.length > 1000)
    return { valid: false, error: "Message must be under 1000 characters." }

  return { valid: true, data: { name, role, email, message } }
}

export async function POST(request: NextRequest) {
  try {
    const ipHeader = request.headers.get("x-forwarded-for") ?? ""
    const ip = ipHeader.split(",")[0]?.trim() || "unknown"
    const limit = await checkRateLimit(ip)
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before submitting again." },
        {
          status: 429,
          headers:
            limit.retryAfterMs > 0
              ? { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) }
              : undefined,
        }
      )
    }

    const body = await request.json()
    const result = validate(body)
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    const { name, role, email, message } = result.data
    const safeName = sanitizeForCommit(name)
    const feedbackId = "fb_" + Date.now()
    const newBranchName = "feedback/" + feedbackId

    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${BASE_BRANCH}`,
    })

    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranchName}`,
      sha: refData.object.sha,
    })

    let feedbacks: Feedback[] = []
    let fileSha: string | undefined

    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner,
        repo,
        path: FEEDBACKS_PATH,
        ref: newBranchName,
      })

      if (!Array.isArray(fileData) && fileData.type === "file") {
        const content = Buffer.from(fileData.content, "base64").toString("utf-8")
        feedbacks = JSON.parse(content)
        fileSha = fileData.sha
      }
    } catch (err: unknown) {
      const is404 = err instanceof Error && "status" in err && (err as { status: number }).status === 404
      if (!is404) throw err
    }

    const newFeedback: Feedback = {
      id: feedbackId,
      name,
      role,
      message,
      date: new Date().toISOString(),
    }

    feedbacks.push(newFeedback)
    const updatedJson = JSON.stringify(feedbacks, null, 2) + "\n"
    const encodedContent = Buffer.from(updatedJson, "utf-8").toString("base64")

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: FEEDBACKS_PATH,
      message: `feat: add feedback from ${safeName} (${feedbackId})`,
      content: encodedContent,
      branch: newBranchName,
      ...(fileSha ? { sha: fileSha } : {}),
    })

    const prBody = [
      `**Name:** ${name}`,
      role ? `**Role:** ${role}` : null,
      email ? `**Email:** ${email}` : null,
      "",
      `**Message:**`,
      `> ${message}`,
    ]
      .filter((line) => line !== null)
      .join("\n")

    await octokit.pulls.create({
      owner,
      repo,
      title: `Feedback: ${name} (${feedbackId})`,
      body: prBody,
      head: newBranchName,
      base: BASE_BRANCH,
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("Feedback submission failed:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    )
  }
}
