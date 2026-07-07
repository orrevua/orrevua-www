import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/rate-limit"

function sanitize(value: unknown): string {
  if (typeof value !== "string") return ""
  return value.replace(/<[^>]*>/g, "").trim()
}

interface FreelanceData {
  name: string
  email: string
  company: string
  projectType: string
  budget: string
  timeline: string
  description: string
  honeypot: string
}

function validate(body: Record<string, unknown>):
  | { valid: true; data: FreelanceData }
  | { valid: false; error: string } {
  const name = sanitize(body.name)
  const email = sanitize(body.email)
  const company = sanitize(body.company)
  const projectType = sanitize(body.projectType)
  const budget = sanitize(body.budget)
  const timeline = sanitize(body.timeline)
  const description = sanitize(body.description)
  const honeypot = sanitize(body.website)

  if (!name || name.length > 100)
    return { valid: false, error: "Name is required and must be under 100 characters." }
  if (!email || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { valid: false, error: "A valid email is required." }
  if (company.length > 100)
    return { valid: false, error: "Company must be under 100 characters." }
  if (projectType.length > 100)
    return { valid: false, error: "Project type must be under 100 characters." }
  if (budget.length > 100)
    return { valid: false, error: "Budget must be under 100 characters." }
  if (timeline.length > 100)
    return { valid: false, error: "Timeline must be under 100 characters." }
  if (!description || description.length < 20)
    return { valid: false, error: "Description is required and must be at least 20 characters." }
  if (description.length > 3000)
    return { valid: false, error: "Description must be under 3000 characters." }

  return {
    valid: true,
    data: { name, email, company, projectType, budget, timeline, description, honeypot },
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function buildEmailHtml(data: Omit<FreelanceData, "honeypot">): string {
  const rows = [
    ["Name", data.name],
    ["Email", `<a href="mailto:${escapeHtml(data.email)}" style="color:#C2410C;text-decoration:none">${escapeHtml(data.email)}</a>`],
    data.company ? ["Company", data.company] : null,
    data.projectType ? ["Project type", data.projectType] : null,
    data.budget ? ["Budget", data.budget] : null,
    data.timeline ? ["Timeline", data.timeline] : null,
  ].filter(Boolean) as [string, string][]

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 14px;font-weight:600;vertical-align:top;white-space:nowrap;color:#6B5744;font-size:14px">${escapeHtml(label)}</td><td style="padding:8px 14px;color:#2D2013;font-size:14px">${value}</td></tr>`
    )
    .join("")

  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;background:#FAF6F1;border-radius:12px;overflow:hidden;border:1px solid #D1C4B4">
      <div style="background:#C2410C;padding:24px 28px">
        <h2 style="margin:0;color:#FAF6F1;font-size:20px;font-weight:700">New Freelance Request</h2>
        <p style="margin:4px 0 0;color:#FAF6F1;opacity:0.85;font-size:13px">via orrevua.com</p>
      </div>
      <div style="padding:24px 28px">
        <table style="border-collapse:collapse;width:100%;margin-bottom:20px;background:#F0EAE2;border-radius:8px;overflow:hidden">${tableRows}</table>
        <h3 style="margin:0 0 8px;color:#2D2013;font-size:15px;font-weight:600">Description</h3>
        <div style="padding:14px 18px;background:#E5DDD3;border-radius:8px;white-space:pre-wrap;line-height:1.6;color:#2D2013;font-size:14px;border:1px solid #D1C4B4">${escapeHtml(data.description)}</div>
      </div>
      <div style="padding:16px 28px;border-top:1px solid #D1C4B4">
        <p style="margin:0;font-size:12px;color:#8B7A68">Sent from orrevua.com freelance form</p>
      </div>
    </div>
  `
}

async function sendEmail(data: Omit<FreelanceData, "honeypot">): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.error("BREVO_API_KEY is not configured — freelance email not sent")
    return
  }

  const senderName = process.env.BREVO_SENDER_NAME ?? "Freelance"
  const senderEmail = process.env.BREVO_SENDER_EMAIL
  if (!senderEmail) {
    console.error("BREVO_SENDER_EMAIL is not configured — freelance email not sent")
    return
  }

  const notifyEmail = process.env.FREELANCE_NOTIFY_EMAIL ?? "felipevictor67@gmail.com"

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: notifyEmail }],
      replyTo: { email: data.email, name: data.name },
      subject: `Freelance request from ${data.name}`,
      htmlContent: buildEmailHtml(data),
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error("Brevo API error:", res.status, body)
  }
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin")
    const host = request.headers.get("host")
    if (!origin || !host || new URL(origin).host !== host) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 })
    }

    const ip =
      request.headers.get("x-real-ip") ??
      request.headers.get("x-forwarded-for")?.split(",").pop()?.trim() ??
      "unknown"
    const limit = await checkRateLimit(`freelance:${ip}`)
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

    const { honeypot, ...data } = result.data

    if (honeypot) {
      return NextResponse.json({ success: true }, { status: 201 })
    }

    await sendEmail(data)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("Freelance request submission failed:", message)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    )
  }
}
